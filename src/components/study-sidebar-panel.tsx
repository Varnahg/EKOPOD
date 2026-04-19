import { ArrowLeft, ArrowRight, ExternalLink, FileText, Play } from 'lucide-react'
import { useMemo } from 'react'

import { MarkdownRenderer } from '@/components/markdown-renderer'
import { QuestionList } from '@/components/question-list'
import { DETAIL_TAB_LABELS, RATING_META } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type {
  DetailTabKey,
  MasteryLevel,
  PdfDocument,
  QuestionDocument,
  SummaryDocument,
} from '@/types/content'
import type {
  ProgressEntry,
  QuestionSortMode,
  SessionState,
  SettingsState,
} from '@/types/state'

export type StudySidebarView = 'session' | 'rating' | 'detail' | 'questions'

interface StudySidebarPanelProps {
  panelView: StudySidebarView
  onPanelViewChange: (view: StudySidebarView) => void
  question: QuestionDocument | null
  questionList: QuestionDocument[]
  selectedQuestionId: string | null
  progress: Record<string, ProgressEntry>
  density: SettingsState['density']
  questionListInteractive: boolean
  relatedSummary?: SummaryDocument
  relatedPdf?: PdfDocument | null
  detailTab: DetailTabKey
  onDetailTabChange: (tab: DetailTabKey) => void
  onNavigateToQuestion: (questionId: string) => void
  studyMode: 'flashcards' | 'mistakes'
  session: SessionState | null
  plannedCount: number
  availableCount: number
  sessionQuestionCount: number
  onSessionQuestionCountChange: (count: number) => void
  sessionSort: QuestionSortMode
  sessionSortOptions: Array<{ value: QuestionSortMode; label: string }>
  onSessionSortChange: (value: QuestionSortMode) => void
  repeatWeakQuestions: boolean
  onRepeatWeakQuestionsChange: (value: boolean) => void
  onStartSession: () => void
  onRequestEndSession: () => void
  currentMastery: MasteryLevel | null
  currentSessionRating: MasteryLevel | null
  onRate: (rating: MasteryLevel) => void
  canGoBack: boolean
  canGoForward: boolean
  onPrevious: () => void
  onNext: () => void
}

