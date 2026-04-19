import { RotateCcw, X } from 'lucide-react'

import { RATING_META } from '@/lib/theme'
import type { QuestionDocument } from '@/types/content'
import type { ProgressEntry, SessionState } from '@/types/state'
import { getProgressEntry } from '@/lib/content/query'

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
  const uniqueQuestions = [...new Set(session.questionIds)]
  const ratingEntries = Object.entries(session.ratings)
  const ratingValues = ratingEntries.flatMap(([, ratings]) => ratings)
  const average = ratingValues.length
    ? (ratingValues.reduce<number>((sum, rating) => sum + rating, 0) / ratingValues.length).toFixed(1)
    : '0.0'
  const weakest = uniqueQuestions
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
            Zdroj: {session.sourceLabel}. Otázek v unikátním průchodu: {uniqueQuestions.length}. Počet kol: {session.round}.
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

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-border/60 bg-background/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">Průměrné hodnocení</p>
          <div className="mt-3 font-serif text-4xl text-text-primary">{average}</div>
        </article>
        <article className="rounded-2xl border border-border/60 bg-background/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">Hodnocení celkem</p>
          <div className="mt-3 font-serif text-4xl text-text-primary">{ratingValues.length}</div>
        </article>
        <article className="rounded-2xl border border-border/60 bg-background/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">Režim</p>
          <div className="mt-3 font-serif text-4xl capitalize text-text-primary">{session.mode}</div>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-2xl border border-border/60 bg-background/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">Rozložení hodnocení</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {Object.entries(RATING_META).map(([key, meta]) => {
              const count = ratingValues.filter((rating) => rating === Number(key)).length

              return (
                <div key={key} className={`rounded-2xl border px-4 py-3 ${meta.badgeClassName}`}>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em]">{meta.shortLabel}</div>
                  <div className="mt-2 font-semibold">{count}</div>
                  <div className="mt-1 text-sm opacity-80">{meta.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">Nejslabší otázky</p>
          <div className="mt-4 space-y-3">
            {weakest.map((entry) => (
              <div key={entry.question?.id} className="rounded-2xl border border-border/60 bg-surface/70 p-3">
                <div className="text-sm font-semibold text-text-primary">{entry.question?.title}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.14em] text-text-secondary">
                  {entry.question?.chapter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
