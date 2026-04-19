import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DetailPanel } from '@/components/detail-panel'
import { Flashcard } from '@/components/flashcard'
import { FlashcardControls } from '@/components/flashcard-controls'
import type { QuestionDocument } from '@/types/content'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})

const sampleQuestion: QuestionDocument = {
  id: 'ekopod-test-001',
  set: 'A',
  chapter: 'Testovací kapitola',
  subchapter: 'Test',
  title: 'Co je cash flow?',
  order: 1,
  tags: ['test'],
  difficulty: 2,
  summaryId: 'shr-test',
  source: {
    pdfPath: 'ekopod-skripta-sample.pdf',
    pages: [1],
    sections: ['1.1'],
  },
  filePath: '/content/questions/test.md',
  relativePath: 'test.md',
  valid: true,
  validationIssues: [],
  sections: {
    question: 'Vysvětli pojem cash flow.',
    modelAnswer: 'Cash flow sleduje skutečný pohyb peněžních prostředků.',
    detail: 'Důraz na rozdíl proti účetnímu zisku.',
  },
  searchText: 'cash flow',
}

function FlashcardHarness() {
  const [revealed, setRevealed] = useState(false)
  const [ratingCount, setRatingCount] = useState(0)

  return (
    <div>
      <Flashcard
        question={sampleQuestion}
        revealed={revealed}
        animateFlip={false}
        onReveal={() => setRevealed((current) => !current)}
      />
      <FlashcardControls
        canGoBack={false}
        canGoForward
        revealed={revealed}
        onPrevious={() => undefined}
        onNext={() => undefined}
        onReveal={() => setRevealed((current) => !current)}
        onToggleDetail={() => undefined}
      />
      <DetailPanel
        open
        activeTab="detail"
        question={sampleQuestion}
        onClose={() => undefined}
        onTabChange={() => undefined}
        onNavigateToQuestion={() => undefined}
        showRatingPanel
        currentMastery={null}
        onRate={() => setRatingCount((current) => current + 1)}
      />
      <div data-testid="rated-count">{ratingCount}</div>
    </div>
  )
}

describe('Flashcard flow', () => {
  it('umožní odkrytí odpovědi kliknutím na kartu a následné hodnocení', async () => {
    const user = userEvent.setup()

    render(<FlashcardHarness />)

    expect(screen.getAllByText('Co je cash flow?').length).toBeGreaterThan(0)
    expect(
      screen.queryByText('Cash flow sleduje skutečný pohyb peněžních prostředků.'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /otočit kartu na modelovou odpověď/i }))

    expect(
      screen.getAllByText('Cash flow sleduje skutečný pohyb peněžních prostředků.').length,
    ).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /^Umím dobře$/i }))

    expect(screen.getByTestId('rated-count')).toHaveTextContent('1')
  })

  it('umožní překlápět kartu tam i zpět kliknutím na obsah', async () => {
    const user = userEvent.setup()

    render(<FlashcardHarness />)

    await user.click(screen.getByRole('button', { name: /otočit kartu na modelovou odpověď/i }))
    expect(
      screen.getAllByText('Cash flow sleduje skutečný pohyb peněžních prostředků.').length,
    ).toBeGreaterThan(0)

    await user.click(screen.getAllByText('Cash flow sleduje skutečný pohyb peněžních prostředků.')[0])
    expect(screen.getAllByText('Co je cash flow?').length).toBeGreaterThan(0)
  })
})
