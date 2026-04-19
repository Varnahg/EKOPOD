import { ArrowLeft, ArrowRight, Eye, PanelsRightBottom, Star } from 'lucide-react'

import { RATING_META } from '@/lib/theme'
import type { MasteryLevel } from '@/types/content'
import { cn } from '@/lib/utils'

interface FlashcardControlsProps {
  canGoBack: boolean
  canGoForward: boolean
  revealed: boolean
  isFavorite: boolean
  onPrevious: () => void
  onNext: () => void
  onReveal: () => void
  onToggleDetail: () => void
  onToggleFavorite: () => void
  onRate: (rating: MasteryLevel) => void
  progressText?: string
}

export function FlashcardControls({
  canGoBack,
  canGoForward,
  revealed,
  isFavorite,
  onPrevious,
  onNext,
  onReveal,
  onToggleDetail,
  onToggleFavorite,
  onRate,
  progressText,
}: FlashcardControlsProps) {
  return (
    <section className="rounded-3xl border border-border/70 bg-surface/75 p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoBack}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
            Předchozí
          </button>
          <button
            type="button"
            onClick={revealed ? onToggleDetail : onReveal}
            className="inline-flex items-center gap-2 rounded-full border border-accent/45 bg-accent/14 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent/70"
          >
            {revealed ? <PanelsRightBottom className="size-4" /> : <Eye className="size-4" />}
            {revealed ? 'Detail otázky' : 'Odkrytí odpovědi'}
          </button>
          <button
            type="button"
            onClick={onToggleFavorite}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
              isFavorite
                ? 'border-warning/45 bg-warning/14 text-warning'
                : 'border-border/60 text-text-primary hover:border-warning/40 hover:text-warning',
            )}
          >
            <Star className={cn('size-4', isFavorite && 'fill-current')} />
            Oblíbené
          </button>
        </div>

        <div className="text-sm text-text-secondary">{progressText}</div>
      </div>

      {revealed ? (
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {Object.entries(RATING_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              onClick={() => onRate(Number(key) as MasteryLevel)}
              className={cn(
                'rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5',
                meta.badgeClassName,
              )}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em]">{meta.shortLabel}</div>
              <div className="mt-2 font-semibold">{meta.label}</div>
              <div className="mt-1 text-sm opacity-80">{meta.description}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-sm text-text-secondary">
          <span>Nejdřív si odpověz vlastními slovy a teprve potom kartu otoč.</span>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoForward}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 font-medium text-text-primary transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Další
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </section>
  )
}
