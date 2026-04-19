import { TriangleAlert } from 'lucide-react'

import { getProgressEntry } from '@/lib/content/query'
import { RATING_META } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { QuestionDocument } from '@/types/content'
import type { ProgressEntry, SettingsState } from '@/types/state'

interface QuestionListProps {
  questions: QuestionDocument[]
  selectedQuestionId: string | null
  progress: Record<string, ProgressEntry>
  density: SettingsState['density']
  onSelect: (questionId: string) => void
  interactive?: boolean
  variant?: 'card' | 'plain'
}

export function QuestionList({
  questions,
  selectedQuestionId,
  progress,
  density,
  onSelect,
  interactive = true,
  variant = 'card',
}: QuestionListProps) {
  const itemPaddingClass = density === 'compact' ? 'px-3 py-2.5' : 'px-3 py-3'
  const listViewportClass =
    variant === 'card' ? 'min-h-0 flex-1 overflow-y-auto px-1.5 pb-2' : 'min-h-0 flex-1 overflow-y-auto pr-1'
  const listInnerClass = variant === 'card' ? 'space-y-2 px-1.5 py-2' : 'space-y-2 py-1'

  const emptyState = (
    <div className="grid min-h-0 flex-1 place-items-center p-4 text-center">
      <div>
        <p className="font-medium text-text-primary">Ve výběru teď nic není.</p>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Zkus změnit hledání nebo kapitolu nahoře.
        </p>
      </div>
    </div>
  )

  const listContent = (
    <div className={listViewportClass}>
      <div className={listInnerClass}>
        {questions.map((question) => {
          const entry = getProgressEntry(progress, question.id)

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(question.id)}
              disabled={!interactive}
              className={cn(
                'w-full rounded-2xl border text-left transition disabled:cursor-default disabled:opacity-85',
                itemPaddingClass,
                selectedQuestionId === question.id
                  ? 'border-accent/45 bg-accent/14'
                  : 'border-border/45 bg-background/18 hover:border-accent/25 hover:bg-background/28',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-text-secondary">
                    <span>{question.id}</span>
                    <span>{question.set}</span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-medium text-text-primary">
                    {question.title}
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                    {question.chapter}
                  </div>
                </div>

                {!question.valid ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/12 px-2 py-1 text-[11px] text-warning">
                    <TriangleAlert className="size-3.5" />
                    Chyba
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                {entry.mastery !== null ? (
                  <span
                    className={cn(
                      'rounded-full border px-2 py-1',
                      RATING_META[entry.mastery].badgeClassName,
                    )}
                  >
                    {RATING_META[entry.mastery].chipLabel}
                  </span>
                ) : (
                  <span className="rounded-full border border-border/60 px-2 py-1 text-text-secondary">
                    Nová
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  if (variant === 'plain') {
    return <section className="flex h-full min-h-0 flex-col">{questions.length ? listContent : emptyState}</section>
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-border/55 bg-surface/55 shadow-card">
      <header className="border-b border-border/45 px-3.5 py-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
              Seznam otázek
            </p>
            <div className="mt-1 text-sm text-text-primary">{questions.length} položek</div>
          </div>
          {!interactive ? (
            <span className="rounded-full border border-border/60 px-2 py-1 text-[11px] text-text-secondary">
              běží sezení
            </span>
          ) : null}
        </div>
      </header>

      {questions.length ? listContent : emptyState}
    </section>
  )
}
