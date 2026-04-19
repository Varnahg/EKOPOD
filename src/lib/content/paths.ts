export const CONTENT_GLOBS = {
  questions: '/content/questions/**/*.md',
  summaries: '/content/summaries/**/*.md',
  pdfs: '/content/pdf/**/*.pdf',
} as const

export const CONTENT_ROOTS = {
  questions: '/content/questions/',
  summaries: '/content/summaries/',
  pdfs: '/content/pdf/',
} as const

export function stripContentRoot(filePath: string, type: keyof typeof CONTENT_ROOTS) {
  return filePath.replace(CONTENT_ROOTS[type], '')
}
