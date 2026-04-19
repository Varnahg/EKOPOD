import { AlertTriangle, FileWarning } from 'lucide-react'

import type { ContentIndex } from '@/types/content'

interface ContentStatusBannerProps {
  content: ContentIndex
}

export function ContentStatusBanner({ content }: ContentStatusBannerProps) {
  if (!content.warnings.length) {
    return null
  }

  return (
    <section className="rounded-2xl border border-warning/30 bg-warning/8 px-4 py-3 shadow-card">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-warning/35 bg-warning/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-warning">
              <FileWarning className="size-4" />
              Obsah
            </span>
            <p className="text-sm text-text-primary">
              {content.warnings.length} upozornění k načteným souborům
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.16em] text-text-secondary">
            rozbalit
          </span>
        </summary>

        <ul className="mt-3 space-y-2 border-t border-warning/20 pt-3 text-sm text-text-secondary">
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
    </section>
  )
}
