import type { QuestionDocument, SummaryDocument } from '@/types/content'
import type { ProgressEntry, QuestionFiltersState, QuestionSortMode } from '@/types/state'
import { shuffle } from '@/lib/utils'

export function getProgressEntry(progress: Record<string, ProgressEntry>, questionId: string): ProgressEntry {
  return (
    progress[questionId] ?? {
      mastery: null,
      favorite: false,
      history: [],
      seenCount: 0,
    }
  )
}

export function getLastRating(entry: ProgressEntry) {
  return entry.history.at(-1)?.rating ?? null
}

export function filterQuestions(
  questions: QuestionDocument[],
  filters: QuestionFiltersState,
  progress: Record<string, ProgressEntry>,
) {
  const search = filters.search.trim().toLowerCase()

  return questions.filter((question) => {
    const progressEntry = getProgressEntry(progress, question.id)
    const lastRating = getLastRating(progressEntry)

    if (!filters.showInvalid && !question.valid) {
      return false
    }

    if (filters.sets.length && !filters.sets.includes(question.set)) {
      return false
    }

    if (filters.chapters.length && !filters.chapters.includes(question.chapter)) {
      return false
    }

    if (filters.subchapters.length && !filters.subchapters.includes(question.subchapter ?? '')) {
      return false
    }

    if (filters.tags.length && !filters.tags.every((tag) => question.tags.includes(tag))) {
      return false
    }

    if (filters.difficulties.length && !filters.difficulties.includes(question.difficulty)) {
      return false
    }

    if (
      filters.masteryLevels.length &&
      !(progressEntry.mastery !== null && filters.masteryLevels.includes(progressEntry.mastery))
    ) {
      return false
    }

    if (filters.favoritesOnly && !progressEntry.favorite) {
      return false
    }

    if (filters.newOnly && progressEntry.history.length > 0) {
      return false
    }

    if (filters.mistakesOnly && ![0, 1].includes(progressEntry.mastery ?? 0)) {
      return false
    }

    if (filters.lastResult !== 'all' && lastRating !== filters.lastResult) {
      return false
    }

    if (search && !question.searchText.toLowerCase().includes(search)) {
      return false
    }

    return true
  })
}

export function sortQuestions(
  questions: QuestionDocument[],
  sortMode: QuestionSortMode,
  progress: Record<string, ProgressEntry>,
) {
  const sorted = [...questions]

  if (sortMode === 'random') {
    return shuffle(sorted)
  }

  if (sortMode === 'weakest') {
    return sorted.sort((left, right) => {
      const leftEntry = getProgressEntry(progress, left.id)
      const rightEntry = getProgressEntry(progress, right.id)
      const leftMastery = leftEntry.mastery ?? -1
      const rightMastery = rightEntry.mastery ?? -1

      if (leftMastery !== rightMastery) {
        return leftMastery - rightMastery
      }

      return left.order - right.order
    })
  }

  if (sortMode === 'recent') {
    return sorted.sort((left, right) => {
      const leftDate = getProgressEntry(progress, left.id).lastStudiedAt ?? ''
      const rightDate = getProgressEntry(progress, right.id).lastStudiedAt ?? ''
      return rightDate.localeCompare(leftDate)
    })
  }

  return sorted.sort((left, right) => {
    if (left.set !== right.set) {
      return left.set.localeCompare(right.set, 'cs')
    }

    if (left.chapter !== right.chapter) {
      return left.chapter.localeCompare(right.chapter, 'cs')
    }

    return left.order - right.order
  })
}

export function findSummaryForQuestion(questionId: string, summaries: SummaryDocument[]) {
  return summaries.find((summary) => summary.relatedQuestionIds.includes(questionId))
}
