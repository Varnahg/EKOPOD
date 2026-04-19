import { RotateCcw, X } from 'lucide-react'

import { getProgressEntry } from '@/lib/content/query'
import { RATING_META } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { QuestionDocument } from '@/types/content'
import type { ProgressEntry, SessionState } from '@/types/state'

interface SessionSummaryProps {
  session: SessionState
  questionPool: QuestionDocument[]
  progress: Record<string, ProgressEntry>
  onRestart: () => void
  onClose: () => void
}

export function SessionSummary({
  session,
  questionPool,
  progress,
  onRestart,
  onClose,
}: SessionSummaryProps) {
  const questionIds = session.allQuestionIds.length ? session.allQuestionIds : [...new Set(session.questionIds)]
  const latestRatings = questionIds
    .map((questionId) => session.ratings[questionId]?.at(-1) ?? null)
    .filter((rating): rating is NonNullable<typeof rating> => rating !== null)
  const ratedQuestionCount = latestRatings.length
  const unansweredCount = Math.max(questionIds.length - ratedQuestionCount, 0)
  const answerCount = Object.values(session.ratings).reduce((sum, ratings) => sum + ratings.length, 0)
  const ratingBreakdown = ([0, 1, 2, 3] as const).map((key) => {
    const count = latestRatings.filter((rating) => rating === Number(key)).length

    return {
      rating: key,
      count,
      share: ratedQuestionCount ? Math.round((count / ratedQuestionCount) * 100) : 0,
      meta: RATING_META[key],
    }
  })
  const weakest = questionIds
    .map((questionId) => ({
      question: questionPool.find((item) => item.id === questionId),
      mastery: getProgressEntry(progress, questionId).mastery,
    }))
    .filter((entry) => entry.question)
    .sort((left, right) => (left.mastery ?? -1) - (right.mastery ?? -1))
    .slice(0, 5)

  return (
    <section className="rounded-[2rem] border border-success/35 bg-success/10 p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-success">Sezení dokončeno</p>
          <h2 className="mt-3 font-serif text-4xl text-text-primary">Shrnutí průchodu</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
            Zdroj: {session.sourceLabel}. V sezení bylo {session.requestedCount} otázek a dokončeno
            bylo {session.round} kol(a).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full border border-success/35 bg-success/12 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-success/60"
          >
            <RotateCcw className="size-4" />
            Spustit znovu
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent/40"
          >
            <X className="size-4" />
            Zavřít
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <SummaryCard label="Otázek v sezení" value={session.requestedCount} />
        <SummaryCard label="Otázek ohodnoceno" value={ratedQuestionCount} />
        <SummaryCard label="Bez hodnocení" value={unansweredCount} />
        <SummaryCard label="Hodnocení celkem" value={answerCount} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-2xl border border-border/60 bg-background/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Poslední stav odpovědí
          </p>
          <div className="mt-4 space-y-3">
            {ratingBreakdown.map(({ rating, count, share, meta }) => (
              <div key={rating} className="rounded-2xl border border-border/60 bg-surface/55 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-text-primary">{meta.label}</div>
                  <div className={cn('rounded-full border px-2.5 py-1 text-xs', meta.badgeClassName)}>
                    {count}
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/50">
                  <div
                    className={cn('h-full rounded-full', getFillClassName(rating))}
                    style={{ width: `${share}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-text-secondary">
                  {ratedQuestionCount ? `${share} % z ohodnocených otázek` : 'Zatím bez hodnocení'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Nejslabší otázky
          </p>
          <div className="mt-4 space-y-3">
            {weakest.length ? (
              weakest.map((entry) => (
                <div key={entry.question?.id} className="rounded-2xl border border-border/60 bg-surface/70 p-3">
                  <div className="text-sm font-semibold text-text-primary">{entry.question?.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.14em] text-text-secondary">
                    {entry.question?.chapter}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-border/60 bg-surface/70 p-3 text-sm leading-6 text-text-secondary">
                V tomto průchodu zatím nebyla uložena žádná odpověď.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-border/60 bg-background/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">{label}</p>
      <div className="mt-3 font-serif text-4xl text-text-primary">{value}</div>
    </article>
  )
}

function getFillClassName(rating: keyof typeof RATING_META) {
  switch (rating) {
    case 0:
      return 'bg-error'
    case 1:
      return 'bg-warning'
    case 2:
      return 'bg-accent'
    case 3:
      return 'bg-success'
    default:
      return 'bg-border'
  }
}
