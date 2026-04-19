import { Star, TriangleAlert } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

import { RATING_META } from '@/lib/theme'
import { cn, formatDateTime } from '@/lib/utils'
import type { QuestionDocument } from '@/types/content'
import type { ProgressEntry, SettingsState } from '@/types/state'
import { getProgressEntry, getLastRating } from '@/lib/content/query'

interface QuestionListProps {
  questions: QuestionDocument[]
  selectedQuestionId: string | null
  progress: Record<string, ProgressEntry>
  density: SettingsState['density']
  onSelect: (questionId: string) => void
}

export function QuestionList({
  questions,
  selectedQuestionId,
  progress,
  density,
  onSelect,
}: QuestionListProps) {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const estimateSize = density === 'compact' ? 88 : 108

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: questions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 8,
  })

  const virtualItems = useMemo(() => virtualizer.getVirtualItems(), [virtualizer])

  return (
    <section className="rounded-3xl border border-border/70 bg-surface/75 shadow-card">
      <header className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">Přehled otázek</p>
          <h2 className="mt-1 font-serif text-2xl text-text-primary">{questions.length} položek</h2>
        </div>
      </header>

      <div ref={parentRef} className="h-[22rem] overflow-y-auto">
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualItems.map((item) => {
            const question = questions[item.index]
            const entry = getProgressEntry(progress, question.id)
            const lastRating = getLastRating(entry)

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => onSelect(question.id)}
                className={cn(
                  'absolute left-0 right-0 m-2 rounded-2xl border px-4 py-3 text-left transition',
                  selectedQuestionId === question.id
                    ? 'border-accent/45 bg-accent/14'
                    : 'border-border/60 bg-background/20 hover:border-accent/25 hover:bg-background/35',
                )}
                style={{
                  transform: `translateY(${item.start}px)`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-text-secondary">
                      <span>{question.id}</span>
                      <span>·</span>
                      <span>{question.set}</span>
                      <span>·</span>
                      <span>{question.chapter}</span>
                    </div>
                    <div className="mt-2 truncate font-semibold text-text-primary">{question.title}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-secondary">
                      <span>Obtížnost {question.difficulty}/5</span>
                      {question.subchapter ? <span>{question.subchapter}</span> : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {!question.valid ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/12 px-2 py-1 text-xs text-warning">
                        <TriangleAlert className="size-3.5" />
                        Nevalidní
                      </span>
                    ) : null}
                    {entry.favorite ? (
                      <Star className="size-4 fill-warning text-warning" />
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {entry.mastery !== null ? (
                    <span
                      className={cn(
                        'rounded-full border px-2 py-1',
                        RATING_META[entry.mastery].badgeClassName,
                      )}
                    >
                      Zvládnutí {entry.mastery}
                    </span>
                  ) : (
                    <span className="rounded-full border border-border/60 px-2 py-1 text-text-secondary">
                      Zatím bez hodnocení
                    </span>
                  )}
                  {lastRating !== null ? (
                    <span className="rounded-full border border-border/60 px-2 py-1 text-text-secondary">
                      Poslední: {RATING_META[lastRating].label}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-border/60 px-2 py-1 text-text-secondary">
                    {formatDateTime(entry.lastStudiedAt)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
