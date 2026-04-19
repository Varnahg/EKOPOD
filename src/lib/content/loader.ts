import { parseQuestionFile, parseSummaryFile } from '@/lib/content/parser'
import { stripContentRoot } from '@/lib/content/paths'
import type { ContentIndex, ContentWarning, PdfDocument } from '@/types/content'

// Vite requires literal glob strings here; imported constants are rejected at parse time.
const questionModules = import.meta.glob('/content/questions/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const summaryModules = import.meta.glob('/content/summaries/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const pdfModules = import.meta.glob('/content/pdf/**/*.pdf', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function createPdfDocuments() {
  return Object.entries(pdfModules)
    .map(([filePath, url]): PdfDocument => {
      const relativePath = stripContentRoot(filePath, 'pdfs')
      return {
        id: relativePath.replace(/\//g, '-').replace(/\.pdf$/i, ''),
        label: relativePath.split('/').pop()?.replace(/\.pdf$/i, '') ?? relativePath,
        relativePath,
        url,
      }
    })
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath, 'cs'))
}

export function loadContentIndex(): ContentIndex {
  const warnings: ContentWarning[] = []
  const pdfs = createPdfDocuments()
  const knownPdfPaths = new Set(pdfs.map((pdf) => pdf.relativePath))

  if (!pdfs.length) {
    warnings.push({
      id: 'missing-primary-pdf',
      severity: 'warning',
      type: 'missing-pdf',
      message: 'Ve složce `content/pdf` není žádný PDF soubor.',
      path: 'content/pdf',
    })
  }

  if (!Object.keys(questionModules).length) {
    warnings.push({
      id: 'missing-questions',
      severity: 'warning',
      type: 'missing-file',
      message: 'Ve složce `content/questions` zatím nejsou žádné markdownové otázky.',
      path: 'content/questions',
    })
  }

  const parsedQuestions = Object.entries(questionModules)
    .map(([filePath, raw]) =>
      parseQuestionFile({
        filePath,
        relativePath: stripContentRoot(filePath, 'questions'),
        raw,
        knownPdfPaths,
      }),
    )
    .sort((left, right) => left.question.order - right.question.order)

  const parsedSummaries = Object.entries(summaryModules)
    .map(([filePath, raw]) =>
      parseSummaryFile({
        filePath,
        relativePath: stripContentRoot(filePath, 'summaries'),
        raw,
      }),
    )
    .sort((left, right) => left.summary.order - right.summary.order)

  parsedQuestions.forEach((entry) => warnings.push(...entry.warnings))
  parsedSummaries.forEach((entry) => warnings.push(...entry.warnings))

  const summaries = parsedSummaries.map((entry) => entry.summary)
  const summaryMap = Object.fromEntries(summaries.map((summary) => [summary.id, summary]))
  const questions = parsedQuestions.map((entry) => {
    const relatedSummary = entry.question.summaryId ? summaryMap[entry.question.summaryId] : undefined

    if (entry.question.summaryId && !relatedSummary) {
      warnings.push({
        id: `${entry.question.id}-missing-summary`,
        severity: 'warning',
        type: 'invalid-summary',
        message: `Otázka ${entry.question.id} odkazuje na neexistující AI souhrn ${entry.question.summaryId}.`,
        path: entry.question.relativePath,
        questionId: entry.question.id,
      })
    }

    return {
      ...entry.question,
      searchText: `${entry.question.searchText} ${relatedSummary?.headings.map((heading) => heading.title).join(' ') ?? ''}`.trim(),
    }
  })
  const questionMap = Object.fromEntries(questions.map((question) => [question.id, question]))
  const pdfMap = Object.fromEntries(pdfs.map((pdf) => [pdf.relativePath, pdf]))
  const validQuestions = questions.filter((question) => question.valid)
  const invalidQuestions = questions.filter((question) => !question.valid)

  if (import.meta.env.DEV) {
    invalidQuestions.forEach((question) => {
      console.groupCollapsed(`[EKOPOD] Nevalidní otázka: ${question.id}`)
      question.validationIssues.forEach((issue) => console.warn(issue))
      console.groupEnd()
    })
    summaries
      .filter((summary) => !summary.valid)
      .forEach((summary) => {
        console.groupCollapsed(`[EKOPOD] Nevalidní souhrn: ${summary.id}`)
        summary.validationIssues.forEach((issue) => console.warn(issue))
        console.groupEnd()
      })
  }

  return {
    questions,
    validQuestions,
    invalidQuestions,
    summaries,
    pdfs,
    primaryPdf: pdfs[0] ?? null,
    warnings,
    questionMap,
    summaryMap,
    pdfMap,
    health: {
      totalQuestions: questions.length,
      validQuestions: validQuestions.length,
      invalidQuestions: invalidQuestions.length,
      totalSummaries: summaries.length,
      totalPdfs: pdfs.length,
    },
  }
}
