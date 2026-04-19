import { BookMarked } from 'lucide-react'

import { MarkdownRenderer } from '@/components/markdown-renderer'
import type { SummaryDocument } from '@/types/content'
import { cn } from '@/lib/utils'

interface SummaryReaderProps {
  summaries: SummaryDocument[]
  selectedSummaryId: string | null
  onSelectSummary: (summaryId: string) => void
  onNavigateToQuestion: (questionId: string) => void
}

export function SummaryReader({
  summaries,
  selectedSummaryId,
  onSelectSummary,
  onNavigateToQuestion,
}: SummaryReaderProps) {
  const selectedSummary =
    summaries.find((summary) => summary.id === selectedSummaryId) ?? summaries[0] ?? null

  if (!selectedSummary) {
    return (
      <section className="rounded-[2rem] border border-dashed border-border/70 bg-surface/60 p-8 text-center shadow-card">
        <h2 className="font-serif text-3xl text-text-primary">Souhrny zatím nejsou nahrané</h2>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          Přidej markdown soubory do `content/summaries` a aplikace je automaticky načte.
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)_16rem]">
      <aside className="rounded-[2rem] border border-border/70 bg-surface/75 p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">AI souhrny</p>
        <div className="mt-4 space-y-2">
          {summaries.map((summary) => (
            <button
              key={summary.id}
              type="button"
              onClick={() => onSelectSummary(summary.id)}
              className={cn(
                'w-full rounded-2xl border px-4 py-3 text-left transition',
                summary.id === selectedSummary.id
                  ? 'border-accent/45 bg-accent/14 text-text-primary'
                  : 'border-border/60 bg-background/20 text-text-secondary hover:border-accent/30 hover:text-text-primary',
              )}
            >
              <div className="text-sm font-semibold">{summary.title}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.14em] text-text-secondary">
                {summary.chapter}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <article className="rounded-[2rem] border border-border/70 bg-surface/75 p-6 shadow-card md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <BookMarked className="size-4" />
            Čtecí režim
          </span>
          <span className="rounded-full border border-border/60 px-3 py-1 text-sm text-text-secondary">
            {selectedSummary.chapter}
          </span>
        </div>
        <h2 className="mt-4 font-serif text-4xl text-text-primary">{selectedSummary.title}</h2>
        {selectedSummary.description ? (
          <p className="mt-3 text-sm leading-7 text-text-secondary">{selectedSummary.description}</p>
        ) : null}
        <div className="mt-8">
          <MarkdownRenderer markdown={selectedSummary.body} onNavigateToQuestion={onNavigateToQuestion} />
        </div>
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-24 rounded-[2rem] border border-border/70 bg-surface/75 p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">Obsah</p>
          <nav className="mt-4 space-y-2">
            {selectedSummary.headings
              .filter((heading) => heading.depth <= 3)
              .map((heading) => (
                <a
                  key={heading.slug}
                  href={`#${heading.slug}`}
                  className={cn(
                    'block rounded-xl px-3 py-2 text-sm text-text-secondary transition hover:bg-background/35 hover:text-text-primary',
                    heading.depth === 2 && 'font-semibold text-text-primary',
                    heading.depth === 3 && 'pl-6',
                  )}
                >
                  {heading.title}
                </a>
              ))}
          </nav>
        </div>
      </aside>
    </section>
  )
}