const TAB_TO_SECTION: Record<DetailTabKey, keyof QuestionDocument['sections'] | null> = {
  modelAnswer: 'modelAnswer',
  outline: 'outline',
  detail: 'detail',
  pitfalls: 'pitfalls',
  examples: 'examples',
  scripts: 'scripts',
  summary: null,
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

export function StudySidebarPanel({
  panelView,
  onPanelViewChange,
  question,
  questionList,
  selectedQuestionId,
  progress,
  density,
  questionListInteractive,
  relatedSummary,
  relatedPdf,
  detailTab,
  onDetailTabChange,
  onNavigateToQuestion,
  studyMode,
  session,
  plannedCount,
  availableCount,
  sessionQuestionCount,
  onSessionQuestionCountChange,
  sessionSort,
  sessionSortOptions,
  onSessionSortChange,
  repeatWeakQuestions,
  onRepeatWeakQuestionsChange,
  onStartSession,
  onRequestEndSession,
  currentMastery,
  currentSessionRating,
  onRate,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
}: StudySidebarPanelProps) {
  const displayedRating = currentSessionRating ?? currentMastery
  const detailMarkdown = useMemo(() => {
    if (!question) {
      return ''
    }

    if (detailTab === 'summary') {
      return (
        question.sections.aiSummary ??
        relatedSummary?.body ??
        '*Pro tuto otázku zatím není propojený AI souhrn.*'
      )
    }

    const sectionKey = TAB_TO_SECTION[detailTab]
    return sectionKey ? question.sections[sectionKey] ?? '*Sekce zatím není vyplněná.*' : ''
  }, [detailTab, question, relatedSummary])

  return (
    <aside className="h-full min-h-0">
      <div className="flex h-full min-h-0 flex-col rounded-[1.6rem] border border-border/45 bg-surface/88 shadow-card backdrop-blur">
        <header className="border-b border-border/45 px-4 py-4">
          <div className="grid grid-cols-4 gap-2">
            <SidebarTab
              active={panelView === 'session'}
              onClick={() => onPanelViewChange('session')}
              label="Sezení"
            />
            <SidebarTab
              active={panelView === 'rating'}
              onClick={() => onPanelViewChange('rating')}
              label="Hodnocení"
            />
            <SidebarTab
              active={panelView === 'detail'}
              onClick={() => onPanelViewChange('detail')}
              label="Detail"
              disabled={!question}
            />
            <SidebarTab
              active={panelView === 'questions'}
              onClick={() => onPanelViewChange('questions')}
              label="Otázky"
            />
          </div>

          {panelView === 'session' ? (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                {session ? 'Aktivní sezení' : 'Příprava sezení'}
              </p>
              <h2 className="mt-2 font-serif text-xl text-text-primary">
                {session
                  ? `Otázka ${session.currentIndex + 1} z ${session.questionIds.length}`
                  : `${sessionQuestionCount} z ${availableCount} připravených otázek`}
              </h2>
            </>
          ) : panelView === 'rating' ? (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                Hodnocení odpovědi
              </p>
              <h2 className="mt-2 font-serif text-xl text-text-primary">
                {question ? question.title : 'Není vybraná otázka'}
              </h2>
            </>
          ) : panelView === 'detail' ? (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                Detail otázky
              </p>
              <h2 className="mt-2 font-serif text-xl text-text-primary">
                {question ? question.title : 'Není vybraná otázka'}
              </h2>
            </>
          ) : (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                Seznam otázek
              </p>
              <h2 className="mt-2 font-serif text-xl text-text-primary">
                {questionList.length} položek
              </h2>
            </>
          )}
        </header>

        <div className="min-h-0 flex-1 px-4 py-4">
          {panelView === 'session' ? (
            <div className="h-full overflow-y-auto pr-1">
              <div className="space-y-4">
                {session ? (
                  <section className="rounded-2xl border border-border/60 bg-background/28 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                          Průběh
                        </p>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                          {session.sourceLabel}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={onRequestEndSession}
                        className="rounded-full border border-warning/40 bg-warning/10 px-3 py-2 text-sm font-medium text-warning transition hover:border-warning/60"
                      >
                        Ukončit
                      </button>
                    </div>

                    {question ? (
                      <div className="mt-4 rounded-2xl border border-border/50 bg-surface/55 px-3 py-3 text-sm leading-6 text-text-primary">
                        {question.title}
                      </div>
                    ) : null}

                    <div className="mt-3 flex items-center justify-between rounded-2xl border border-border/50 bg-surface/45 px-3 py-2.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                        Hodnocení
                      </span>
                      <SessionRatingBadge
                        currentMastery={currentMastery}
                        currentSessionRating={currentSessionRating}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={onPrevious}
                        disabled={!canGoBack}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border/50 px-3 py-2 text-sm font-medium text-text-primary transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowLeft className="size-4" />
                        Předchozí
                      </button>
                      <button
                        type="button"
                        onClick={onNext}
                        disabled={!canGoForward}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border/50 px-3 py-2 text-sm font-medium text-text-primary transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Další
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </section>
                ) : (
                  <section className="rounded-2xl border border-border/60 bg-background/28 p-4">
                    <p className="text-sm leading-6 text-text-secondary">
                      Připrav si nový průchod otázkami a spusť sezení z aktuálního výběru.
                    </p>

                    <div className="mt-4 rounded-2xl border border-border/50 bg-surface/45 px-3.5 py-3 text-sm text-text-primary">
                      Počet otázek v sezení: <span className="font-semibold">{plannedCount}</span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                          Kolik otázek zařadit
                        </span>
                        <input
                          type="number"
                          min={availableCount ? 1 : 0}
                          max={availableCount}
                          value={sessionQuestionCount}
                          onChange={(event) => onSessionQuestionCountChange(Number(event.target.value))}
                          className="mt-2 h-11 w-full rounded-2xl border border-border/50 bg-background/35 px-3 text-sm text-text-primary outline-none transition focus:border-accent/45"
                        />
                        <p className="mt-2 text-xs leading-5 text-text-secondary">
                          Z dostupných {availableCount} otázek.
                        </p>
                      </label>

                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                          Řazení
                        </span>
                        <select
                          value={sessionSort}
                          onChange={(event) => onSessionSortChange(event.target.value as QuestionSortMode)}
                          className="mt-2 h-11 w-full rounded-2xl border border-border/50 bg-background/35 px-3 text-sm text-text-primary outline-none transition focus:border-accent/45"
                        >
                          {sessionSortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      {studyMode === 'flashcards' ? (
                        <label className="flex items-start gap-3 rounded-2xl border border-border/50 bg-surface/45 px-3.5 py-3 text-sm text-text-primary">
                          <input
                            type="checkbox"
                            checked={repeatWeakQuestions}
                            onChange={(event) => onRepeatWeakQuestionsChange(event.target.checked)}
                            className="mt-0.5 size-4 rounded border-border/60 bg-background/40 text-accent"
                          />
                          <span>Po dokončení vrať slabé otázky znovu do průchodu.</span>
                        </label>
                      ) : null}

                      <button
                        type="button"
                        onClick={onStartSession}
                        disabled={!plannedCount}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/45 bg-accent/12 px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Play className="size-4" />
                        {studyMode === 'mistakes' ? 'Spustit trénink' : 'Spustit sezení'}
                      </button>
                    </div>
                  </section>
                )}
              </div>
            </div>
          ) : panelView === 'rating' ? (
            <div className="h-full overflow-y-auto pr-1">
              {question ? (
                <section className="rounded-2xl border border-border/60 bg-background/28 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                        Aktuální otázka
                      </p>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        Hodnocení se týká právě zobrazené odpovědi.
                      </p>
                    </div>

                    {currentSessionRating !== null ? (
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-xs font-medium',
                          RATING_META[currentSessionRating].badgeClassName,
                        )}
                      >
                        {RATING_META[currentSessionRating].label}
                      </span>
                    ) : currentMastery !== null ? (
                      <span className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-text-secondary">
                        Posledně: {RATING_META[currentMastery].chipLabel}
                      </span>
                    ) : (
                      <span className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-text-secondary">
                        Bez hodnocení
                      </span>
                    )}
                  </div>

                  <div className="mt-4 rounded-2xl border border-border/50 bg-surface/55 px-3 py-3 text-sm leading-6 text-text-primary">
                    {question.title}
                  </div>

                  {question ? (
                    <div className="mt-4 grid gap-2">
                      {([0, 1, 2, 3] as const).map((key) => {
                        const meta = RATING_META[key]
                        const isSelected = displayedRating === key

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => onRate(key)}
                            className={cn(
                              'rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition hover:border-accent/45',
                              meta.badgeClassName,
                              isSelected && 'ring-1 ring-current',
                            )}
                            title={meta.description}
                          >
                            <div>{meta.label}</div>
                            <div className="mt-1 text-xs opacity-80">{meta.description}</div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-border/50 bg-surface/45 px-3.5 py-3 text-sm leading-6 text-text-secondary">
                      Otoč kartu na modelovou odpověď a potom ji ohodnoť.
                    </div>
                  )}
                </section>
              ) : (
                <div className="rounded-2xl border border-border/60 bg-background/28 p-4 text-sm leading-6 text-text-secondary">
                  Vyber otázku nebo spusť sezení a potom můžeš odpověď ohodnotit.
                </div>
              )}
            </div>
          ) : panelView === 'detail' ? (
            question ? (
              <div className="h-full overflow-y-auto pr-1">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(DETAIL_TAB_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onDetailTabChange(key as DetailTabKey)}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-xs transition',
                          detailTab === key
                            ? 'border-accent/45 bg-accent/14 text-text-primary'
                            : 'border-border/60 text-text-secondary hover:border-accent/35 hover:text-text-primary',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {detailTab === 'scripts' ? (
                    <div className="rounded-2xl border border-border/60 bg-background/35 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                        <FileText className="size-4" />
                        Zdroj: {question.source.pdfPath}
                        {question.source.pages?.length ? (
                          <span className="rounded-full border border-border/60 px-2 py-0.5 text-xs">
                            str. {question.source.pages.join(', ')}
                          </span>
                        ) : null}
                      </div>
                      {relatedPdf ? (
                        <a
                          href={relatedPdf.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4"
                        >
                          Otevřít PDF v nové kartě
                          <ExternalLink className="size-4" />
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  <MarkdownRenderer markdown={detailMarkdown} onNavigateToQuestion={onNavigateToQuestion} />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-background/28 p-4 text-sm leading-6 text-text-secondary">
                Vyber otázku nebo přepni zpátky na panel sezení.
              </div>
            )
          ) : (
            <QuestionList
              questions={questionList}
              selectedQuestionId={selectedQuestionId}
              progress={progress}
              density={density}
              onSelect={onNavigateToQuestion}
              interactive={questionListInteractive}
              variant="plain"
            />
          )}
        </div>
      </div>
    </aside>
  )
}

function SidebarTab({
  active,
  label,
  onClick,
  disabled = false,
}: {
  active: boolean
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'min-w-0 rounded-full border px-1.5 py-1.5 text-[13px] transition disabled:cursor-not-allowed disabled:opacity-45',
        active
          ? 'border-accent/45 bg-accent/14 text-text-primary'
          : 'border-border/60 text-text-secondary hover:border-accent/35 hover:text-text-primary',
      )}
    >
      {label}
    </button>
  )
}
