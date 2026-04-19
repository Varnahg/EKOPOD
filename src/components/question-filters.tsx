import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import type { ReactNode } from 'react'

import type { MasteryLevel } from '@/types/content'
import type { QuestionFiltersState } from '@/types/state'
import { RATING_META } from '@/lib/theme'
import { cn } from '@/lib/utils'

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
}

function toggleValue<T>(current: T[], value: T) {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition',
        active
          ? 'border-accent/45 bg-accent/14 text-text-primary'
          : 'border-border/60 bg-background/25 text-text-secondary hover:border-accent/30 hover:text-text-primary',
      )}
    >
      {children}
    </button>
  )
}

export function QuestionFilters({
  filters,
  options,
  onChange,
  onReset,
  title = 'Filtry',
  hint,
}: QuestionFiltersProps) {
  return (
    <section className="rounded-3xl border border-border/70 bg-surface/75 p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
            <Filter className="size-4" />
            {title}
          </div>
          {hint ? <p className="mt-2 text-sm text-text-secondary">{hint}</p> : null}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
        >
          <X className="size-4" />
          Reset
        </button>
      </div>

      <label htmlFor="question-search" className="mt-4 block text-sm font-medium text-text-primary">
        Vyhledávání
      </label>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border/60 bg-background/45 px-3 py-3">
        <Search className="size-4 text-text-secondary" />
        <input
          id="question-search"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Titulek, otázka, tag, kapitola…"
          className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/80"
        />
      </div>

      <div className="mt-5 space-y-4">
        <details open className="group rounded-2xl border border-border/60 bg-background/35 p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-text-primary">
            Základní výběr
            <SlidersHorizontal className="size-4 text-text-secondary transition group-open:rotate-180" />
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">Sady</p>
              <div className="flex flex-wrap gap-2">
                {options.sets.map((set) => (
                  <Pill
                    key={set}
                    active={filters.sets.includes(set)}
                    onClick={() => onChange({ sets: toggleValue(filters.sets, set) })}
                  >
                    {set}
                  </Pill>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">Kapitoly</p>
              <div className="flex flex-wrap gap-2">
                {options.chapters.map((chapter) => (
                  <Pill
                    key={chapter}
                    active={filters.chapters.includes(chapter)}
                    onClick={() => onChange({ chapters: toggleValue(filters.chapters, chapter) })}
                  >
                    {chapter}
                  </Pill>
                ))}
              </div>
            </div>

            {options.subchapters.length ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                  Subkapitoly
                </p>
                <div className="flex flex-wrap gap-2">
                  {options.subchapters.map((subchapter) => (
                    <Pill
                      key={subchapter}
                      active={filters.subchapters.includes(subchapter)}
                      onClick={() =>
                        onChange({ subchapters: toggleValue(filters.subchapters, subchapter) })
                      }
                    >
                      {subchapter}
                    </Pill>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </details>

        <details className="rounded-2xl border border-border/60 bg-background/35 p-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-text-primary">Tagy a obtížnost</summary>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">Tagy</p>
              <div className="flex flex-wrap gap-2">
                {options.tags.map((tag) => (
                  <Pill
                    key={tag}
                    active={filters.tags.includes(tag)}
                    onClick={() => onChange({ tags: toggleValue(filters.tags, tag) })}
                  >
                    #{tag}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Obtížnost
              </p>
              <div className="flex flex-wrap gap-2">
                {options.difficulties.map((difficulty) => (
                  <Pill
                    key={difficulty}
                    active={filters.difficulties.includes(difficulty)}
                    onClick={() =>
                      onChange({ difficulties: toggleValue(filters.difficulties, difficulty) })
                    }
                  >
                    {`${difficulty}/5`}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </details>

        <details className="rounded-2xl border border-border/60 bg-background/35 p-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-text-primary">Stavy učení</summary>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Úroveň zvládnutí
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(RATING_META).map(([value, meta]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      onChange({
                        masteryLevels: toggleValue(
                          filters.masteryLevels,
                          Number(value) as MasteryLevel,
                        ),
                      })
                    }
                    className={cn(
                      'rounded-2xl border px-3 py-3 text-left text-sm transition',
                      filters.masteryLevels.includes(Number(value) as MasteryLevel)
                        ? meta.badgeClassName
                        : 'border-border/60 bg-background/20 text-text-secondary',
                    )}
                  >
                    <div className="font-semibold">{meta.label}</div>
                    <div className="mt-1 text-xs opacity-80">{meta.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Poslední výsledek
              </p>
              <div className="flex flex-wrap gap-2">
                <Pill active={filters.lastResult === 'all'} onClick={() => onChange({ lastResult: 'all' })}>
                  Vše
                </Pill>
                {Object.entries(RATING_META).map(([value, meta]) => (
                  <Pill
                    key={value}
                    active={filters.lastResult === Number(value)}
                    onClick={() =>
                      onChange({ lastResult: Number(value) as MasteryLevel })
                    }
                  >
                    {meta.shortLabel} · {meta.label}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ['favoritesOnly', 'Jen oblíbené'],
                ['newOnly', 'Jen nové'],
                ['mistakesOnly', 'Jen chybné'],
                ['showInvalid', 'Zobrazit i nevalidní'],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/20 px-3 py-3 text-sm text-text-primary"
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(filters[key as keyof QuestionFiltersState])}
                    onChange={(event) =>
                      onChange({ [key]: event.target.checked } as Partial<QuestionFiltersState>)
                    }
                    className="size-4 rounded border-border bg-background text-accent focus:ring-accent"
                  />
                </label>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  )
}
