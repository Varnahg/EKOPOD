import { useMemo, useState } from 'react'
import { AlertTriangle, FileWarning, X } from 'lucide-react'

import type { ContentIndex } from '@/types/content'

interface ContentStatusBannerProps {
  content: ContentIndex
}

export function ContentStatusBanner({ content }: ContentStatusBannerProps) {
  const warningSignature = useMemo(
    () => content.warnings.map((warning) => warning.id).join('|'),
    [content.warnings],
  )
  const [dismissedSignature, setDismissedSignature] = useState<string | null>(null)
  const dismissed = dismissedSignature === warningSignature

  if (!content.warnings.length || dismissed) {
    return null
  }

  return (
    <section className="rounded-2xl border border-warning/30 bg-warning/8 px-4 py-3 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <details className="group min-w-0 flex-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
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

        <button
          type="button"
          onClick={() => setDismissedSignature(warningSignature)}
          className="rounded-full border border-warning/30 p-2 text-warning transition hover:border-warning/55 hover:bg-warning/14"
          aria-label="Zavřít upozornění na načtené soubory"
          title="Zavřít upozornění"
        >
          <X className="size-4" />
        </button>
      </div>
    </section>
  )
}
