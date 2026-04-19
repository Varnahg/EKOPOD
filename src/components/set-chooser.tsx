import { ALL_STUDY_SETS, SET_META } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface SetChooserProps {
  availableSets: string[]
  selectedSet: string | null
  onSelect: (set: string | null) => void
}

export function SetChooser({
  availableSets,
  selectedSet,
  onSelect,
}: SetChooserProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'rounded-full border px-3 py-1.5 text-sm transition',
          !selectedSet
            ? 'border-accent/45 bg-accent/12 text-text-primary'
            : 'border-border/50 bg-background/20 text-text-secondary hover:border-accent/30 hover:text-text-primary',
        )}
      >
        Vše
      </button>

      {ALL_STUDY_SETS.map((set) => {
        const meta = SET_META[set]
        const disabled = !availableSets.includes(set)

        return (
          <button
            key={set}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(set)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm transition',
              selectedSet === set
                ? 'border-accent/45 bg-accent/12 text-text-primary'
                : 'border-border/50 bg-background/20 text-text-secondary hover:border-accent/30 hover:text-text-primary',
              disabled && 'cursor-not-allowed opacity-45 hover:border-border/50 hover:text-text-secondary',
            )}
            title={disabled ? undefined : meta.description}
          >
            {set}
          </button>
        )
      })}
    </div>
  )
}
