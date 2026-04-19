import { PdfViewerWrapper } from '@/components/pdf-viewer-wrapper'
import { useContent } from '@/providers/use-content'

export function PdfView() {
  const content = useContent()

  return <PdfViewerWrapper pdf={content.primaryPdf} />
}
