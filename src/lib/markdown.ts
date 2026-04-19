import type { SummaryHeading } from '@/types/content'
import { slugifySequence } from '@/lib/utils'

const CALLOUT_LABELS: Record<string, string> = {
  NOTE: 'Poznámka',
  TIP: 'Tip',
  IMPORTANT: 'Důležité',
  WARNING: 'Pozor',
  CAUTION: 'Riziko',
}

export function prepareMarkdown(markdown: string) {
  return markdown
    .replace(/\r\n/g, '\n')
    .replace(/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/gim, (_, kind) => `> **${CALLOUT_LABELS[kind] ?? kind}**`)
}

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^>+/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractHeadings(markdown: string): SummaryHeading[] {
  const normalizedMarkdown = prepareMarkdown(markdown)
  const matches = Array.from(normalizedMarkdown.matchAll(/^(#{1,6})\s+(.+)$/gm))
  const titles = matches.map((match) => cleanHeading(match[2] ?? ''))
  const slugs = slugifySequence(titles)

  return matches.map((match, index) => ({
    depth: match[1]?.length ?? 1,
    title: titles[index] ?? '',
    slug: slugs[index] ?? '',
  }))
}

function cleanHeading(value: string) {
  return value
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
}
