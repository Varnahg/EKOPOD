import { describe, expect, it } from 'vitest'

import { filterQuestions } from '@/lib/content/query'
import { DEFAULT_FILTERS } from '@/lib/progress'
import type { QuestionDocument } from '@/types/content'
import type { ProgressEntry } from '@/types/state'

function createQuestion(id: string, title: string): QuestionDocument {
  return {
    id,
    set: 'A',
    chapter: '1. Testovaci kapitola',
    subchapter: '1.1 Test',
    title,
    order: Number(id.split('-').at(-1) ?? 1),
    tags: ['test'],
    difficulty: 1,
    summaryId: `${id}-summary`,
    source: {
      pdfPath: 'pdf/ekopod-skripta-2024.pdf',
      pages: [1],
      sections: ['1.1'],
    },
    filePath: `/content/questions/${id}.md`,
    relativePath: `${id}.md`,
    valid: true,
    validationIssues: [],
    sections: {
      question: `${title}?`,
      modelAnswer: `${title} - modelova odpoved.`,
    },
    searchText: title.toLowerCase(),
  }
}

function createProgressEntry(rating: 0 | 1 | 2 | 3): ProgressEntry {
  return {
    mastery: rating,
    favorite: false,
    history: [
      {
        rating,
        timestamp: '2026-04-19T12:00:00.000Z',
        sessionId: 'test-session',
      },
    ],
    seenCount: 1,
    lastStudiedAt: '2026-04-19T12:00:00.000Z',
  }
}

describe('filterQuestions', () => {
  it('umi filtrovat otazky podle vice vybranych hodnoceni', () => {
    const questions = [
      createQuestion('ekopod-a-001', 'Otazka nula'),
      createQuestion('ekopod-a-002', 'Otazka dve'),
      createQuestion('ekopod-a-003', 'Otazka bez hodnoceni'),
    ]

    const progress = {
      'ekopod-a-001': createProgressEntry(0),
      'ekopod-a-002': createProgressEntry(2),
      'ekopod-a-003': {
        mastery: null,
        favorite: false,
        history: [],
        seenCount: 0,
      },
    } satisfies Record<string, ProgressEntry>

    const filtered = filterQuestions(
      questions,
      {
        ...DEFAULT_FILTERS,
        masteryLevels: [0, 2],
      },
      progress,
    )

    expect(filtered.map((question) => question.id)).toEqual(['ekopod-a-001', 'ekopod-a-002'])
  })
})
