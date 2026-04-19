import { useState } from 'react'

import { SummaryReader } from '@/components/summary-reader'
import { useContent } from '@/providers/use-content'
import { useAppStore } from '@/store/app-store'

export function SummariesView() {
  const content = useContent()
  const [selectedSummaryId, setSelectedSummaryId] = useState<string | null>(
    content.summaries[0]?.id ?? null,
  )
  const selectQuestion = useAppStore((state) => state.selectQuestion)
  const setDetailOpen = useAppStore((state) => state.setDetailOpen)
  const setDetailTab = useAppStore((state) => state.setDetailTab)

  return (
    <SummaryReader
      summaries={content.summaries}
      selectedSummaryId={selectedSummaryId}
      onSelectSummary={setSelectedSummaryId}
      onNavigateToQuestion={(questionId) => {
        selectQuestion(questionId)
        setDetailTab('summary')
        setDetailOpen(true)
      }}
    />
  )
}
