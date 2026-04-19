import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Play, Search, X } from 'lucide-react'

import { DetailPanel } from '@/components/detail-panel'
import { Flashcard } from '@/components/flashcard'
import { FlashcardControls } from '@/components/flashcard-controls'
import { QuestionList } from '@/components/question-list'
import { SetChooser } from '@/components/set-chooser'
import { SessionSummary } from '@/components/session-summary'
import { StudySidebarPanel, type StudySidebarView } from '@/components/study-sidebar-panel'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useMediaQuery } from '@/hooks/use-media-query'
import { filterQuestions, getLastRating, getProgressEntry, sortQuestions } from '@/lib/content/query'
import { buildRepeatQueue, buildSessionQuestionIds, createSession } from '@/lib/content/session'
import { DEFAULT_FILTERS } from '@/lib/progress'
import { getSetDisplayLabel, RATING_META } from '@/lib/theme'
import { cn, sortText } from '@/lib/utils'
import { useContent } from '@/providers/use-content'
import { useAppStore } from '@/store/app-store'
import type { MasteryLevel, QuestionDocument } from '@/types/content'
import type { QuestionSortMode } from '@/types/state'

interface StudyViewProps {
  mode: 'flashcards' | 'mistakes'
  title: string
  description: string
}

const SESSION_SORT_OPTIONS: Array<{ value: QuestionSortMode; label: string }> = [
  { value: 'content', label: 'Podle skript' },
  { value: 'weakest', label: 'Nejslabší dřív' },
  { value: 'recent', label: 'Naposledy studované' },
  { value: 'random', label: 'Náhodně' },
]

const RATING_FILTER_LEVELS: MasteryLevel[] = [0, 1, 2, 3]

function deriveSourceLabel(filters: ReturnType<typeof useAppStore.getState>['filters']) {
  if (filters.sets.length === 1 && !filters.chapters.length) {
    return getSetDisplayLabel(filters.sets[0] ?? '')
  }

  if (filters.chapters.length === 1) {
    return filters.chapters[0] ?? 'Vybraná kapitola'
  }

  if (filters.search.trim()) {
    return `Výběr: ${filters.search.trim()}`
  }

  return 'Smíšený průchod'
}

function createFilterOptions(questions: QuestionDocument[]) {
  return {
    sets: sortText([...new Set(questions.map((question) => question.set))]),
    chapters: sortText([...new Set(questions.map((question) => question.chapter))]),
  }
}

function buildRatingFilterLabel(selectedLevels: MasteryLevel[]) {
  if (!selectedLevels.length) {
    return 'Hodnocení'
  }

  if (selectedLevels.length === 1) {
    return `Hodnocení: ${RATING_META[selectedLevels[0]].chipLabel}`
  }

  return `Hodnocení: ${selectedLevels.length}`
}

