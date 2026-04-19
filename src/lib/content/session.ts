import type { MasteryLevel, QuestionDocument } from '@/types/content'
import type { ProgressEntry, QuestionSortMode, SessionState } from '@/types/state'
import { createId, shuffle } from '@/lib/utils'
import { getProgressEntry, getLastRating, sortQuestions } from '@/lib/content/query'

export function buildSessionQuestionIds(
  questions: QuestionDocument[],
  progress: Record<string, ProgressEntry>,
  sortMode: QuestionSortMode,
  mode: SessionState['mode'],
) {
  if (mode === 'exam') {
    return shuffle(questions.map((question) => question.id))
  }

  if (mode === 'mistakes') {
    return [...questions]
      .sort((left, right) => {
        const leftMastery = getProgressEntry(progress, left.id).mastery ?? -1
        const rightMastery = getProgressEntry(progress, right.id).mastery ?? -1

        if (leftMastery !== rightMastery) {
          return leftMastery - rightMastery
        }

        return left.order - right.order
      })
      .map((question) => question.id)
  }

  return sortQuestions(questions, sortMode, progress).map((question) => question.id)
}

export function createSession(input: {
  mode: SessionState['mode']
  sourceLabel: string
  questionIds: string[]
  repeatUntilMastered: boolean
  repeatThreshold: MasteryLevel
  timerEnabled: boolean
  timerSeconds: number
}) {
  return {
    id: createId(input.mode),
    mode: input.mode,
    sourceLabel: input.sourceLabel,
    allQuestionIds: [...new Set(input.questionIds)],
    requestedCount: input.questionIds.length,
    questionIds: input.questionIds,
    currentIndex: 0,
    revealed: false,
    startedAt: new Date().toISOString(),
    completedAt: null,
    repeatUntilMastered: input.repeatUntilMastered,
    repeatThreshold: input.repeatThreshold,
    timerEnabled: input.timerEnabled,
    timerSeconds: input.timerSeconds,
    round: 1,
    ratings: {},
  } satisfies SessionState
}

export function getCurrentQuestionId(session: SessionState | null) {
  if (!session) {
    return null
  }

  return session.questionIds[session.currentIndex] ?? null
}

export function shouldRepeatSession(
  session: SessionState,
  progress: Record<string, ProgressEntry>,
  uniqueQuestionIds: string[],
) {
  if (!session.repeatUntilMastered) {
    return false
  }

  return uniqueQuestionIds.some((questionId) => {
    const mastery = getProgressEntry(progress, questionId).mastery ?? 0
    return mastery < session.repeatThreshold
  })
}

export function buildRepeatQueue(
  session: SessionState,
  progress: Record<string, ProgressEntry>,
  questions: QuestionDocument[],
) {
  return questions
    .filter((question) => {
      const mastery = getProgressEntry(progress, question.id).mastery ?? 0
      return mastery < session.repeatThreshold
    })
    .sort((left, right) => {
      const leftEntry = getProgressEntry(progress, left.id)
      const rightEntry = getProgressEntry(progress, right.id)
      const leftMastery = leftEntry.mastery ?? 0
      const rightMastery = rightEntry.mastery ?? 0

      if (leftMastery !== rightMastery) {
        return leftMastery - rightMastery
      }

      const leftLast = getLastRating(leftEntry) ?? 0
      const rightLast = getLastRating(rightEntry) ?? 0

      return leftLast - rightLast
    })
    .map((question) => question.id)
}
