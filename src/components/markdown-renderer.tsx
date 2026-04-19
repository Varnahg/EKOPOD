import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  markdown: string
  className?: string
  onNavigateToQuestion?: (questionId: string) => void
  tone?: 'default' | 'paper'
}

function flattenNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(flattenNodeText).join(' ')
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return flattenNodeText((node as { props?: { children?: ReactNode } }).props?.children)
  }

  return ''
}

export function MarkdownRenderer({
  markdown,
  className,
  onNavigateToQuestion,
  tone = 'default',
}: MarkdownRendererProps) {
  const isPaper = tone === 'paper'
  const proseClassName = isPaper
    ? 'prose max-w-none prose-headings:font-serif prose-headings:text-text-ink prose-p:leading-8 prose-p:text-text-ink/88 prose-li:leading-7 prose-li:text-text-ink/88 prose-strong:text-text-ink prose-code:rounded prose-code:bg-text-ink/6 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:text-text-ink prose-code:before:hidden prose-code:after:hidden prose-hr:border-text-ink/14 prose-th:text-text-ink prose-td:text-text-ink/85 prose-blockquote:text-text-ink/88'
    : 'prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-text-primary prose-p:leading-8 prose-li:leading-7 prose-strong:text-text-primary prose-code:rounded prose-code:bg-background/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:hidden prose-code:after:hidden'
  const linkClassName = isPaper
    ? 'font-medium text-[#275a8c] underline decoration-[#275a8c]/35 underline-offset-4'
    : 'font-medium text-accent underline decoration-accent/40 underline-offset-4'

  return (
    <div className={cn(proseClassName, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { properties: { className: ['anchor-link'] } }],
        ]}
        components={{
          a: ({ href, children, onClick, ...props }) => {
            if (href?.startsWith('question:')) {
              const questionId = href.replace('question:', '')
              return (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onNavigateToQuestion?.(questionId)
                  }}
                  className={linkClassName}
                >
                  {children}
                </button>
              )
            }

            const isExternal = href?.startsWith('http')

            return (
              <a
                href={href}
                {...props}
                onClick={(event) => {
                  event.stopPropagation()
                  onClick?.(event)
                }}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                className={linkClassName}
              >
                {children}
              </a>
            )
          },
          blockquote: ({ children }) => {
            const plainText = flattenNodeText(children).trim()
            const isCallout = /^(Poznámka|Tip|Důležité|Pozor|Riziko)/i.test(plainText)

            return (
              <blockquote
                className={cn(
                  'rounded-2xl border-l-4 px-5 py-4 not-italic',
                  isPaper
                    ? isCallout
                      ? 'border-text-ink/20 bg-text-ink/5 text-text-ink'
                      : 'border-text-ink/15 bg-text-ink/4 text-text-ink/88'
                    : isCallout
                      ? 'border-accent/50 bg-accent/10 text-text-primary'
                      : 'border-border bg-surface/55 text-text-secondary',
                )}
              >
                {children}
              </blockquote>
            )
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
          pre: ({ children }) => (
            <pre
              className={cn(
                'overflow-x-auto rounded-2xl border p-4',
                isPaper
                  ? 'border-text-ink/12 bg-text-ink/4'
                  : 'border-border/70 bg-background/80',
              )}
            >
              {children}
            </pre>
          ),
          code: ({ children, className: codeClassName, ...props }) => (
            <code
              className={cn(
                'font-mono text-sm',
                isPaper ? 'text-text-ink' : 'text-text-primary',
                codeClassName,
              )}
              {...props}
            >
              {children}
            </code>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
