/// <reference types="node" />
// @vitest-environment node

import { readdirSync, readFileSync } from 'fs'
import { join, relative } from 'path'

import { describe, expect, it } from 'vitest'

import { parseQuestionFile, parseSummaryFile } from '@/lib/content/parser'

function collectMarkdownFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(root, entry.name)

    if (entry.isDirectory()) {
      return collectMarkdownFiles(fullPath)
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : []
  })
}

describe('content files', () => {
  const projectRoot = process.cwd()
  const contentRoot = join(projectRoot, 'content')
  const questionsRoot = join(contentRoot, 'questions')
  const summariesRoot = join(contentRoot, 'summaries')
  const pdfRoot = join(contentRoot, 'pdf')
  const knownPdfPaths = new Set(
    readdirSync(pdfRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.pdf'))
      .map((entry) => entry.name),
  )

  it('validates all markdown questions shipped with the app', () => {
    const questionFiles = collectMarkdownFiles(questionsRoot)

    expect(questionFiles.length).toBeGreaterThan(0)

    const invalidQuestions = questionFiles
      .map((filePath) => {
        const raw = readFileSync(filePath, 'utf-8')
        const result = parseQuestionFile({
          filePath,
          relativePath: relative(questionsRoot, filePath).replace(/\\/g, '/'),
          raw,
          knownPdfPaths,
        })

        return result.question.valid
          ? null
          : `${result.question.id}: ${result.question.validationIssues.join(' | ')}`
      })
      .filter((value): value is string => Boolean(value))

    expect(invalidQuestions, invalidQuestions.join('\n')).toEqual([])
  })

  it('validates all markdown summaries shipped with the app', () => {
    const summaryFiles = collectMarkdownFiles(summariesRoot)

    expect(summaryFiles.length).toBeGreaterThan(0)

    const invalidSummaries = summaryFiles
      .map((filePath) => {
        const raw = readFileSync(filePath, 'utf-8')
        const result = parseSummaryFile({
          filePath,
          relativePath: relative(summariesRoot, filePath).replace(/\\/g, '/'),
          raw,
        })

        return result.summary.valid
          ? null
          : `${result.summary.id}: ${result.summary.validationIssues.join(' | ')}`
      })
      .filter((value): value is string => Boolean(value))

    expect(invalidSummaries, invalidSummaries.join('\n')).toEqual([])
  })
})
