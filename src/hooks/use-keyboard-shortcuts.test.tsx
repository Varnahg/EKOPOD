import { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { Flashcard } from '@/components/flashcard'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import type { MasteryLevel, QuestionDocument } from '@/types/content'

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

afterEach(() => {
  cleanup()
})

const sampleQuestion: QuestionDocument = {
  id: 'ekopod-shortcuts-001',
  set: 'A',
  chapter: 'Testovací kapitola',
  subchapter: 'Test',
  title: 'Co je cash flow?',
  order: 1,
  tags: ['test'],
  difficulty: 1,
  summaryId: 'shr-test',
  source: {
    pdfPath: 'pdf/ekopod-skripta-2024.pdf',
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

function ShortcutHarness() {
  const [revealed, setRevealed] = useState(false)
  const [previousCount, setPreviousCount] = useState(0)
  const [nextCount, setNextCount] = useState(0)
  const [ratings, setRatings] = useState<MasteryLevel[]>([])

  useKeyboardShortcuts(true, {
    onReveal: () => setRevealed((current) => !current),
    onPrevious: () => setPreviousCount((current) => current + 1),
    onNext: () => setNextCount((current) => current + 1),
    onRate: (rating) => setRatings((current) => [...current, rating]),
  })

  return (
    <div>
      <Flashcard
        question={sampleQuestion}
        revealed={revealed}
        animateFlip={false}
        onReveal={() => setRevealed((current) => !current)}
      />
      <output data-testid="previous-count">{previousCount}</output>
      <output data-testid="next-count">{nextCount}</output>
      <output data-testid="ratings">{ratings.join(',')}</output>
    </div>
  )
}

describe('useKeyboardShortcuts', () => {
  it('otočí fokusovanou kartu Enterem jen jednou', async () => {
    const user = userEvent.setup()

    render(<ShortcutHarness />)

    const card = screen.getByRole('button', { name: /otočit kartu na modelovou odpověď/i })
    card.focus()

    await user.keyboard('{Enter}')

    expect(
      screen.getByText('Cash flow sleduje skutečný pohyb peněžních prostředků.'),
    ).toBeInTheDocument()
  })

  it('mapuje šipky a čísla 0 až 3 na průchod a hodnocení', async () => {
    const user = userEvent.setup()

    render(<ShortcutHarness />)

    await user.keyboard('{ArrowRight}{ArrowLeft}0123')

    expect(screen.getByTestId('next-count')).toHaveTextContent('1')
    expect(screen.getByTestId('previous-count')).toHaveTextContent('1')
    expect(screen.getByTestId('ratings')).toHaveTextContent('0,1,2,3')
  })
})
