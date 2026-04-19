import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LoaderCircle,
  Minus,
  Plus,
  ScanLine,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { pdfjs } from 'react-pdf'

import { clamp, cn } from '@/lib/utils'
import type { PdfDocument } from '@/types/content'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const PAGE_COUNT_TIMEOUT_MS = 8_000

interface PdfViewerWrapperProps {
  pdf: PdfDocument | null
}

function buildEmbeddedPdfUrl(pdfUrl: string, pageNumber: number, fitWidth: boolean, zoom: number) {
  const [baseUrl] = pdfUrl.split('#')
  const hashParams = new URLSearchParams()

  hashParams.set('page', String(pageNumber))
  hashParams.set('zoom', fitWidth ? 'page-width' : String(Math.round(zoom * 100)))

  return `${baseUrl}#${hashParams.toString()}`
}

export function PdfViewerWrapper({ pdf }: PdfViewerWrapperProps) {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [fitWidth, setFitWidth] = useState(true)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isViewerLoading, setIsViewerLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const pdfUrl = pdf?.url ?? null
  const embeddedPdfUrl = useMemo(() => {
    if (!pdfUrl) {
      return null
    }

    return buildEmbeddedPdfUrl(pdfUrl, pageNumber, fitWidth, zoom)
  }, [fitWidth, pageNumber, pdfUrl, zoom])

  useEffect(() => {
    if (!pdfUrl) {
      return
    }

    const activePdfUrl = pdfUrl
    const controller = new AbortController()
    let loadingTask: ReturnType<typeof pdfjs.getDocument> | null = null

    async function validatePdf() {
      setPageNumber(1)
      setPageCount(0)
      setLoadError(null)
      setIsPreparing(true)
      setIsViewerLoading(true)

      try {
        const response = await fetch(activePdfUrl, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`PDF soubor se nepodařilo načíst (${response.status}).`)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error ? error.message : 'Nepodařilo se připravit PDF pro zobrazení.',
          )
          setIsViewerLoading(false)
        }

        return
      } finally {
        if (!controller.signal.aborted) {
          setIsPreparing(false)
        }
      }

      try {
        loadingTask = pdfjs.getDocument({
          url: activePdfUrl,
          disableAutoFetch: true,
          disableStream: true,
        })

        const pdfDocument = await Promise.race([
          loadingTask.promise,
          new Promise<never>((_, reject) => {
            window.setTimeout(() => reject(new Error('page-count-timeout')), PAGE_COUNT_TIMEOUT_MS)
          }),
        ])

        if (!controller.signal.aborted) {
          setPageCount(pdfDocument.numPages)
        }

        void pdfDocument.destroy().catch(() => undefined)
      } catch {
        if (!controller.signal.aborted) {
          setPageCount(0)
        }
      }
    }

    void validatePdf()

    return () => {
      controller.abort()
      if (loadingTask) {
        void loadingTask.destroy().catch(() => undefined)
      }
    }
  }, [pdfUrl, reloadKey])

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

  const canGoBackward = pageNumber > 1
  const canGoForward = pageCount > 0 ? pageNumber < pageCount : true
  const pageLabel = pageCount > 0 ? `${pageNumber}/${pageCount}` : `${pageNumber}`

  return (
    <section className="rounded-[2rem] border border-border/70 bg-surface/75 p-4 shadow-card md:p-5 xl:flex xl:h-full xl:min-h-0 xl:flex-col">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
            Skripta PDF
          </p>
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

      <div className="mt-4 flex shrink-0 flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-background/30 p-3">
        <button
          type="button"
          onClick={() => {
            setIsViewerLoading(true)
            setPageNumber((current) => Math.max(current - 1, 1))
          }}
          disabled={!canGoBackward}
          className="rounded-full border border-border/60 p-2 text-text-primary transition hover:border-accent/35 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsViewerLoading(true)
            setPageNumber((current) =>
              pageCount > 0 ? clamp(current + 1, 1, pageCount) : current + 1,
            )
          }}
          disabled={!canGoForward}
          className="rounded-full border border-border/60 p-2 text-text-primary transition hover:border-accent/35 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronRight className="size-4" />
        </button>
        <span className="rounded-full border border-border/60 px-3 py-2 text-sm text-text-primary">
          Strana {pageLabel}
        </span>
        <button
          type="button"
          onClick={() => {
            setIsViewerLoading(true)
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
            setIsViewerLoading(true)
            setFitWidth(false)
            setZoom((current) => clamp(Number((current + 0.1).toFixed(2)), 0.5, 2.5))
          }}
          className="rounded-full border border-border/60 p-2 text-text-primary transition hover:border-accent/35"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsViewerLoading(true)
            setFitWidth(true)
          }}
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

      <div className="mt-5 rounded-[1.75rem] border border-border/60 bg-background/35 p-4 xl:min-h-0 xl:flex-1">
        {loadError ? (
          <div className="grid min-h-[40rem] place-items-center text-center">
            <div className="w-full max-w-3xl">
              <h3 className="font-serif text-2xl text-text-primary">PDF se nepodařilo načíst</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{loadError}</p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsViewerLoading(true)
                    setReloadKey((current) => current + 1)
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent/35"
                >
                  Zkusit znovu
                </button>
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent/35 hover:text-accent"
                >
                  Otevřít v nové kartě
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </div>
        ) : embeddedPdfUrl ? (
          <div className="relative min-h-[40rem] overflow-hidden rounded-[1.5rem] border border-border/60 bg-background/55 xl:h-full">
            <iframe
              key={`${pdf.url}-${reloadKey}`}
              title={`Skripta PDF: ${pdf.label}`}
              src={embeddedPdfUrl}
              onLoad={() => setIsViewerLoading(false)}
              className="h-[72vh] min-h-[40rem] w-full border-0 bg-paper xl:h-full"
            />

            {(isPreparing || isViewerLoading) && (
              <div className="absolute inset-0 grid place-items-center bg-background/55 text-text-secondary backdrop-blur-[1px]">
                <LoaderCircle className="size-6 animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="grid min-h-[40rem] place-items-center text-text-secondary">
            <LoaderCircle className="size-6 animate-spin" />
          </div>
        )}
      </div>

      <p className="mt-3 text-xs leading-6 text-text-secondary">
        Pokud by vložené zobrazení v tvém prohlížeči nešlo otevřít korektně, použij tlačítko
        `Otevřít v nové kartě`.
      </p>
    </section>
  )
}
