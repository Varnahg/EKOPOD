import type { ContentIndex } from '@/types/content'
import type { ProgressEntry } from '@/types/state'
import { getProgressEntry } from '@/lib/content/query'

export function calculateStats(
  content: ContentIndex,
  progress: Record<string, ProgressEntry>,
) {
  const total = content.validQuestions.length
  const mastered = content.validQuestions.filter((question) => (getProgressEntry(progress, question.id).mastery ?? -1) >= 3).length
  const weak = content.validQuestions.filter((question) => {
    const mastery = getProgressEntry(progress, question.id).mastery
    return mastery === 0 || mastery === 1 || mastery === null
  }).length

  const perSet = groupProgress(content, progress, 'set')
  const perChapter = groupProgress(content, progress, 'chapter')
  const latestActivity = content.validQuestions
    .map((question) => getProgressEntry(progress, question.id).lastStudiedAt)
    .filter(Boolean)
    .sort()
    .at(-1)

  return {
    total,
    mastered,
    weak,
    latestActivity,
    perSet,
    perChapter,
  }
}

function groupProgress(
  content: ContentIndex,
  progress: Record<string, ProgressEntry>,
  groupBy: 'set' | 'chapter',
) {
  const groups = new Map<
    string,
    {
      label: string
      total: number
      mastered: number
      weak: number
      percent: number
    }
  >()

  content.validQuestions.forEach((question) => {
    const label = groupBy === 'set' ? question.set : question.chapter
    const current = groups.get(label) ?? {
      label,
      total: 0,
      mastered: 0,
      weak: 0,
      percent: 0,
    }
    const mastery = getProgressEntry(progress, question.id).mastery

    current.total += 1
    if ((mastery ?? -1) >= 3) {
      current.mastered += 1
    }
    if (mastery === null || mastery <= 1) {
      current.weak += 1
    }

    groups.set(label, current)
  })

  return [...groups.values()].map((entry) => ({
    ...entry,
    percent: entry.total ? Math.round((entry.mastered / entry.total) * 100) : 0,
  }))
}