function RatingFilterDropdown({
  selectedLevels,
  onChange,
}: {
  selectedLevels: MasteryLevel[]
  onChange: (levels: MasteryLevel[]) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedSet = useMemo(() => new Set(selectedLevels), [selectedLevels])

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const toggleLevel = (level: MasteryLevel) => {
    const nextLevels = selectedSet.has(level)
      ? selectedLevels.filter((selectedLevel) => selectedLevel !== level)
      : [...selectedLevels, level].sort((left, right) => left - right)

    onChange(nextLevels)
  }

  return (
    <div ref={containerRef} className="relative min-w-[12.5rem]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-2xl border border-border/50 bg-background/35 px-3 text-sm text-text-primary outline-none transition hover:border-accent/35"
      >
        <span className="truncate">{buildRatingFilterLabel(selectedLevels)}</span>

        <span className="flex items-center gap-2 text-text-secondary">
          {selectedLevels.length ? (
            <span className="rounded-full border border-border/60 px-2 py-0.5 text-[11px] font-medium text-text-primary">
              {selectedLevels.length}
            </span>
          ) : null}
          <ChevronDown className={cn('size-4 transition', open && 'rotate-180')} />
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-30 mt-2 w-[18rem] max-w-[calc(100vw-2rem)] rounded-[1.25rem] border border-border/60 bg-surface/95 p-2 shadow-card backdrop-blur">
          <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Vyber hodnocení
          </p>

          <div className="space-y-1">
            {RATING_FILTER_LEVELS.map((level) => {
              const meta = RATING_META[level]
              const selected = selectedSet.has(level)

              return (
                <button
                  key={level}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleLevel(level)}
                  className={cn(
                    'flex w-full items-start justify-between gap-3 rounded-[1rem] border px-3 py-2.5 text-left text-sm transition',
                    selected
                      ? meta.badgeClassName
                      : 'border-border/50 bg-background/25 text-text-primary hover:border-accent/35',
                  )}
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{meta.label}</span>
                    <span className="mt-1 block text-xs opacity-80">{meta.description}</span>
                  </span>

                  <span
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                      selected
                        ? 'border-current bg-current/10 text-current'
                        : 'border-border/50 text-transparent',
                    )}
                  >
                    <Check className="size-3.5" />
                  </span>
                </button>
              )
            })}
          </div>

          {selectedLevels.length ? (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-border/50 px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/35 hover:text-text-primary"
            >
              Vyčistit hodnocení
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function SessionRatingBadge({
  currentMastery,
  currentSessionRating,
}: {
  currentMastery: MasteryLevel | null
  currentSessionRating: MasteryLevel | null
}) {
  if (currentSessionRating !== null) {
    return (
      <span
        className={cn(
          'rounded-full border px-2.5 py-1 text-xs font-medium',
          RATING_META[currentSessionRating].badgeClassName,
        )}
      >
        {RATING_META[currentSessionRating].chipLabel}
      </span>
    )
  }

  if (currentMastery !== null) {
    return (
      <span className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-text-secondary">
        Posledně: {RATING_META[currentMastery].chipLabel}
      </span>
    )
  }

  return (
    <span className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-text-secondary">
      Bez hodnocení
    </span>
  )
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
  const selectQuestion = useAppStore((state) => state.selectQuestion)
  const setDetailOpen = useAppStore((state) => state.setDetailOpen)
  const setDetailTab = useAppStore((state) => state.setDetailTab)
  const revealAnswer = useAppStore((state) => state.revealAnswer)
  const hideAnswer = useAppStore((state) => state.hideAnswer)
  const startSessionAction = useAppStore((state) => state.startSession)
  const clearSession = useAppStore((state) => state.clearSession)
  const completeSessionAction = useAppStore((state) => state.completeSession)
  const advanceSessionAction = useAppStore((state) => state.advanceSession)
  const moveSessionNext = useAppStore((state) => state.moveSessionNext)
  const moveSessionPrevious = useAppStore((state) => state.moveSessionPrevious)
  const rateCurrentQuestion = useAppStore((state) => state.rateCurrentQuestion)
  const [revealedQuestionId, setRevealedQuestionId] = useState<string | null>(null)
  const [sessionSort, setSessionSort] = useState<QuestionSortMode>(
    mode === 'mistakes' ? 'weakest' : settings.defaultSort,
  )
  const [repeatWeakQuestions, setRepeatWeakQuestions] = useState(false)
  const [sessionQuestionCount, setSessionQuestionCount] = useState<number | null>(null)
  const [desktopSidebarView, setDesktopSidebarView] = useState<StudySidebarView>('session')
  const deferredSearch = useDeferredValue(filters.search)
  const isDesktopLayout = useMediaQuery('(min-width: 1280px)')

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
  const selectedSet = filters.sets.length === 1 ? filters.sets[0] : null
  const selectedChapter = filters.chapters[0] ?? ''

  const simplifiedFilters = useMemo(
    () => ({
      ...DEFAULT_FILTERS,
      search: deferredSearch,
      sets: filters.sets,
      chapters: filters.chapters,
      masteryLevels: filters.masteryLevels,
      showInvalid: mode === 'flashcards',
    }),
    [deferredSearch, filters.chapters, filters.masteryLevels, filters.sets, mode],
  )

  const filteredQuestions = useMemo(
    () =>
      sortQuestions(
        filterQuestions(baseQuestions, simplifiedFilters, progress),
        settings.defaultSort,
        progress,
      ),
    [baseQuestions, progress, settings.defaultSort, simplifiedFilters],
  )
  const filteredValidQuestions = useMemo(
    () => filteredQuestions.filter((question) => question.valid),
    [filteredQuestions],
  )
  const plannedSessionQuestionIds = useMemo(
    () => buildSessionQuestionIds(filteredValidQuestions, progress, sessionSort, mode),
    [filteredValidQuestions, mode, progress, sessionSort],
  )
  const availableSessionQuestionCount = plannedSessionQuestionIds.length
  const effectiveSessionQuestionCount =
    availableSessionQuestionCount === 0
      ? 0
      : Math.min(
          Math.max(sessionQuestionCount ?? availableSessionQuestionCount, 1),
          availableSessionQuestionCount,
        )
  const limitedSessionQuestionIds = useMemo(
    () => plannedSessionQuestionIds.slice(0, effectiveSessionQuestionCount),
    [effectiveSessionQuestionCount, plannedSessionQuestionIds],
  )

  const fallbackQuestion = filteredQuestions[0] ?? null
  const currentQuestionId = session
    ? session.questionIds[session.currentIndex] ?? null
    : selectedQuestionId ?? fallbackQuestion?.id ?? null
  const currentQuestion = currentQuestionId ? content.questionMap[currentQuestionId] ?? null : fallbackQuestion
  const unknownQuestionId =
    currentQuestionId && !content.questionMap[currentQuestionId] ? currentQuestionId : null
  const currentIndex = filteredQuestions.findIndex((question) => question.id === currentQuestionId)
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

  const mobileDetailVisible = detailOpen && Boolean(currentQuestion)

  useEffect(() => {
    setDetailOpen(false)
  }, [mode, setDetailOpen])

  useEffect(() => {
    if (!selectedQuestionId && fallbackQuestion) {
      selectQuestion(fallbackQuestion.id)
    }
  }, [fallbackQuestion, selectQuestion, selectedQuestionId])

  useEffect(() => {
    if (!selectedQuestionId || filteredQuestions.some((question) => question.id === selectedQuestionId)) {
      return
    }

    selectQuestion(fallbackQuestion?.id ?? null)
    if (!isDesktopLayout) {
      setDetailOpen(false)
    }
  }, [fallbackQuestion, filteredQuestions, isDesktopLayout, selectedQuestionId, selectQuestion, setDetailOpen])

  const revealed = session
    ? session.revealed || Boolean(session.completedAt)
    : Boolean(currentQuestionId && revealedQuestionId === currentQuestionId)
  const canGoBack = session ? session.currentIndex > 0 : currentIndex > 0
  const canGoForward = session
    ? session.currentIndex < session.questionIds.length - 1
    : currentIndex >= 0 && currentIndex < filteredQuestions.length - 1

  const closeOverlayDetail = () => {
    if (!isDesktopLayout) {
      setDetailOpen(false)
    }
  }

  const handleStartSession = () => {
    if (!limitedSessionQuestionIds.length) {
      return
    }

    startSessionAction(
      createSession({
        mode,
        sourceLabel: deriveSourceLabel(filters),
        questionIds: limitedSessionQuestionIds,
        repeatUntilMastered: mode === 'flashcards' ? repeatWeakQuestions : false,
        repeatThreshold: 2,
        timerEnabled: false,
        timerSeconds: 0,
      }),
    )
    setRevealedQuestionId(null)
    if (isDesktopLayout) {
      setDesktopSidebarView('session')
    } else {
      setDetailOpen(false)
    }
  }

  const handleEndSession = () => {
    if (!session) {
      clearSession()
      return
    }

    const shouldFinish = window.confirm('Ukončit sezení a zobrazit shrnutí dosavadního průchodu?')

    if (!shouldFinish) {
      return
    }

    completeSessionAction()

    if (isDesktopLayout) {
      setDesktopSidebarView('session')
    }
  }

  const handleSelectQuestion = (questionId: string) => {
    if (session) {
      return
    }

    selectQuestion(questionId)
    setRevealedQuestionId(null)
    closeOverlayDetail()
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

  const handleNext = () => {
    if (session) {
      const atLastQuestion = session.currentIndex >= session.questionIds.length - 1

      if (atLastQuestion) {
        const repeatQueue = session.repeatUntilMastered
          ? buildRepeatQueue(
              session,
              progress,
              content.validQuestions.filter((question) => session.allQuestionIds.includes(question.id)),
            )
          : []
        const shouldFinish = window.confirm(
          repeatQueue.length
            ? `Jsi na konci kola. Chceš pokračovat dalším kolem se ${repeatQueue.length} slabými otázkami?`
            : 'Jsi na poslední otázce. Chceš ukončit sezení a zobrazit shrnutí průchodu?',
        )

        if (shouldFinish) {
          advanceSessionAction(content.validQuestions)
        }

        return
      }

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

    if (session) {
      return
    }

    const nextQuestion = filteredQuestions[currentIndex + 1]
    if (nextQuestion) {
      selectQuestion(nextQuestion.id)
    }
  }

  const handleOpenDetail = () => {
    if (isDesktopLayout) {
      setDesktopSidebarView('detail')
      return
    }

    if (currentQuestion) {
      setDetailOpen(true)
    }
  }

  const handleResetQuickFilters = () => {
    setFilters({
      search: '',
      chapters: [],
      masteryLevels: [],
    })
  }

  useKeyboardShortcuts(settings.keyboardShortcuts, {
    onReveal: handleReveal,
    onPrevious: handlePrevious,
    onNext: handleNext,
    onToggleDetail: () => {
      if (isDesktopLayout) {
        setDesktopSidebarView((current) => (current === 'detail' ? 'session' : 'detail'))
      } else if (currentQuestion) {
        setDetailOpen(!detailOpen)
      }
    },
    onClose: () => {
      if (!isDesktopLayout) {
        setDetailOpen(false)
      }
    },
    onFocusSearch: () => document.getElementById('question-search')?.focus(),
    onRate: revealed ? handleRate : undefined,
  })

  const renderMobileSessionCard = () => (
    <section className="rounded-[1.35rem] border border-border/60 bg-surface/60 p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
        Aktivní sezení
      </p>

      {session ? (
        <>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl text-text-primary">
                Otázka {session.currentIndex + 1} z {session.questionIds.length}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{session.sourceLabel}</p>
            </div>
            <button
              type="button"
              onClick={handleEndSession}
              className="rounded-full border border-warning/40 bg-warning/10 px-3 py-2 text-sm font-medium text-warning transition hover:border-warning/60"
            >
              Ukončit
            </button>
          </div>
          {currentQuestion ? (
            <p className="mt-4 rounded-2xl border border-border/50 bg-background/25 px-3 py-3 text-sm leading-6 text-text-primary">
              {currentQuestion.title}
            </p>
          ) : null}

          <div className="mt-3 flex items-center justify-between rounded-2xl border border-border/50 bg-background/25 px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
              Hodnocení
            </span>
            <SessionRatingBadge
              currentMastery={currentProgressEntry?.mastery ?? null}
              currentSessionRating={currentSessionRating}
            />
          </div>
        </>
      ) : (
        <>
          <h3 className="mt-2 font-serif text-xl text-text-primary">Sezení ještě neběží</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {effectiveSessionQuestionCount} připravených otázek pro nový průchod.
          </p>

          <div className="mt-4 rounded-2xl border border-border/50 bg-background/25 px-3.5 py-3 text-sm text-text-primary">
            Počet otázek v sezení: <span className="font-semibold">{effectiveSessionQuestionCount}</span>
          </div>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Kolik otázek zařadit
              </span>
              <input
                type="number"
                min={availableSessionQuestionCount ? 1 : 0}
                max={availableSessionQuestionCount}
                value={effectiveSessionQuestionCount}
                onChange={(event) => setSessionQuestionCount(Number(event.target.value))}
                className="mt-2 h-11 w-full rounded-2xl border border-border/50 bg-background/35 px-3 text-sm text-text-primary outline-none transition focus:border-accent/45"
              />
              <p className="mt-2 text-xs leading-5 text-text-secondary">
                Z dostupných {availableSessionQuestionCount} otázek.
              </p>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Řazení
              </span>
              <select
                value={sessionSort}
                onChange={(event) => setSessionSort(event.target.value as QuestionSortMode)}
                className="mt-2 h-11 w-full rounded-2xl border border-border/50 bg-background/35 px-3 text-sm text-text-primary outline-none transition focus:border-accent/45"
              >
                {SESSION_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {mode === 'flashcards' ? (
              <label className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/25 px-3.5 py-3 text-sm text-text-primary">
                <input
                  type="checkbox"
                  checked={repeatWeakQuestions}
                  onChange={(event) => setRepeatWeakQuestions(event.target.checked)}
                  className="mt-0.5 size-4 rounded border-border/60 bg-background/40 text-accent"
                />
                <span>Po dokončení vrať slabé otázky znovu do průchodu.</span>
              </label>
            ) : null}

            <button
              type="button"
              onClick={handleStartSession}
              disabled={!limitedSessionQuestionIds.length}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/45 bg-accent/12 px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="size-4" />
              {mode === 'mistakes' ? 'Spustit trénink' : 'Spustit sezení'}
            </button>
          </div>
        </>
      )}
    </section>
  )

  return (
    <div
      className={cn(
        'space-y-3',
        !session?.completedAt && 'xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:space-y-3',
      )}
    >
      <section className="rounded-[1.35rem] border border-border/60 bg-surface/60 p-3.5 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-[1.55rem] text-text-primary">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{description}</p>
          </div>

          <div className="text-sm text-text-secondary">
            <div>{filteredValidQuestions.length} připravených otázek</div>
            <div>{deriveSourceLabel(filters)}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <SetChooser
            availableSets={filterOptions.sets}
            selectedSet={selectedSet}
            onSelect={(set) => setFilters({ sets: set ? [set] : [] })}
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

            <RatingFilterDropdown
              selectedLevels={filters.masteryLevels}
              onChange={(masteryLevels) => setFilters({ masteryLevels })}
            />

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
            'grid gap-3 xl:min-h-0 xl:flex-1 xl:overflow-hidden',
            isDesktopLayout && 'xl:grid-cols-[minmax(0,1fr)_22.5rem]',
          )}
        >
          {!isDesktopLayout ? (
            <aside className="flex min-h-0 flex-col gap-3">
              {renderMobileSessionCard()}

              <div className="min-h-0 flex-1">
                <QuestionList
                  questions={filteredQuestions}
                  selectedQuestionId={currentQuestionId}
                  progress={progress}
                  density={settings.density}
                  onSelect={handleSelectQuestion}
                  interactive={!session}
                />
              </div>
            </aside>
          ) : null}

          <section className="min-w-0 xl:min-h-0">
            <div
              className={cn(
                'flex h-full min-h-0 w-full flex-col items-center gap-3',
                isDesktopLayout && 'justify-center',
              )}
            >
              {!isDesktopLayout ? (
                <div className="w-full max-w-[46rem]">
                  <FlashcardControls
                    canGoBack={canGoBack}
                    canGoForward={session ? session.questionIds.length > 0 : canGoForward}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onReveal={handleReveal}
                    onToggleDetail={handleOpenDetail}
                    canReveal={Boolean(currentQuestion && !unknownQuestionId)}
                    caption={session ? 'Aktivní sezení' : 'Výběr'}
                    progressText={
                      session
                        ? `Otázka ${session.currentIndex + 1} z ${session.questionIds.length}`
                        : filteredQuestions.length
                          ? `Otázka ${Math.max(currentIndex + 1, 1)} z ${filteredQuestions.length}`
                          : 'Bez aktivního výběru'
                    }
                    showDetailButton={Boolean(currentQuestion && !unknownQuestionId)}
                    sessionActionLabel={session ? 'Ukončit sezení' : undefined}
                    onSessionAction={session ? handleEndSession : undefined}
                    showContext
                    showNavigation
                  />
                </div>
              ) : null}

              <div
                className={cn(
                  'min-h-0 w-full flex-1',
                  isDesktopLayout ? 'mx-auto flex max-w-[58rem] items-center justify-center' : 'max-w-[46rem]',
                )}
              >
                {unknownQuestionId ? (
                  <section className="grid h-full min-h-[30rem] place-items-center rounded-[2rem] border border-warning/35 bg-warning/10 p-6 text-center shadow-card">
                    <div>
                      <h3 className="font-serif text-2xl text-text-primary">Neznámé ID otázky</h3>
                      <p className="mt-3 text-sm leading-7 text-text-secondary">
                        Odkaz míří na otázku `{unknownQuestionId}`, která v načteném obsahu neexistuje.
                      </p>
                    </div>
                  </section>
                ) : (
                  <div
                    className={cn(
                      'flex h-full min-h-0 w-full',
                      isDesktopLayout ? 'items-center justify-center' : 'items-start justify-start',
                    )}
                  >
                    <Flashcard
                      question={currentQuestion}
                      revealed={revealed}
                      animateFlip={settings.flipAnimation && !settings.reducedMotion}
                      onReveal={handleReveal}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {isDesktopLayout ? (
            <StudySidebarPanel
              panelView={desktopSidebarView}
              onPanelViewChange={setDesktopSidebarView}
              question={currentQuestion}
              questionList={filteredQuestions}
              selectedQuestionId={currentQuestionId}
              progress={progress}
              density={settings.density}
              questionListInteractive={!session}
              relatedSummary={relatedSummary}
              relatedPdf={relatedPdf}
              detailTab={detailTab}
              onDetailTabChange={setDetailTab}
              onNavigateToQuestion={handleSelectQuestion}
              studyMode={mode}
              session={session}
              plannedCount={effectiveSessionQuestionCount}
              availableCount={availableSessionQuestionCount}
              sessionQuestionCount={effectiveSessionQuestionCount}
              onSessionQuestionCountChange={setSessionQuestionCount}
              sessionSort={sessionSort}
              sessionSortOptions={SESSION_SORT_OPTIONS}
              onSessionSortChange={setSessionSort}
              repeatWeakQuestions={repeatWeakQuestions}
              onRepeatWeakQuestionsChange={setRepeatWeakQuestions}
              onStartSession={handleStartSession}
              onRequestEndSession={handleEndSession}
              currentMastery={currentProgressEntry?.mastery ?? null}
              currentSessionRating={currentSessionRating}
              revealed={revealed}
              onRate={handleRate}
              canGoBack={canGoBack}
              canGoForward={session ? session.questionIds.length > 0 : canGoForward}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          ) : (
            <DetailPanel
              open={mobileDetailVisible}
              activeTab={detailTab}
              question={currentQuestion}
              relatedSummary={relatedSummary}
              relatedPdf={relatedPdf}
              onClose={() => setDetailOpen(false)}
              onTabChange={setDetailTab}
              onNavigateToQuestion={handleSelectQuestion}
            />
          )}
        </div>
      )}
    </div>
  )
}
