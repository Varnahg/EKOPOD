import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Flashcard } from '@/components/flashcard'
import { FlashcardControls } from '@/components/flashcard-controls'
import type { QuestionDocument } from '@/types/content'

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
        onReveal={() => setRevealed(true)}
      />
      <FlashcardControls
        canGoBack={false}
        canGoForward
        revealed={revealed}
        isFavorite={false}
        onPrevious={() => undefined}
        onNext={() => undefined}
        onReveal={() => setRevealed(true)}
        onToggleDetail={() => undefined}
        onToggleFavorite={() => undefined}
        onRate={() => setRatingCount((current) => current + 1)}
      />
      <div data-testid="rated-count">{ratingCount}</div>
    </div>
  )
}

describe('Flashcard flow', () => {
  it('umožní odkrytí odpovědi a hodnocení zvládnutí', async () => {
    const user = userEvent.setup()

    render(<FlashcardHarness />)

    expect(screen.getByText('Vysvětli pojem cash flow.')).toBeInTheDocument()
    expect(
      screen.queryByText('Cash flow sleduje skutečný pohyb peněžních prostředků.'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /odkrýt modelovou odpověď/i }))

    expect(
      screen.getByText('Cash flow sleduje skutečný pohyb peněžních prostředků.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /umím dobře/i }))

    expect(screen.getByTestId('rated-count')).toHaveTextContent('1')
  })
})
