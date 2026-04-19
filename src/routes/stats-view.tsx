import { ProgressWidgets } from '@/components/progress-widgets'
import { useContent } from '@/providers/use-content'
import { useAppStore } from '@/store/app-store'

export function StatsView() {
  const content = useContent()
  const progress = useAppStore((state) => state.progress)

  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] border border-border/70 bg-surface/75 p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Statistiky</p>
        <h2 className="mt-3 font-serif text-4xl text-text-primary">Přehled postupu učením</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary">
          Sleduj, kolik otázek už je opravdu zvládnutých, které kapitoly zůstávají slabé a kde má smysl otevřít další session.
        </p>
      </div>
      <ProgressWidgets content={content} progress={progress} />
    </section>
  )
}
