import { ArrowLeft, ArrowRight, PanelsRightBottom, RotateCw, Square } from 'lucide-react'

import { RATING_META } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { MasteryLevel } from '@/types/content'

export interface FlashcardQuestionIndicator {
  id: string
  label: string
  rating: MasteryLevel | null
  title?: string
  active?: boolean
  disabled?: boolean
}

interface FlashcardControlsProps {
  canGoBack: boolean
  canGoForward: boolean
  revealed?: boolean
  onPrevious: () => void
  onNext: () => void
  onReveal: () => void
  onToggleDetail: () => void
  onRate?: (rating: MasteryLevel) => void
  currentRating?: MasteryLevel | null
  progressText?: string
  caption?: string
  canReveal?: boolean
  showDetailButton?: boolean
  sessionActionLabel?: string
  onSessionAction?: () => void
  showContext?: boolean
  showNavigation?: boolean
  questionIndicators?: FlashcardQuestionIndicator[]
  onSelectQuestionIndicator?: (questionId: string) => void
}

const QUICK_RATING_LEVELS: MasteryLevel[] = [0, 1, 2, 3]

const INDICATOR_CLASS_NAMES: Record<`${MasteryLevel}` | 'unrated', string> = {
  unrated: 'border-border/50 bg-border/70 text-white',
  0: 'border-error/60 bg-error/90 text-white',
  1: 'border-warning/60 bg-warning/90 text-white',
  2: 'border-accent/60 bg-accent/90 text-white',
  3: 'border-success/60 bg-success/90 text-white',
}

const INDICATOR_ACTIVE_GLOW_CLASS_NAMES: Record<`${MasteryLevel}` | 'unrated', string> = {
  unrated: 'shadow-[0_0_1rem_rgba(89,160,255,0.2)]',
  0: 'shadow-[0_0_1rem_rgba(248,113,113,0.28)]',
  1: 'shadow-[0_0_1rem_rgba(245,158,11,0.28)]',
  2: 'shadow-[0_0_1rem_rgba(89,160,255,0.28)]',
  3: 'shadow-[0_0_1rem_rgba(74,222,128,0.28)]',
}

function getIndicatorKey(rating: MasteryLevel | null): `${MasteryLevel}` | 'unrated' {
  return rating === null ? 'unrated' : `${rating}`
}

export function FlashcardQuestionIndicatorStrip({
  questionIndicators,
  onSelectQuestionIndicator,
}: {
  questionIndicators: FlashcardQuestionIndicator[]
  onSelectQuestionIndicator?: (questionId: string) => void
}) {
  return (
    <div className="-mx-2 overflow-x-auto px-2 py-2">
      <div className="flex min-w-max items-center gap-1.5">
        {questionIndicators.map((indicator) => {
          const indicatorKey = getIndicatorKey(indicator.rating)
          const interactive = Boolean(onSelectQuestionIndicator) && !indicator.disabled

          return (
            <button
              key={indicator.id}
              type="button"
              onClick={() => {
                if (interactive) {
                  onSelectQuestionIndicator?.(indicator.id)
                }
              }}
              aria-current={indicator.active ? 'true' : undefined}
              aria-label={indicator.title ?? `Otázka ${indicator.label}`}
              title={indicator.title}
              className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-lg border text-[11px] font-semibold transition',
                INDICATOR_CLASS_NAMES[indicatorKey],
                interactive && 'hover:-translate-y-0.5 hover:brightness-110',
                !interactive && !indicator.active && 'cursor-default opacity-75',
                indicator.active &&
                  cn(
                    'scale-[1.08] ring-2 ring-white/25 brightness-110',
                    INDICATOR_ACTIVE_GLOW_CLASS_NAMES[indicatorKey],
                  ),
              )}
            >
              {indicator.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function FlashcardControls({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  onReveal,
  onToggleDetail,
  onRate,
  currentRating = null,
  progressText,
  caption = 'Otázka',
  canReveal = true,
  showDetailButton = true,
  sessionActionLabel,
  onSessionAction,
  showContext = true,
  showNavigation = true,
  questionIndicators,
  onSelectQuestionIndicator,
}: FlashcardControlsProps) {
  const hasQuestionIndicators = Boolean(questionIndicators?.length)

  return (
    <section className="rounded-[1.35rem] border border-border/60 bg-surface/60 px-4 py-3 shadow-card">
      <div className="space-y-3">
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

        {hasQuestionIndicators && questionIndicators ? (
          <FlashcardQuestionIndicatorStrip
            questionIndicators={questionIndicators}
            onSelectQuestionIndicator={onSelectQuestionIndicator}
          />
        ) : null}

        {onRate ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/45 bg-background/18 px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
                Hodnocení
              </p>
              <p className="mt-1 text-xs text-text-secondary">Rychlé hodnocení 0-3</p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {QUICK_RATING_LEVELS.map((rating) => {
                const meta = RATING_META[rating]
                const selected = currentRating === rating

                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => onRate(rating)}
                    aria-label={meta.label}
                    title={`${meta.label} - ${meta.description}`}
                    className={cn(
                      'inline-flex size-9 items-center justify-center rounded-xl border text-sm font-semibold transition hover:-translate-y-0.5',
                      meta.badgeClassName,
                      selected &&
                        cn(
                          'scale-[1.05] ring-1 ring-white/15',
                          INDICATOR_ACTIVE_GLOW_CLASS_NAMES[getIndicatorKey(rating)],
                        ),
                    )}
                  >
                    {meta.shortLabel}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
