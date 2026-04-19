import { ChevronLeft, ChevronRight, ExternalLink, LoaderCircle, Minus, Plus, ScanLine } from 'lucide-react'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import { useElementWidth } from '@/hooks/use-element-width'
import type { PdfDocument } from '@/types/content'
import { clamp, cn } from '@/lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

interface PdfViewerWrapperProps {
  pdf: PdfDocument | null
}

export function PdfViewerWrapper({ pdf }: PdfViewerWrapperProps) {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [fitWidth, setFitWidth] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const { ref, width } = useElementWidth<HTMLDivElement>()

  const pageWidth = fitWidth ? Math.max(width - 32, 280) : Math.max((width - 32) * zoom, 280)

  if (!pdf) {
    return (
      <section className="rounded-[2rem] border border-warning/35 bg-warning/10 p-8 text-center shadow-card">
        <h2 className="font-serif text-3xl text-text-primary">PDF soubor zatím chybí</h2>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          Nahraj jeden soubor do `content/pdf/` a nastav jeho cestu ve frontmatteru otázek.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-[2rem] border border-border/70 bg-surface/75 p-4 shadow-card md:p-5">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">Skripta PDF</p>
          <h2 className="mt-2 font-serif text-3xl text-text-primary">{pdf.label}</h2>
        </div>
        <a
          href={pdf.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent/40 hover:text-accent"
        >
          Otevřít v nové kartě
          <ExternalLink className="size-4" />
        </a>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-background/30 p-3">
        <button
          type="button"
          onClick={() => setPageNumber((current) => clamp(current - 1, 1, pageCount || 1))}
          className="rounded-full border border-border/60 p-2 text-text-primary transition hover:border-accent/35"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setPageNumber((current) => clamp(current + 1, 1, pageCount || 1))}
          className="rounded-full border border-border/60 p-2 text-text-primary transition hover:border-accent/35"
        >
          <ChevronRight className="size-4" />
        </button>
        <span className="rounded-full border border-border/60 px-3 py-2 text-sm text-text-primary">
          Strana {pageNumber}/{pageCount || '?'}
        </span>
        <button
          type="button"
          onClick={() => {
            setFitWidth(false)
            setZoom((current) => clamp(Number((current - 0.1).toFixed(2)), 0.5, 2.5))
          }}
          className="rounded-full border border-border/60 p-2 text-text-primary transition hover:border-accent/35"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setFitWidth(false)
            setZoom((current) => clamp(Number((current + 0.1).toFixed(2)), 0.5, 2.5))
          }}
          className="rounded-full border border-border/60 p-2 text-text-primary transition hover:border-accent/35"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setFitWidth(true)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition',
            fitWidth
              ? 'border-accent/45 bg-accent/14 text-text-primary'
              : 'border-border/60 text-text-primary hover:border-accent/35',
          )}
        >
          <ScanLine className="size-4" />
          Na šířku
        </button>
      </div>

      <div ref={ref} className="mt-5 min-h-[50rem] overflow-auto rounded-[1.75rem] border border-border/60 bg-background/35 p-4">
        {loadError ? (
          <div className="grid min-h-[40rem] place-items-center text-center">
            <div>
              <h3 className="font-serif text-2xl text-text-primary">PDF se nepodařilo načíst</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{loadError}</p>
              <a
                href={pdf.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent/35 hover:text-accent"
              >
                Otevřít fallback v nové kartě
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        ) : (
          <Document
            file={pdf.url}
            loading={
              <div className="grid min-h-[40rem] place-items-center text-text-secondary">
                <LoaderCircle className="size-6 animate-spin" />
              </div>
            }
            onLoadSuccess={({ numPages }) => {
              setPageCount(numPages)
              setPageNumber(1)
              setLoadError(null)
            }}
            onLoadError={(error) => setLoadError(error.message)}
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div className="grid min-h-[40rem] place-items-center text-text-secondary">
                  <LoaderCircle className="size-6 animate-spin" />
                </div>
              }
            />
          </Document>
        )}
      </div>
    </section>
  )
}
