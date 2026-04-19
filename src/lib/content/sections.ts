import type { QuestionSections } from '@/types/content'
import { normalizeLabel } from '@/lib/utils'

const SECTION_ALIASES: Record<keyof QuestionSections, string[]> = {
  question: ['otazka', 'question'],
  modelAnswer: ['modelova odpoved', 'odpoved', 'model answer', 'answer'],
  outline: ['osnova odpovedi', 'osnova', 'outline'],
  detail: ['detail', 'detailni vysvetleni', 'vysvetleni', 'detail explanation'],
  pitfalls: ['chytaky', 'pitfalls', 'pozor'],
  examples: ['priklady', 'priklady / situace', 'situace', 'examples', 'examples / situations'],
  scripts: ['ve skriptech', 'skripta', 've skriptech / pdf', 'in scripts', 'source'],
  aiSummary: ['ai souhrn', 'souhrn', 'ai summary', 'summary'],
}

function getCanonicalSection(value: string): keyof QuestionSections | null {
  const normalized = normalizeLabel(value)

  for (const [section, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.includes(normalized)) {
      return section as keyof QuestionSections
    }
  }

  return null
}

export function parseQuestionSections(markdown: string) {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n').trim()
  const headingRegex = /^##\s+(.+)$/gm
  const matches = Array.from(normalizedMarkdown.matchAll(headingRegex))
  const sections: Partial<QuestionSections> = {}
  const issues: string[] = []

  if (!matches.length) {
    return {
      sections,
      issues: ['Chybí sekce druhé úrovně `##`. Očekávám např. `## Otázka` a `## Modelová odpověď`.'],
    }
  }

  matches.forEach((match, index) => {
    const rawHeading = match[1]?.trim() ?? ''
    const sectionKey = getCanonicalSection(rawHeading)
    const start = (match.index ?? 0) + match[0].length
    const end = index + 1 < matches.length ? matches[index + 1].index ?? normalizedMarkdown.length : normalizedMarkdown.length
    const sectionBody = normalizedMarkdown.slice(start, end).trim()

    if (!sectionKey) {
      issues.push(`Neznámá sekce \`${rawHeading}\`.`)
      return
    }

    if (!sectionBody) {
      issues.push(`Sekce \`${rawHeading}\` je prázdná.`)
      return
    }

    sections[sectionKey] = sectionBody
  })

  return {
    sections,
    issues,
  }
}
