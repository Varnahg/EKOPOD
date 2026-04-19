import { Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { QuestionFiltersState } from '@/types/state'

interface FilterOptions {
  sets: string[]
  chapters: string[]
  subchapters: string[]
  tags: string[]
  difficulties: number[]
}

interface QuestionFiltersProps {
  filters: QuestionFiltersState
  options: FilterOptions
  onChange: (patch: Partial<QuestionFiltersState>) => void
  onReset: () => void
  title?: string
  hint?: string
  showSets?: boolean
}

export function QuestionFilters({
  filters,
  options,
  onChange,
  onReset,
  title,
  hint,
  showSets = true,
}: QuestionFiltersProps) {
  const selectedSet = filters.sets[0] ?? ''
  const selectedChapter = filters.chapters[0] ?? ''
  const hasHeader = Boolean(title || hint)

  return (
    <section className="rounded-[1.35rem] border border-border/55 bg-surface/50 px-3.5 py-3 shadow-card">
      {hasHeader ? (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                {title}
              </p>
            ) : null}
            {hint ? <p className="mt-1 text-sm text-text-secondary">{hint}</p> : null}
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
          >
            <X className="size-4" />
            Vyčistit
          </button>
        </div>
      ) : null}

      <div
        className={cn(
          'grid gap-3',
          showSets
            ? 'md:grid-cols-[minmax(0,1fr)_11rem_14rem_auto]'
            : 'md:grid-cols-[minmax(0,1fr)_15rem_auto]',
        )}
      >
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Hledat
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border/50 bg-background/35 px-3 py-2.5">
            <Search className="size-4 text-text-secondary" />
            <input
              id="question-search"
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder="Titulek, pojem nebo kapitola…"
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/80"
            />
          </div>
        </label>

        {showSets ? (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
              Sada
            </span>
            <select
              value={selectedSet}
              onChange={(event) =>
                onChange({
                  sets: event.target.value ? [event.target.value] : [],
                })
              }
              className="mt-2 h-11 w-full rounded-2xl border border-border/50 bg-background/35 px-3 text-sm text-text-primary outline-none transition focus:border-accent/45"
            >
              <option value="">Všechny sady</option>
              {options.sets.map((set) => (
                <option key={set} value={set}>
                  {set}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Kapitola
          </span>
          <select
            value={selectedChapter}
            onChange={(event) =>
              onChange({
                chapters: event.target.value ? [event.target.value] : [],
              })
            }
            className="mt-2 h-11 w-full rounded-2xl border border-border/50 bg-background/35 px-3 text-sm text-text-primary outline-none transition focus:border-accent/45"
          >
            <option value="">Všechny kapitoly</option>
            {options.chapters.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </label>

        {!hasHeader ? (
          <div className="flex items-end">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border/50 px-4 text-sm font-medium text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
            >
              <X className="size-4" />
              Vyčistit
            </button>
          </div>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
    </section>
  )
}
