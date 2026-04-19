import { describe, expect, it } from 'vitest'

import { parseQuestionFile, parseSummaryFile } from '@/lib/content/parser'

describe('parseQuestionFile', () => {
  it('načte validní otázku se sekcemi a metadaty', () => {
    const raw = `---
id: ekopod-test-001
set: A
chapter: Testovací kapitola
title: Testovací otázka
order: 1
tags:
  - test
  - parser
difficulty: 2
sourcePdfPath: pdf/ekopod-skripta-sample.pdf
sourcePages:
  - 1
summaryId: shr-test
---
## Otázka
Co je parser?

## Modelová odpověď
Parser převede strukturovaný text do datového modelu.

## Detail
Rozparsování frontmatteru a sekcí.
`

    const result = parseQuestionFile({
      filePath: '/content/questions/test.md',
      relativePath: 'test.md',
      raw,
      knownPdfPaths: new Set(['ekopod-skripta-sample.pdf']),
    })

    expect(result.question.valid).toBe(true)
    expect(result.question.id).toBe('ekopod-test-001')
    expect(result.question.sections.question).toContain('Co je parser')
    expect(result.question.sections.modelAnswer).toContain('Parser převede')
    expect(result.warnings).toHaveLength(0)
  })

  it('označí otázku jako nevalidní při chybějících polích a sekcích', () => {
    const raw = `---
id: broken-question
chapter: Testovací kapitola
title: Rozbitá otázka
order: 4
tags:
  - test
difficulty: 2
---
## Otázka
Jen otázka bez odpovědi.
`

    const result = parseQuestionFile({
      filePath: '/content/questions/broken.md',
      relativePath: 'broken.md',
      raw,
      knownPdfPaths: new Set(),
    })

    expect(result.question.valid).toBe(false)
    expect(result.question.validationIssues.join(' ')).toContain('set:')
    expect(result.question.validationIssues.join(' ')).toContain('sourcePdfPath:')
    expect(result.question.validationIssues.join(' ')).toContain('Chybí sekce `## Modelová odpověď`')
    expect(result.warnings).toHaveLength(1)
  })
})

describe('parseSummaryFile', () => {
  it('načte validní souhrn a headings pro obsah', () => {
    const raw = `---
id: shr-test
title: Test summary
chapter: Test
order: 10
tags:
  - summary
relatedQuestionIds:
  - ekopod-test-001
---
# Hlavní nadpis

## Podkapitola
Obsah.
`

    const result = parseSummaryFile({
      filePath: '/content/summaries/test.md',
      relativePath: 'test.md',
      raw,
    })

    expect(result.summary.valid).toBe(true)
    expect(result.summary.headings.map((heading) => heading.title)).toEqual([
      'Hlavní nadpis',
      'Podkapitola',
    ])
  })
})
