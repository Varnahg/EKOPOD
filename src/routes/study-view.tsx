import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Play, Sparkles } from 'lucide-react'

import { DetailPanel } from '@/components/detail-panel'
import { Flashcard } from '@/components/flashcard'
import { FlashcardControls } from '@/components/flashcard-controls'
import { QuestionFilters } from '@/components/question-filters'
import { QuestionList } from '@/components/question-list'
import { SessionSummary } from '@/components/session-summary'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { buildSessionQuestionIds, createSession } from '@/lib/content/session'
import { filterQuestions, getProgressEntry, getLastRating, sortQuestions } from '@/lib/content/query'
import { useContent } from '@/providers/use-content'
import { useAppStore } from '@/store/app-store'
import type { MasteryLevel, QuestionDocument } from '@/types/content'
import { sortText } from '@/lib/utils'

interface StudyViewProps {
  mode: 'flashcards' | 'mistakes'
  title: string
  description: string
}

function deriveSourceLabel(filters: ReturnType<typeof useAppStore.getState>['filters']) {
  if (filters.sets.length === 1 && !filters.chapters.length) {
    return `Sada ${filters.sets[0]}`
  }

  if (filters.chapters.length === 1) {
    return filters.chapters[0] ?? 'Vybraná kapitola'
  }

  if (filters.search.trim()) {
    return `Výběr: ${filters.search.trim()}`
  }

  return 'Smíšené sezení'
}

