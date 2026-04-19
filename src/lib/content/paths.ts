// Root paths stay centralized here; Vite's import.meta.glob must receive literal strings.
export const CONTENT_ROOTS = {
  questions: '/content/questions/',
  summaries: '/content/summaries/',
  pdfs: '/content/pdf/',
} as const

export function stripContentRoot(filePath: string, type: keyof typeof CONTENT_ROOTS) {
  return filePath.replace(CONTENT_ROOTS[type], '')
}
