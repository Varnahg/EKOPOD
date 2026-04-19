import { AlertTriangle, FileWarning, ShieldCheck } from 'lucide-react'

import type { ContentIndex } from '@/types/content'
import { cn } from '@/lib/utils'

interface ContentStatusBannerProps {
  content: ContentIndex
}

export function ContentStatusBanner({ content }: ContentStatusBannerProps) {
  const hasWarnings = content.warnings.length > 0

  return (
    <section
      className={cn(
        'rounded-3xl border px-4 py-4 shadow-card sm:px-5',
        hasWarnings
          ? 'border-warning/35 bg-warning/10'
          : 'border-success/35 bg-success/10',
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
            hasWarnings
              ? 'border-warning/40 bg-warning/12 text-warning'
              : 'border-success/40 bg-success/12 text-success',
          )}
        >
          {hasWarnings ? <FileWarning className="size-4" /> : <ShieldCheck className="size-4" />}
          Stav obsahu
        </span>
        <p className="text-sm text-text-primary">
          {content.health.validQuestions}/{content.health.totalQuestions} validních otázek,
          {' '}
          {content.health.totalSummaries} souhrnů,
          {' '}
          {content.health.totalPdfs} PDF souborů
        </p>
      </div>

      {hasWarnings ? (
        <details className="mt-3 rounded-2xl border border-warning/25 bg-background/25 p-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-text-primary">
            Upozornění k obsahu ({content.warnings.length})
          </summary>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            {content.warnings.map((warning) => (
              <li key={warning.id} className="flex gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                <span>
                  {warning.message}
                  {warning.path ? (
                    <span className="mt-1 block font-mono text-xs text-text-secondary/90">
                      {warning.path}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : (
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          Načtené soubory prošly základní validací a aplikace je připravená ke studiu.
        </p>
      )}
    </section>
  )
}
