import { ExternalLink, FileText, X } from 'lucide-react'
import { useMemo } from 'react'

import { MarkdownRenderer } from '@/components/markdown-renderer'
import { DETAIL_TAB_LABELS } from '@/lib/theme'
import { useMediaQuery } from '@/hooks/use-media-query'
import type { DetailTabKey, PdfDocument, QuestionDocument, SummaryDocument } from '@/types/content'
import { cn } from '@/lib/utils'

interface DetailPanelProps {
  open: boolean
  activeTab: DetailTabKey
  question: QuestionDocument | null
  relatedSummary?: SummaryDocument
  relatedPdf?: PdfDocument | null
  onClose: () => void
  onTabChange: (tab: DetailTabKey) => void
  onNavigateToQuestion: (questionId: string) => void
}

const TAB_TO_SECTION: Record<DetailTabKey, keyof QuestionDocument['sections'] | null> = {
  modelAnswer: 'modelAnswer',
  outline: 'outline',
  detail: 'detail',
  pitfalls: 'pitfalls',
  examples: 'examples',
  scripts: 'scripts',
  summary: null,
}

export function DetailPanel({
  open,
  activeTab,
  question,
  relatedSummary,
  relatedPdf,
  onClose,
  onTabChange,
  onNavigateToQuestion,
}: DetailPanelProps) {
  const isDesktop = useMediaQuery('(min-width: 1280px)')

  const markdown = useMemo(() => {
    if (!question) {
      return ''
    }

    if (activeTab === 'summary') {
      return question.sections.aiSummary ?? relatedSummary?.body ?? '*Pro tuto otázku zatím není propojený AI souhrn.*'
    }

    const sectionKey = TAB_TO_SECTION[activeTab]
    return sectionKey ? question.sections[sectionKey] ?? '*Sekce zatím není vyplněná.*' : ''
  }, [activeTab, question, relatedSummary])

  if (!open || !question) {
    return null
  }

  const containerClassName = isDesktop
    ? 'sticky top-24 h-[calc(100vh-8rem)]'
    : 'fixed inset-x-3 bottom-3 z-40 max-h-[72vh]'

  return (
    <aside className={containerClassName}>
      <div className="flex h-full flex-col rounded-[2rem] border border-border/70 bg-surface/95 shadow-soft backdrop-blur">
        <header className="border-b border-border/60 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">Detail otázky</p>
              <h2 className="mt-2 font-serif text-2xl text-text-primary">{question.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border/60 p-2 text-text-secondary transition hover:border-accent/35 hover:text-text-primary"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(DETAIL_TAB_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => onTabChange(key as DetailTabKey)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition',
                  activeTab === key
                    ? 'border-accent/45 bg-accent/14 text-text-primary'
                    : 'border-border/60 text-text-secondary hover:border-accent/35 hover:text-text-primary',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {activeTab === 'scripts' ? (
            <div className="mb-4 rounded-2xl border border-border/60 bg-background/35 p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                <FileText className="size-4" />
                Zdroj: {question.source.pdfPath}
                {question.source.pages?.length ? (
                  <span className="rounded-full border border-border/60 px-2 py-0.5 text-xs">
                    str. {question.source.pages.join(', ')}
                  </span>
                ) : null}
              </div>
              {relatedPdf ? (
                <a
                  href={relatedPdf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4"
                >
                  Otevřít PDF v nové kartě
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </div>
          ) : null}

          <MarkdownRenderer markdown={markdown} onNavigateToQuestion={onNavigateToQuestion} />
        </div>
      </div>
    </aside>
  )
}
