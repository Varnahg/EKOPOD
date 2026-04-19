import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Clock3, Play, Search, X } from 'lucide-react'

import { DetailPanel } from '@/components/detail-panel'
import { Flashcard } from '@/components/flashcard'
import { FlashcardControls, type FlashcardQuestionIndicator } from '@/components/flashcard-controls'
import { SetChooser } from '@/components/set-chooser'
import { SessionSummary } from '@/components/session-summary'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { filterQuestions, getProgressEntry } from '@/lib/content/query'
import { buildSessionQuestionIds, createSession } from '@/lib/content/session'
import { DEFAULT_FILTERS } from '@/lib/progress'
import { getSetDisplayLabel } from '@/lib/theme'
import { useContent } from '@/providers/use-content'
import { useAppStore } from '@/store/app-store'
import type { MasteryLevel } from '@/types/content'
import { cn, sortText } from '@/lib/utils'

function createFilterOptions(questions: ReturnType<typeof useContent>['validQuestions']) {
  return {
    sets: sortText([...new Set(questions.map((question) => question.set))]),
    chapters: sortText([...new Set(questions.map((question) => question.chapter))]),
  }
}

export function ExamView() {
  const content = useContent()
  const progress = useAppStore((state) => state.progress)
  const filters = useAppStore((state) => state.filters)
  const settings = useAppStore((state) => state.settings)
  const detailOpen = useAppStore((state) => state.detailOpen)
  const detailTab = useAppStore((state) => state.detailTab)
  const selectedQuestionId = useAppStore((state) => state.selectedQuestionId)
  const activeSession = useAppStore((state) => state.activeSession)
  const setFilters = useAppStore((state) => state.setFilters)
  const selectQuestion = useAppStore((state) => state.selectQuestion)
  const setDetailOpen = useAppStore((state) => state.setDetailOpen)
  const setDetailTab = useAppStore((state) => state.setDetailTab)
  const revealAnswer = useAppStore((state) => state.revealAnswer)
  const hideAnswer = useAppStore((state) => state.hideAnswer)
  const startSessionAction = useAppStore((state) => state.startSession)
  const clearSession = useAppStore((state) => state.clearSession)
  const advanceSessionAction = useAppStore((state) => state.advanceSession)
  const moveSessionNext = useAppStore((state) => state.moveSessionNext)
  const moveSessionPrevious = useAppStore((state) => state.moveSessionPrevious)
  const rateCurrentQuestion = useAppStore((state) => state.rateCurrentQuestion)
  const deferredSearch = useDeferredValue(filters.search)
  const [revealedQuestionId, setRevealedQuestionId] = useState<string | null>(null)
  const [timerEnabled, setTimerEnabled] = useState(settings.examTimerEnabled)

  const session = activeSession?.mode === 'exam' ? activeSession : null
  const filterOptions = useMemo(() => createFilterOptions(content.validQuestions), [content.validQuestions])
  const selectedSets = filters.sets
  const selectedChapter = filters.chapters[0] ?? ''

  const simplifiedFilters = useMemo(
    () => ({
      ...DEFAULT_FILTERS,
      search: deferredSearch,
      sets: filters.sets,
      chapters: filters.chapters,
      showInvalid: false,
    }),
    [deferredSearch, filters.chapters, filters.sets],
  )

  const filteredQuestions = useMemo(
    () => filterQuestions(content.validQuestions, simplifiedFilters, progress),
    [content.validQuestions, progress, simplifiedFilters],
  )
  const plannedSessionQuestionIds = useMemo(
    () => buildSessionQuestionIds(filteredQuestions, progress, 'random', 'exam'),
    [filteredQuestions, progress],
  )

  const currentQuestionId = session
    ? session.questionIds[session.currentIndex] ?? null
    : selectedQuestionId ?? filteredQuestions[0]?.id ?? null
  const currentQuestion = currentQuestionId ? content.questionMap[currentQuestionId] ?? null : null
  const relatedSummary = currentQuestion?.summaryId
    ? content.summaryMap[currentQuestion.summaryId]
    : content.summaries.find((summary) => summary.relatedQuestionIds.includes(currentQuestion?.id ?? ''))
  const relatedPdf = currentQuestion
    ? content.pdfMap[currentQuestion.source.pdfPath] ?? content.primaryPdf
    : content.primaryPdf
  const currentProgressEntry = currentQuestion ? getProgressEntry(progress, currentQuestion.id) : null
  const currentSessionRating =
    session && currentQuestionId
      ? session.ratings[currentQuestionId]?.[Math.max(session.round - 1, 0)] ?? null
      : null
  const effectiveCurrentRating = currentSessionRating ?? currentProgressEntry?.mastery ?? null
  const questionIndicators = useMemo<FlashcardQuestionIndicator[]>(() => {
    const questionIds = session ? session.questionIds : filteredQuestions.map((question) => question.id)
    const currentRoundIndex = session ? Math.max(session.round - 1, 0) : 0

    return questionIds.map((questionId, index) => {
      const question = content.questionMap[questionId]
      const storedMastery = getProgressEntry(progress, questionId).mastery
      const sessionRating = session ? session.ratings[questionId]?.[currentRoundIndex] ?? null : null

      return {
        id: questionId,
        label: String(index + 1),
        rating: sessionRating ?? storedMastery,
        title: question ? `${index + 1}. ${question.title}` : `Otázka ${index + 1}`,
        active: questionId === currentQuestionId,
        disabled: Boolean(session),
      }
    })
  }, [content.questionMap, currentQuestionId, filteredQuestions, progress, session])
  const revealed = session
    ? session.revealed || Boolean(session.completedAt)
    : Boolean(currentQuestionId && revealedQuestionId === currentQuestionId)

  useEffect(() => {
    setDetailOpen(false)
  }, [setDetailOpen])

  useEffect(() => {
    if (!selectedQuestionId && filteredQuestions[0]) {
      selectQuestion(filteredQuestions[0].id)
    }
  }, [filteredQuestions, selectQuestion, selectedQuestionId])

  useEffect(() => {
    if (!selectedQuestionId || filteredQuestions.some((question) => question.id === selectedQuestionId)) {
      return
    }

    selectQuestion(filteredQuestions[0]?.id ?? null)
    setDetailOpen(false)
  }, [filteredQuestions, selectQuestion, selectedQuestionId, setDetailOpen])

  const handleStartSession = () => {
    if (!plannedSessionQuestionIds.length) {
      return
    }

    startSessionAction(
      createSession({
        mode: 'exam',
        sourceLabel: filters.chapters[0] ?? filters.sets[0] ?? 'Simulace z aktuálního výběru',
        questionIds: plannedSessionQuestionIds,
        repeatUntilMastered: false,
        repeatThreshold: 2,
        timerEnabled,
        timerSeconds: settings.examTimerSeconds,
      }),
    )
    setDetailOpen(false)
    setRevealedQuestionId(null)
  }

  const handleReveal = () => {
    if (session) {
      if (session.revealed) {
        hideAnswer()
      } else {
        revealAnswer()
      }
      return
    }

    setRevealedQuestionId((current) => (current === currentQuestionId ? null : currentQuestionId))
  }

  const handleSelectQuestion = (questionId: string) => {
    if (session) {
      return
    }

    selectQuestion(questionId)
    setRevealedQuestionId(null)
    setDetailOpen(false)
  }

  const handleRate = (rating: MasteryLevel) => {
    rateCurrentQuestion(rating, filteredQuestions)
    setDetailOpen(false)
    if (!session) {
      setRevealedQuestionId(null)
    }
  }

  const handlePrevious = () => {
    if (!session) {
      return
    }

    moveSessionPrevious()
    setDetailOpen(false)
  }

  const handleNext = () => {
    if (!session) {
      return
    }

    const atLastQuestion = session.currentIndex >= session.questionIds.length - 1

    if (atLastQuestion) {
      const shouldFinish = window.confirm('Jsi na poslední otázce. Chceš ukončit simulaci a zobrazit shrnutí průchodu?')

      if (shouldFinish) {
        advanceSessionAction(content.validQuestions)
      }

      return
    }

    moveSessionNext()
    setDetailOpen(false)
  }

  const handleResetQuickFilters = () => {
    setFilters({
      search: '',
      chapters: [],
    })
  }

  const quickRateHandler = currentQuestion ? handleRate : undefined

  useKeyboardShortcuts(settings.keyboardShortcuts, {
    onReveal: handleReveal,
    onPrevious: handlePrevious,
    onNext: handleNext,
    onToggleDetail: () => currentQuestion && setDetailOpen(!detailOpen),
    onClose: () => setDetailOpen(false),
    onFocusSearch: () => document.getElementById('question-search')?.focus(),
    onRate: quickRateHandler,
  })

  return (
    <div className="space-y-3 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:space-y-3">
      <section className="rounded-[1.35rem] border border-border/60 bg-surface/60 p-3.5 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-[1.55rem] text-text-primary">Simulace zkoušky</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Minimalistický režim pro odpověď nanečisto.
            </p>
          </div>

          <div className="text-sm text-text-secondary">
            <div>{filteredQuestions.length} otázek v simulaci</div>
            <div>{filters.sets.length === 1 ? getSetDisplayLabel(filters.sets[0] ?? '') : 'Smíšený výběr'}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <SetChooser
            availableSets={filterOptions.sets}
            selectedSets={selectedSets}
            onChange={(sets) => setFilters({ sets })}
          />

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <label className="min-w-[14rem] flex-1">
              <span className="sr-only">Hledat</span>
              <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/35 px-3 py-2.5">
                <Search className="size-4 text-text-secondary" />
                <input
                  id="question-search"
                  value={filters.search}
                  onChange={(event) => setFilters({ search: event.target.value })}
                  placeholder="Hledat otázku nebo pojem"
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/80"
                />
              </div>
            </label>

            <label className="min-w-[14rem]">
              <span className="sr-only">Kapitola</span>
              <select
                value={selectedChapter}
                onChange={(event) =>
                  setFilters({
                    chapters: event.target.value ? [event.target.value] : [],
                  })
                }
                className="h-11 w-full rounded-2xl border border-border/50 bg-background/35 px-3 text-sm text-text-primary outline-none transition focus:border-accent/45"
              >
                <option value="">Všechny kapitoly</option>
                {filterOptions.chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={handleResetQuickFilters}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border/50 px-4 text-sm font-medium text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
            >
              <X className="size-4" />
              Vyčistit
            </button>
          </div>
        </div>
      </section>

      {session?.completedAt ? (
        <SessionSummary
          session={session}
          questionPool={content.validQuestions}
          progress={progress}
          onRestart={handleStartSession}
          onClose={clearSession}
        />
      ) : (
        <div
          className={cn(
            'grid gap-3 xl:min-h-0 xl:flex-1',
            detailOpen
              ? 'xl:grid-cols-[14.5rem_minmax(0,1fr)] 2xl:grid-cols-[14.5rem_minmax(0,1fr)_18rem]'
              : 'xl:grid-cols-[14.5rem_minmax(0,1fr)]',
          )}
        >
          <div className="xl:flex xl:min-h-0 xl:flex-col xl:gap-3">
            {!session ? (
              <section className="rounded-[1.35rem] border border-border/60 bg-surface/60 p-4 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                      Připravit simulaci
                    </p>
                    <h3 className="mt-1 font-serif text-xl text-text-primary">Losování otázek</h3>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      {plannedSessionQuestionIds.length} otázek v připravené simulaci
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartSession}
                    disabled={!plannedSessionQuestionIds.length}
                    className="inline-flex items-center gap-2 rounded-full border border-accent/45 bg-accent/12 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Play className="size-4" />
                    Spustit simulaci
                  </button>
                </div>

                <label className="mt-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-background/25 px-3.5 py-3 text-sm text-text-primary">
                  <input
                    type="checkbox"
                    checked={timerEnabled}
                    onChange={(event) => setTimerEnabled(event.target.checked)}
                    className="size-4 rounded border-border/60 bg-background/40 text-accent"
                  />
                  <span>
                    Zapnout časovač ({Math.floor(settings.examTimerSeconds / 60)}:
                    {String(settings.examTimerSeconds % 60).padStart(2, '0')}).
                  </span>
                </label>
              </section>
            ) : (
              <section className="rounded-[1.35rem] border border-border/60 bg-surface/60 p-4 shadow-card">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                  <Clock3 className="size-4" />
                  Časovač
                </div>
                <ExamTimer
                  key={`${currentQuestionId ?? 'empty'}-${session.currentIndex}-${settings.examTimerSeconds}`}
                  enabled={Boolean(session.timerEnabled)}
                  initialSeconds={settings.examTimerSeconds}
                  paused={revealed}
                />
              </section>
            )}
          </div>

          <div className="xl:min-h-0">
            <div className="mx-auto flex h-full min-h-0 w-full max-w-[44rem] flex-col gap-3">
              <FlashcardControls
                canGoBack={Boolean(session && session.currentIndex > 0)}
                canGoForward={Boolean(session ? session.questionIds.length > 0 : filteredQuestions.length)}
                revealed={revealed}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onReveal={handleReveal}
                onToggleDetail={() => currentQuestion && setDetailOpen(true)}
                onRate={quickRateHandler}
                currentRating={effectiveCurrentRating}
                canReveal={Boolean(currentQuestion)}
                caption={session ? 'Aktivní simulace' : 'Simulace'}
                progressText={
                  session
                    ? `Otázka ${session.currentIndex + 1} z ${session.questionIds.length}`
                    : `${filteredQuestions.length} dostupných otázek`
                }
                questionIndicators={questionIndicators}
                onSelectQuestionIndicator={session ? undefined : handleSelectQuestion}
              />

              <div className="min-h-0 flex-1">
                <div className="flex h-full min-h-0 items-start justify-center xl:items-start">
                  <Flashcard
                    question={currentQuestion}
                    revealed={revealed}
                    animateFlip={settings.flipAnimation && !settings.reducedMotion}
                    onReveal={handleReveal}
                    minimal
                  />
                </div>
              </div>
            </div>
          </div>

          <DetailPanel
            open={detailOpen}
            activeTab={detailTab}
            question={currentQuestion}
            relatedSummary={relatedSummary}
            relatedPdf={relatedPdf}
            onClose={() => setDetailOpen(false)}
            onTabChange={setDetailTab}
            onNavigateToQuestion={selectQuestion}
            contained
          />
        </div>
      )}
    </div>
  )
}

function ExamTimer({
  enabled,
  initialSeconds,
  paused,
}: {
  enabled: boolean
  initialSeconds: number
  paused: boolean
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    if (!enabled || paused) {
      return
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [enabled, paused])

  return (
    <div className="mt-4 rounded-[1.5rem] border border-border/50 bg-background/25 p-4 text-center">
      <div className="text-xs uppercase tracking-[0.16em] text-text-secondary">
        {enabled ? 'zbývající čas' : 'časovač vypnutý'}
      </div>
      <div className="mt-2 font-serif text-5xl text-text-primary">
        {enabled ? `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}` : '--:--'}
      </div>
      <div className="mt-2 text-sm text-text-secondary">
        {secondsLeft === 0 && enabled
          ? 'Čas vypršel, můžeš odkrýt odpověď.'
          : 'Po odhalení odpovědi se odpočet zastaví.'}
      </div>
    </div>
  )
}