function createFilterOptions(questions: QuestionDocument[]) {
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

export function StudyView({ mode, title, description }: StudyViewProps) {
  const content = useContent()
  const progress = useAppStore((state) => state.progress)
  const filters = useAppStore((state) => state.filters)
  const settings = useAppStore((state) => state.settings)
  const selectedQuestionId = useAppStore((state) => state.selectedQuestionId)
  const detailOpen = useAppStore((state) => state.detailOpen)
  const detailTab = useAppStore((state) => state.detailTab)
  const activeSession = useAppStore((state) => state.activeSession)
  const setFilters = useAppStore((state) => state.setFilters)
  const resetFilters = useAppStore((state) => state.resetFilters)
  const selectQuestion = useAppStore((state) => state.selectQuestion)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const setDetailOpen = useAppStore((state) => state.setDetailOpen)
  const setDetailTab = useAppStore((state) => state.setDetailTab)
  const revealAnswer = useAppStore((state) => state.revealAnswer)
  const startSessionAction = useAppStore((state) => state.startSession)
  const clearSession = useAppStore((state) => state.clearSession)
  const moveSessionNext = useAppStore((state) => state.moveSessionNext)
  const moveSessionPrevious = useAppStore((state) => state.moveSessionPrevious)
  const rateCurrentQuestion = useAppStore((state) => state.rateCurrentQuestion)
  const [revealedQuestionId, setRevealedQuestionId] = useState<string | null>(null)
  const [repeatUntilMastered, setRepeatUntilMastered] = useState(true)
  const deferredSearch = useDeferredValue(filters.search)

  const session = activeSession?.mode === mode ? activeSession : null
  const baseQuestions = useMemo(() => {
    if (mode === 'mistakes') {
      return content.validQuestions.filter((question) => {
        const entry = getProgressEntry(progress, question.id)
        const last = getLastRating(entry)
        return entry.mastery === 0 || entry.mastery === 1 || last === 0 || last === 1
      })
    }

    return content.questions
  }, [content.questions, content.validQuestions, mode, progress])

  const filterOptions = useMemo(() => createFilterOptions(baseQuestions), [baseQuestions])
  const filteredQuestions = useMemo(() => {
    const effectiveFilters =
      mode === 'mistakes'
        ? {
            ...filters,
            search: deferredSearch,
            showInvalid: false,
          }
        : {
            ...filters,
            search: deferredSearch,
          }

    return sortQuestions(filterQuestions(baseQuestions, effectiveFilters, progress), settings.defaultSort, progress)
  }, [baseQuestions, deferredSearch, filters, mode, progress, settings.defaultSort])
  const filteredValidQuestions = useMemo(
    () => filteredQuestions.filter((question) => question.valid),
    [filteredQuestions],
  )

  const fallbackQuestion = filteredQuestions[0] ?? null
  const currentQuestionId = session
    ? session.questionIds[session.currentIndex] ?? null
    : selectedQuestionId ?? fallbackQuestion?.id ?? null
  const currentQuestion = currentQuestionId ? content.questionMap[currentQuestionId] ?? null : fallbackQuestion
  const unknownQuestionId =
    currentQuestionId && !content.questionMap[currentQuestionId] ? currentQuestionId : null
  const currentIndex = filteredQuestions.findIndex((question) => question.id === currentQuestionId)
  const isFavorite = currentQuestion ? getProgressEntry(progress, currentQuestion.id).favorite : false
  const relatedSummary = currentQuestion?.summaryId
    ? content.summaryMap[currentQuestion.summaryId]
    : content.summaries.find((summary) => summary.relatedQuestionIds.includes(currentQuestion?.id ?? ''))
  const relatedPdf = currentQuestion ? content.pdfMap[currentQuestion.source.pdfPath] ?? content.primaryPdf : content.primaryPdf

  useEffect(() => {
    if (!selectedQuestionId && fallbackQuestion) {
      selectQuestion(fallbackQuestion.id)
    }
  }, [fallbackQuestion, selectQuestion, selectedQuestionId])

  useEffect(() => {
    if (selectedQuestionId && !filteredQuestions.some((question) => question.id === selectedQuestionId)) {
      selectQuestion(fallbackQuestion?.id ?? null)
    }
  }, [fallbackQuestion, filteredQuestions, selectQuestion, selectedQuestionId])

  const revealed =
    session
      ? session.revealed || Boolean(session.completedAt)
      : Boolean(currentQuestionId && revealedQuestionId === currentQuestionId)
  const canGoBack = session ? session.currentIndex > 0 : currentIndex > 0
  const canGoForward = session
    ? session.currentIndex < session.questionIds.length - 1
    : currentIndex >= 0 && currentIndex < filteredQuestions.length - 1

  const handleStartSession = () => {
    if (!filteredValidQuestions.length) {
      return
    }

    const questionIds = buildSessionQuestionIds(filteredValidQuestions, progress, settings.defaultSort, mode)
    startSessionAction(
      createSession({
        mode,
        sourceLabel: deriveSourceLabel(filters),
        questionIds,
        repeatUntilMastered: mode === 'flashcards' ? repeatUntilMastered : false,
        repeatThreshold: 2,
        timerEnabled: false,
        timerSeconds: 0,
      }),
    )
    setRevealedQuestionId(null)
  }

  const handleSelectQuestion = (questionId: string) => {
    selectQuestion(questionId)
  }

  const handleReveal = () => {
    if (session) {
      revealAnswer()
      return
    }

    setRevealedQuestionId(currentQuestionId)
  }

  const handleNext = () => {
    if (session) {
      moveSessionNext()
      return
    }

    const nextQuestion = filteredQuestions[currentIndex + 1]
    if (nextQuestion) {
      selectQuestion(nextQuestion.id)
    }
  }

  const handlePrevious = () => {
    if (session) {
      moveSessionPrevious()
      return
    }

    const previousQuestion = filteredQuestions[currentIndex - 1]
    if (previousQuestion) {
      selectQuestion(previousQuestion.id)
    }
  }

  const handleRate = (rating: MasteryLevel) => {
    rateCurrentQuestion(rating, filteredValidQuestions)
    setRevealedQuestionId(null)
    if (!session) {
      const nextQuestion = filteredQuestions[currentIndex + 1]
      if (nextQuestion) {
        selectQuestion(nextQuestion.id)
      }
    }
  }

  useKeyboardShortcuts(settings.keyboardShortcuts, {
    onReveal: handleReveal,
    onPrevious: handlePrevious,
    onNext: handleNext,
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {mode === 'flashcards' ? 'Aktivní vybavování' : 'Nejslabší místa'}
            </p>
            <h2 className="mt-3 font-serif text-4xl text-text-primary">{title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleStartSession}
              disabled={!filteredValidQuestions.length}
              className="inline-flex items-center gap-2 rounded-full border border-accent/45 bg-accent/14 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="size-4" />
              Spustit sezení
            </button>
            {mode === 'flashcards' ? (
              <label className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-text-primary">
                <input
                  type="checkbox"
                  checked={repeatUntilMastered}
                  onChange={(event) => setRepeatUntilMastered(event.target.checked)}
                  className="size-4 rounded border-border bg-background text-accent focus:ring-accent"
                />
                Opakuj, dokud nejsou všechny aspoň na 2
              </label>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-warning/35 bg-warning/12 px-4 py-2 text-sm text-warning">
                <Sparkles className="size-4" />
                Priorita: nejnižší zvládnutí
              </div>
            )}
          </div>
        </div>
      </section>

      {session?.completedAt ? (
        <SessionSummary
          session={session}
          questionPool={filteredValidQuestions}
          progress={progress}
          onRestart={handleStartSession}
          onClose={clearSession}
        />
      ) : (
        <div className="grid gap-6 2xl:grid-cols-[24rem_minmax(0,1fr)_24rem] xl:grid-cols-[24rem_minmax(0,1fr)]">
          <div className="space-y-6">
            <QuestionFilters
              filters={filters}
              options={filterOptions}
              onChange={setFilters}
              onReset={resetFilters}
              title={mode === 'flashcards' ? 'Filtry a výběr' : 'Filtry tréninku chyb'}
              hint={mode === 'flashcards'
                ? 'Spouštěj session po sadě, kapitole nebo přes smíšený výběr.'
                : 'Vybírej jen slabé otázky podle sady, kapitoly nebo posledního výsledku.'}
            />
            <QuestionList
              questions={filteredQuestions}
              selectedQuestionId={currentQuestionId}
              progress={progress}
              density={settings.density}
              onSelect={handleSelectQuestion}
            />
          </div>

          <div className="space-y-6">
            {unknownQuestionId ? (
              <section className="rounded-[2rem] border border-warning/35 bg-warning/10 p-6 shadow-card">
                <h3 className="font-serif text-3xl text-text-primary">Neznámé ID otázky</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  Odkaz míří na otázku `{unknownQuestionId}`, která v načteném obsahu neexistuje.
                </p>
              </section>
            ) : null}
            <Flashcard
              question={currentQuestion}
              revealed={revealed}
              animateFlip={settings.flipAnimation && !settings.reducedMotion}
              onReveal={handleReveal}
            />
            <FlashcardControls
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              revealed={revealed}
              isFavorite={isFavorite}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onReveal={handleReveal}
              onToggleDetail={() => setDetailOpen(true)}
              onToggleFavorite={() => currentQuestion && toggleFavorite(currentQuestion.id)}
              onRate={handleRate}
              progressText={
                session
                  ? `Otázka ${session.currentIndex + 1} z ${session.questionIds.length} · kolo ${session.round}`
                  : filteredQuestions.length
                    ? `${Math.max(currentIndex + 1, 1)} / ${filteredQuestions.length}`
                    : 'Bez aktivního sezení'
              }
            />
          </div>

          <DetailPanel
            open={detailOpen}
            activeTab={detailTab}
            question={currentQuestion}
            relatedSummary={relatedSummary}
            relatedPdf={relatedPdf}
            onClose={() => setDetailOpen(false)}
            onTabChange={setDetailTab}
            onNavigateToQuestion={handleSelectQuestion}
          />
        </div>
      )}
    </div>
  )
}
