import { ArrowLeft, ArrowRight, PanelsRightBottom, RotateCw, Square } from 'lucide-react'

import type { MasteryLevel } from '@/types/content'

interface FlashcardControlsProps {
  canGoBack: boolean
  canGoForward: boolean
  revealed?: boolean
  onPrevious: () => void
  onNext: () => void
  onReveal: () => void
  onToggleDetail: () => void
  onRate?: (rating: MasteryLevel) => void
  progressText?: string
  caption?: string
  canReveal?: boolean
  showDetailButton?: boolean
  sessionActionLabel?: string
  onSessionAction?: () => void
  showContext?: boolean
  showNavigation?: boolean
}

export function FlashcardControls({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  onReveal,
  onToggleDetail,
  progressText,
  caption = 'Otázka',
  canReveal = true,
  showDetailButton = true,
  sessionActionLabel,
  onSessionAction,
  showContext = true,
  showNavigation = true,
}: FlashcardControlsProps) {
  return (
    <section className="rounded-[1.35rem] border border-border/60 bg-surface/60 px-4 py-3 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showContext ? (
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
              {caption}
            </p>
            <div className="mt-1 text-sm font-medium text-text-primary">
              {progressText ?? 'Bez aktivního sezení'}
            </div>
          </div>
        ) : (
          <div className="h-0 w-0 shrink-0" aria-hidden="true" />
        )}

        <div className="flex flex-wrap items-center gap-2">
          {sessionActionLabel && onSessionAction ? (
            <button
              type="button"
              onClick={onSessionAction}
              className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-3 py-2 text-sm font-medium text-warning transition hover:border-warning/60"
            >
              <Square className="size-4" />
              {sessionActionLabel}
            </button>
          ) : null}

          {showNavigation ? (
            <>
              <button
                type="button"
                onClick={onPrevious}
                disabled={!canGoBack}
                className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-2 text-sm font-medium text-text-primary transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="size-4" />
                Předchozí
              </button>

              <button
                type="button"
                onClick={onNext}
                disabled={!canGoForward}
                className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-2 text-sm font-medium text-text-primary transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Další
                <ArrowRight className="size-4" />
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={onReveal}
            disabled={!canReveal}
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/12 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent/65 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCw className="size-4" />
            Otočit kartu
          </button>

          {showDetailButton ? (
            <button
              type="button"
              onClick={onToggleDetail}
              className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/35 hover:text-text-primary"
            >
              <PanelsRightBottom className="size-4" />
              Detail otázky
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
