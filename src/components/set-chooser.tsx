import { ALL_STUDY_SETS, SET_META } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface SetChooserProps {
  availableSets: string[]
  selectedSets: string[]
  onChange: (sets: string[]) => void
}

export function SetChooser({
  availableSets,
  selectedSets,
  onChange,
}: SetChooserProps) {
  const selectedSetLookup = new Set(selectedSets)

  const toggleSet = (set: string) => {
    if (selectedSetLookup.has(set)) {
      onChange(selectedSets.filter((selectedSet) => selectedSet !== set))
      return
    }

    const nextSets = [...selectedSets, set].sort(
      (left, right) => ALL_STUDY_SETS.indexOf(left as (typeof ALL_STUDY_SETS)[number]) -
        ALL_STUDY_SETS.indexOf(right as (typeof ALL_STUDY_SETS)[number]),
    )

    onChange(nextSets)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange([])}
        className={cn(
          'rounded-full border px-3 py-1.5 text-sm transition',
          !selectedSets.length
            ? 'border-accent/45 bg-accent/12 text-text-primary'
            : 'border-border/50 bg-background/20 text-text-secondary hover:border-accent/30 hover:text-text-primary',
        )}
      >
        Vše
      </button>

      {ALL_STUDY_SETS.map((set) => {
        const meta = SET_META[set]
        const disabled = !availableSets.includes(set)
        const selected = selectedSetLookup.has(set)

        return (
          <button
            key={set}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => toggleSet(set)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm transition',
              selected
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
