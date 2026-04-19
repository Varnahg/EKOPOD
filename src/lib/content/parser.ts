import { parse as parseYaml } from 'yaml'

import { extractHeadings, prepareMarkdown, stripMarkdown } from '@/lib/markdown'
import { parseQuestionSections } from '@/lib/content/sections'
import { formatZodIssues, questionFrontmatterSchema, summaryFrontmatterSchema } from '@/lib/content/validator'
import type { ContentWarning, QuestionDocument, SummaryDocument } from '@/types/content'
import { toNumberArray, toStringArray } from '@/lib/utils'

function parseFrontmatter(raw: string) {
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/)

  if (!match) {
    return {
      data: {},
      content: normalized,
      error: null as string | null,
    }
  }

  try {
    return {
      data: (parseYaml(match[1] ?? '') ?? {}) as Record<string, unknown>,
      content: normalized.slice(match[0].length),
      error: null as string | null,
    }
  } catch (error) {
    return {
      data: {},
      content: normalized,
      error: error instanceof Error ? error.message : 'Frontmatter se nepodařilo rozparsovat.',
    }
  }
}

function getRelativePdfPath(value: string) {
  return value.replace(/^\/?content\/pdf\//, '').replace(/^pdf\//, '')
}

function getFallbackId(relativePath: string) {
  return relativePath
    .replace(/\\/g, '/')
    .split('/')
    .pop()
    ?.replace(/\.md$/, '') ?? relativePath
}

export function parseQuestionFile(input: {
  filePath: string
  relativePath: string
  raw: string
  knownPdfPaths: Set<string>
}) {
  const { filePath, relativePath, raw, knownPdfPaths } = input
  const parsed = parseFrontmatter(raw)
  const fallbackId = getFallbackId(relativePath)
  const sectionData = parseQuestionSections(parsed.content)
  const fallbackTitle = typeof parsed.data.title === 'string' ? parsed.data.title : fallbackId
  const fallbackSet = typeof parsed.data.set === 'string' ? parsed.data.set : 'NEVALIDNÍ'
  const fallbackChapter =
    typeof parsed.data.chapter === 'string' ? parsed.data.chapter : 'Neznámá kapitola'
  const fallbackSubchapter =
    typeof parsed.data.subchapter === 'string' ? parsed.data.subchapter : undefined
  const fallbackDifficulty = Number(parsed.data.difficulty ?? 1)
  const fallbackOrder = Number(parsed.data.order ?? Number.MAX_SAFE_INTEGER)
  const fallbackTags = toStringArray(parsed.data.tags) ?? []
  const fallbackSourcePdfPath =
    typeof parsed.data.sourcePdfPath === 'string' ? getRelativePdfPath(parsed.data.sourcePdfPath) : ''
  const validationInput = {
    id: parsed.data.id,
    set: parsed.data.set,
    chapter: parsed.data.chapter,
    subchapter: parsed.data.subchapter,
    title: parsed.data.title,
    order: parsed.data.order,
    tags: parsed.data.tags,
    difficulty: parsed.data.difficulty,
    sourcePdfPath: parsed.data.sourcePdfPath,
    sourcePages: parsed.data.sourcePages,
    sourceSections: parsed.data.sourceSections,
    summaryId: parsed.data.summaryId,
  }
  const schemaResult = questionFrontmatterSchema.safeParse(validationInput)
  const validationIssues = schemaResult.success ? [] : formatZodIssues(schemaResult.error.issues)
  if (parsed.error) {
    validationIssues.push(`Frontmatter: ${parsed.error}`)
  }
  validationIssues.push(...sectionData.issues)

  if (
    fallbackSourcePdfPath &&
    !knownPdfPaths.has(fallbackSourcePdfPath)
  ) {
    validationIssues.push(
      `Soubor PDF \`${fallbackSourcePdfPath}\` neexistuje v \`content/pdf\`.`,
    )
  }

  if (!sectionData.sections.question) {
    validationIssues.push('Chybí sekce `## Otázka`.')
  }

  if (!sectionData.sections.modelAnswer) {
    validationIssues.push('Chybí sekce `## Modelová odpověď`.')
  }

  const question: QuestionDocument = {
    id: schemaResult.success ? schemaResult.data.id : fallbackId,
    set: schemaResult.success ? schemaResult.data.set : fallbackSet,
    chapter: schemaResult.success ? schemaResult.data.chapter : fallbackChapter,
    subchapter: schemaResult.success ? schemaResult.data.subchapter : fallbackSubchapter,
    title: schemaResult.success ? schemaResult.data.title : fallbackTitle,
    order: schemaResult.success ? schemaResult.data.order : fallbackOrder,
    tags: schemaResult.success ? schemaResult.data.tags : fallbackTags,
    difficulty: schemaResult.success ? schemaResult.data.difficulty : fallbackDifficulty,
    summaryId:
      schemaResult.success
        ? schemaResult.data.summaryId
        : typeof parsed.data.summaryId === 'string'
          ? parsed.data.summaryId
          : undefined,
    source: {
      pdfPath: schemaResult.success ? getRelativePdfPath(schemaResult.data.sourcePdfPath) : fallbackSourcePdfPath,
      pages: schemaResult.success ? schemaResult.data.sourcePages : toNumberArray(parsed.data.sourcePages),
      sections: schemaResult.success ? schemaResult.data.sourceSections : toStringArray(parsed.data.sourceSections),
    },
    filePath,
    relativePath,
    valid: validationIssues.length === 0,
    validationIssues,
    sections: {
      question: sectionData.sections.question ?? '*Otázka se nepodařila načíst.*',
      modelAnswer: sectionData.sections.modelAnswer ?? '*Modelová odpověď chybí.*',
      outline: sectionData.sections.outline,
      detail: sectionData.sections.detail,
      pitfalls: sectionData.sections.pitfalls,
      examples: sectionData.sections.examples,
      scripts: sectionData.sections.scripts,
      aiSummary: sectionData.sections.aiSummary,
    },
    searchText: stripMarkdown(
      [
        fallbackTitle,
        fallbackChapter,
        fallbackSubchapter,
        fallbackTags.join(' '),
        sectionData.sections.question,
        sectionData.sections.modelAnswer,
        sectionData.sections.outline,
        sectionData.sections.detail,
        sectionData.sections.pitfalls,
        sectionData.sections.examples,
      ]
        .filter(Boolean)
        .join('\n'),
    ),
  }

  const warnings: ContentWarning[] = validationIssues.length
    ? [
        {
          id: `${question.id}-invalid`,
          severity: 'warning',
          type: schemaResult.success ? 'invalid-sections' : 'invalid-frontmatter',
          message: `Otázka ${question.id} má problémy v obsahu nebo metadatech.`,
          path: relativePath,
          questionId: question.id,
        },
      ]
    : []

  return {
    question,
    warnings,
  }
}

export function parseSummaryFile(input: {
  filePath: string
  relativePath: string
  raw: string
}) {
  const { filePath, relativePath, raw } = input
  const parsed = parseFrontmatter(raw)
  const fallbackId = getFallbackId(relativePath)
  const fallbackTitle = typeof parsed.data.title === 'string' ? parsed.data.title : fallbackId
  const fallbackChapter =
    typeof parsed.data.chapter === 'string' ? parsed.data.chapter : 'Neznámá kapitola'
  const fallbackOrder = Number(parsed.data.order ?? Number.MAX_SAFE_INTEGER)
  const fallbackTags = toStringArray(parsed.data.tags) ?? []
  const fallbackDescription =
    typeof parsed.data.description === 'string' ? parsed.data.description : undefined
  const fallbackRelatedQuestionIds = toStringArray(parsed.data.relatedQuestionIds) ?? []
  const validationInput = {
    id: parsed.data.id,
    title: parsed.data.title,
    chapter: parsed.data.chapter,
    order: parsed.data.order,
    tags: parsed.data.tags,
    description: parsed.data.description,
    relatedQuestionIds: parsed.data.relatedQuestionIds,
  }
  const schemaResult = summaryFrontmatterSchema.safeParse(validationInput)
  const validationIssues = schemaResult.success ? [] : formatZodIssues(schemaResult.error.issues)
  if (parsed.error) {
    validationIssues.push(`Frontmatter: ${parsed.error}`)
  }
  const body = prepareMarkdown(parsed.content.trim())

  if (!body) {
    validationIssues.push('Souhrn nemá žádné tělo markdownu.')
  }

  const summary: SummaryDocument = {
    id: schemaResult.success ? schemaResult.data.id : fallbackId,
    title: schemaResult.success ? schemaResult.data.title : fallbackTitle,
    chapter: schemaResult.success ? schemaResult.data.chapter : fallbackChapter,
    order: schemaResult.success ? schemaResult.data.order : fallbackOrder,
    tags: schemaResult.success ? schemaResult.data.tags : fallbackTags,
    description: schemaResult.success ? schemaResult.data.description : fallbackDescription,
    relatedQuestionIds: schemaResult.success
      ? schemaResult.data.relatedQuestionIds
      : fallbackRelatedQuestionIds,
    filePath,
    relativePath,
    valid: validationIssues.length === 0,
    validationIssues,
    body,
    headings: extractHeadings(body),
    searchText: stripMarkdown(
      [fallbackTitle, fallbackChapter, fallbackTags.join(' '), body]
        .filter(Boolean)
        .join('\n'),
    ),
  }

  const warnings: ContentWarning[] = validationIssues.length
    ? [
        {
          id: `${summary.id}-invalid`,
          severity: 'warning',
          type: 'invalid-summary',
          message: `Souhrn ${summary.id} není kompletní.`,
          path: relativePath,
        },
      ]
    : []

  return {
    summary,
    warnings,
  }
}
