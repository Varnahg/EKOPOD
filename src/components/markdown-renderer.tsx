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
}: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-text-primary prose-p:leading-8 prose-li:leading-7 prose-strong:text-text-primary prose-code:rounded prose-code:bg-background/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:hidden prose-code:after:hidden', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { properties: { className: ['anchor-link'] } }],
        ]}
        components={{
          a: ({ href, children, ...props }) => {
            if (href?.startsWith('question:')) {
              const questionId = href.replace('question:', '')
              return (
                <button
                  type="button"
                  onClick={() => onNavigateToQuestion?.(questionId)}
                  className="font-medium text-accent underline decoration-accent/40 underline-offset-4"
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
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                className="font-medium text-accent underline decoration-accent/40 underline-offset-4"
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
                  isCallout
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
            <pre className="overflow-x-auto rounded-2xl border border-border/70 bg-background/80 p-4">
              {children}
            </pre>
          ),
          code: ({ children, className: codeClassName, ...props }) => (
            <code className={cn('font-mono text-sm text-text-primary', codeClassName)} {...props}>
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
