import { BookOpenCheck, CircleGauge, ListChecks, TimerReset } from 'lucide-react'

import { calculateStats } from '@/lib/stats'
import type { ContentIndex } from '@/types/content'
import type { ProgressEntry } from '@/types/state'
import { formatDateTime } from '@/lib/utils'

interface ProgressWidgetsProps {
  content: ContentIndex
  progress: Record<string, ProgressEntry>
}

export function ProgressWidgets({ content, progress }: ProgressWidgetsProps) {
  const stats = calculateStats(content, progress)

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Otázek celkem',
            value: stats.total,
            icon: ListChecks,
          },
          {
            label: 'Zvládnuté dobře',
            value: stats.mastered,
            icon: BookOpenCheck,
          },
          {
            label: 'Slabé / nové',
            value: stats.weak,
            icon: CircleGauge,
          },
          {
            label: 'Poslední aktivita',
            value: formatDateTime(stats.latestActivity),
            icon: TimerReset,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <article key={item.label} className="rounded-[2rem] border border-border/70 bg-surface/75 p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">{item.label}</p>
                  <div className="mt-3 font-serif text-4xl text-text-primary">{item.value}</div>
                </div>
                <div className="rounded-2xl border border-accent/35 bg-accent/12 p-3 text-accent">
                  <Icon className="size-5" />
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ProgressGroup
          title="Průchod podle sad"
          description="Kolik otázek z jednotlivých sad je už na úrovni 3."
          items={stats.perSet}
        />
        <ProgressGroup
          title="Průchod podle kapitol"
          description="Kapitoly, kde je nejvíc slabých nebo nových míst."
          items={stats.perChapter}
        />
      </section>
    </div>
  )
}

function ProgressGroup({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: Array<{
    label: string
    total: number
    mastered: number
    weak: number
    percent: number
  }>
}) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-surface/75 p-5 shadow-card">
      <h2 className="font-serif text-3xl text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-text-secondary">{description}</p>
      <div className="mt-6 space-y-4">
        {items.length ? (
          items.map((item) => (
            <article key={item.label} className="rounded-2xl border border-border/60 bg-background/25 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-text-primary">{item.label}</div>
                  <div className="mt-1 text-sm text-text-secondary">
                    {item.mastered}/{item.total} na úrovni 3 · slabé {item.weak}
                  </div>
                </div>
                <div className="font-semibold text-accent">{item.percent}%</div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-background/70">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-300"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm leading-7 text-text-secondary">Zatím není z čeho statistiku spočítat.</p>
        )}
      </div>
    </section>
  )
}
