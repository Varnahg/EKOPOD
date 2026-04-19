export type MasteryLevel = 0 | 1 | 2 | 3

export const DETAIL_TAB_KEYS = [
  'modelAnswer',
  'outline',
  'detail',
  'pitfalls',
  'examples',
  'scripts',
  'summary',
] as const

export type DetailTabKey = (typeof DETAIL_TAB_KEYS)[number]

export interface ContentWarning {
  id: string
  severity: 'warning' | 'error'
  type:
    | 'missing-file'
    | 'missing-pdf'
    | 'invalid-frontmatter'
    | 'invalid-sections'
    | 'invalid-summary'
    | 'unknown-question'
  message: string
  path?: string
  questionId?: string
}

export interface SourceReference {
  pdfPath: string
  pages?: number[]
  sections?: string[]
}

export interface QuestionSections {
  question: string
  modelAnswer: string
  outline?: string
  detail?: string
  pitfalls?: string
  examples?: string
  scripts?: string
  aiSummary?: string
}

export interface QuestionDocument {
  id: string
  set: string
  chapter: string
  subchapter?: string
  title: string
  order: number
  tags: string[]
  difficulty: number
  summaryId?: string
  source: SourceReference
  filePath: string
  relativePath: string
  valid: boolean
  validationIssues: string[]
  sections: QuestionSections
  searchText: string
}

export interface SummaryHeading {
  depth: number
  title: string
  slug: string
}

export interface SummaryDocument {
  id: string
  title: string
  chapter: string
  order: number
  tags: string[]
  description?: string
  relatedQuestionIds: string[]
  filePath: string
  relativePath: string
  valid: boolean
  validationIssues: string[]
  body: string
  headings: SummaryHeading[]
  searchText: string
}

export interface PdfDocument {
  id: string
  label: string
  relativePath: string
  url: string
}

export interface ContentHealth {
  totalQuestions: number
  validQuestions: number
  invalidQuestions: number
  totalSummaries: number
  totalPdfs: number
}

export interface ContentIndex {
  questions: QuestionDocument[]
  validQuestions: QuestionDocument[]
  invalidQuestions: QuestionDocument[]
  summaries: SummaryDocument[]
  pdfs: PdfDocument[]
  primaryPdf: PdfDocument | null
  warnings: ContentWarning[]
  questionMap: Record<string, QuestionDocument>
  summaryMap: Record<string, SummaryDocument>
  pdfMap: Record<string, PdfDocument>
  health: ContentHealth
}
