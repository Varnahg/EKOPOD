import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Clock3, Play, TimerReset } from 'lucide-react'

import { DetailPanel } from '@/components/detail-panel'
import { Flashcard } from '@/components/flashcard'
import { FlashcardControls } from '@/components/flashcard-controls'
import { QuestionFilters } from '@/components/question-filters'
import { SessionSummary } from '@/components/session-summary'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { filterQuestions, getProgressEntry } from '@/lib/content/query'
import { buildSessionQuestionIds, createSession } from '@/lib/content/session'
import { useContent } from '@/providers/use-content'
import { useAppStore } from '@/store/app-store'
import type { MasteryLevel } from '@/types/content'
import { sortText } from '@/lib/utils'

function createFilterOptions(questions: ReturnType<typeof useContent>['validQuestions']) {
  return {
    sets: sortText([...new Set(questions.map((question) => question.set))]),
    chapters: sortText([...new Set(questions.map((question) => question.chapter))]),
    subchapters: sortText(
      [...new Set(questions.map((question) => question.subchapter).filter(Boolean) as string[])],
    ),
    tags: sortText([...new Set(questions.flatMap((question) => question.tags))]),
    difficulties: [...new Set(questions.map((question) => question.difficulty))].sort((a, b) => a - b),
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
  const resetFilters = useAppStore((state) => state.resetFilters)
  const selectQuestion = useAppStore((state) => state.selectQuestion)
  const setDetailOpen = useAppStore((state) => state.setDetailOpen)
  const setDetailTab = useAppStore((state) => state.setDetailTab)
  const revealAnswer = useAppStore((state) => state.revealAnswer)
  const startSessionAction = useAppStore((state) => state.startSession)
  const clearSession = useAppStore((state) => state.clearSession)
  const moveSessionNext = useAppStore((state) => state.moveSessionNext)
  const moveSessionPrevious = useAppStore((state) => state.moveSessionPrevious)
  const rateCurrentQuestion = useAppStore((state) => state.rateCurrentQuestion)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const deferredSearch = useDeferredValue(filters.search)
  const [revealedQuestionId, setRevealedQuestionId] = useState<string | null>(null)

  const session = activeSession?.mode === 'exam' ? activeSession : null
  const filterOptions = useMemo(() => createFilterOptions(content.validQuestions), [content.validQuestions])
  const filteredQuestions = useMemo(
    () =>
      filterQuestions(
        content.validQuestions,
        { ...filters, search: deferredSearch, showInvalid: false },
        progress,
      ),
    [content.validQuestions, deferredSearch, filters, progress],
  )
  const currentQuestionId = session
    ? session.questionIds[session.currentIndex] ?? null
    : selectedQuestionId ?? filteredQuestions[0]?.id ?? null
  const currentQuestion = currentQuestionId ? content.questionMap[currentQuestionId] ?? null : null
  const relatedSummary = currentQuestion?.summaryId
    ? content.summaryMap[currentQuestion.summaryId]
    : content.summaries.find((summary) => summary.relatedQuestionIds.includes(currentQuestion?.id ?? ''))
  const relatedPdf = currentQuestion ? content.pdfMap[currentQuestion.source.pdfPath] ?? content.primaryPdf : content.primaryPdf
  const revealed =
    session
      ? session.revealed || Boolean(session.completedAt)
      : Boolean(currentQuestionId && revealedQuestionId === currentQuestionId)
  const isFavorite = currentQuestion ? getProgressEntry(progress, currentQuestion.id).favorite : false

  useEffect(() => {
    if (!selectedQuestionId && filteredQuestions[0]) {
      selectQuestion(filteredQuestions[0].id)
    }
  }, [filteredQuestions, selectQuestion, selectedQuestionId])
  const handleStartSession = () => {
    if (!filteredQuestions.length) {
      return
    }

    startSessionAction(
      createSession({
        mode: 'exam',
        sourceLabel: filters.chapters[0] ?? filters.sets[0] ?? 'Simulace z aktuálního výběru',
        questionIds: buildSessionQuestionIds(filteredQuestions, progress, 'random', 'exam'),
        repeatUntilMastered: false,
        repeatThreshold: 2,
        timerEnabled: settings.examTimerEnabled,
        timerSeconds: settings.examTimerSeconds,
      }),
    )
    setDetailOpen(false)
    setRevealedQuestionId(null)
  }

  const handleReveal = () => {
    if (session) {
      revealAnswer()
      return
    }

    setRevealedQuestionId(currentQuestionId)
  }

  const handleRate = (rating: MasteryLevel) => {
    rateCurrentQuestion(rating, filteredQuestions)
    if (!session) {
      setRevealedQuestionId(null)
    }
  }

  useKeyboardShortcuts(settings.keyboardShortcuts, {
    onReveal: handleReveal,
    onPrevious: session ? moveSessionPrevious : undefined,
    onNext: session ? moveSessionNext : undefined,
    onToggleDetail: () => currentQuestion && setDetailOpen(!detailOpen),
    onToggleFavorite: () => currentQuestion && toggleFavorite(currentQuestion.id),
    onClose: () => setDetailOpen(false),
    onFocusSearch: () => document.getElementById('question-search')?.focus(),
    onRate: revealed ? handleRate : undefined,
  })

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border/70 bg-surface/75 p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Simulace ústního zkoušení</p>
            <h2 className="mt-3 font-serif text-4xl text-text-primary">Tahání otázek nanečisto</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary">
              Minimalistický režim: otázka, vlastní odpověď, odhalení modelové odpovědi a následné hodnocení.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartSession}
            disabled={!filteredQuestions.length}
            className="inline-flex items-center gap-2 rounded-full border border-accent/45 bg-accent/14 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="size-4" />
            Spustit simulaci
          </button>
        </div>
      </section>

      {session?.completedAt ? (
        <SessionSummary
          session={session}
          questionPool={filteredQuestions}
          progress={progress}
          onRestart={handleStartSession}
          onClose={clearSession}
        />
      ) : (
        <div className="grid gap-6 2xl:grid-cols-[22rem_minmax(0,1fr)_24rem] xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="space-y-6">
            <QuestionFilters
              filters={filters}
              options={filterOptions}
              onChange={setFilters}
              onReset={resetFilters}
              title="Rozsah simulace"
              hint="Vyber sadu, kapitolu nebo kombinaci kapitol. Detail panel zůstává zavřený, dokud ho výslovně neotevřeš."
            />
            <section className="rounded-[2rem] border border-border/70 bg-surface/75 p-5 shadow-card">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                <Clock3 className="size-4" />
                Časovač
              </div>
              <ExamTimer
                key={`${currentQuestionId ?? 'empty'}-${session?.currentIndex ?? 0}-${settings.examTimerSeconds}`}
                enabled={Boolean(session?.timerEnabled)}
                initialSeconds={settings.examTimerSeconds}
                paused={revealed}
              />
            </section>
          </div>

          <div className="space-y-6">
            <Flashcard
              question={currentQuestion}
              revealed={revealed}
              animateFlip={settings.flipAnimation && !settings.reducedMotion}
              onReveal={handleReveal}
              minimal
            />
            <FlashcardControls
              canGoBack={Boolean(session && session.currentIndex > 0)}
              canGoForward={Boolean(session && session.currentIndex < session.questionIds.length - 1)}
              revealed={revealed}
              isFavorite={isFavorite}
              onPrevious={moveSessionPrevious}
              onNext={moveSessionNext}
              onReveal={handleReveal}
              onToggleDetail={() => setDetailOpen(true)}
              onToggleFavorite={() => currentQuestion && toggleFavorite(currentQuestion.id)}
              onRate={handleRate}
              progressText={
                session
                  ? `Otázka ${session.currentIndex + 1} z ${session.questionIds.length}`
                  : `${filteredQuestions.length} dostupných otázek`
              }
            />
            <section className="rounded-[2rem] border border-border/70 bg-surface/75 p-5 shadow-card">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                <TimerReset className="size-4" />
                Režim
              </div>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Detailní panel není otevřený automaticky. Pokud chceš po odpovědi nahlédnout do osnovy nebo chytáků, otevři ho tlačítkem `Detail otázky`.
              </p>
            </section>
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
    <div className="mt-4 rounded-[1.5rem] border border-border/60 bg-background/25 p-5 text-center">
      <div className="text-xs uppercase tracking-[0.16em] text-text-secondary">
        {enabled ? 'zbývající čas' : 'časovač vypnutý'}
      </div>
      <div className="mt-3 font-serif text-5xl text-text-primary">
        {enabled ? `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}` : '--:--'}
      </div>
      <div className="mt-3 text-sm text-text-secondary">
        {secondsLeft === 0 && enabled ? 'Čas vypršel, můžeš odkryt odpověď.' : 'Po odhalení odpovědi se odpočet zastaví.'}
      </div>
    </div>
  )
}
