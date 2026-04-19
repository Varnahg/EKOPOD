import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import { buildRepeatQueue, getCurrentQuestionId, shouldRepeatSession } from '@/lib/content/session'
import {
  DEFAULT_FILTERS,
  createDefaultStoredState,
  createEmptyProgressEntry,
  readPersistedState,
  writePersistedState,
} from '@/lib/progress'
import type { QuestionDocument, MasteryLevel } from '@/types/content'
import type {
  ProgressEntry,
  QuestionFiltersState,
  SettingsState,
  StoredProgressState,
  SessionState,
} from '@/types/state'

interface AppStore extends StoredProgressState {
  filters: QuestionFiltersState
  storageIssue: string | null
  setFilters: (patch: Partial<QuestionFiltersState>) => void
  resetFilters: () => void
  applySettings: (patch: Partial<SettingsState>) => void
  restoreDefaultSettings: () => void
  dismissStorageIssue: () => void
  selectQuestion: (questionId: string | null) => void
  toggleFavorite: (questionId: string) => void
  setDetailTab: (tab: StoredProgressState['detailTab']) => void
  setDetailOpen: (open: boolean) => void
  toggleDetailOpen: () => void
  revealAnswer: () => void
  hideAnswer: () => void
  startSession: (session: SessionState) => void
  clearSession: () => void
  moveSessionNext: () => void
  moveSessionPrevious: () => void
  rateCurrentQuestion: (rating: MasteryLevel, questionPool: QuestionDocument[]) => void
  importSnapshot: (snapshot: StoredProgressState) => void
  resetProgress: () => void
}

const hydrated = readPersistedState()

const selectPersistedState = (state: AppStore): StoredProgressState => ({
  version: state.version,
  progress: state.progress,
  settings: state.settings,
  activeSession: state.activeSession,
  selectedQuestionId: state.selectedQuestionId,
  detailTab: state.detailTab,
  detailOpen: state.detailOpen,
})

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set) => ({
    ...hydrated.state,
    filters: { ...DEFAULT_FILTERS },
    storageIssue: hydrated.error,
    setFilters: (patch) =>
      set((state) => ({
        filters: {
          ...state.filters,
          ...patch,
        },
      })),
    resetFilters: () =>
      set({
        filters: { ...DEFAULT_FILTERS },
      }),
    applySettings: (patch) =>
      set((state) => ({
        settings: {
          ...state.settings,
          ...patch,
        },
      })),
    restoreDefaultSettings: () =>
      set((state) => ({
        settings: {
          ...createDefaultStoredState().settings,
        },
        detailOpen: state.detailOpen,
      })),
    dismissStorageIssue: () => set({ storageIssue: null }),
    selectQuestion: (questionId) =>
      set({
        selectedQuestionId: questionId,
      }),
    toggleFavorite: (questionId) =>
      set((state) => {
        const current = state.progress[questionId] ?? createEmptyProgressEntry()
        return {
          progress: {
            ...state.progress,
            [questionId]: {
              ...current,
              favorite: !current.favorite,
            },
          },
        }
      }),
    setDetailTab: (tab) => set({ detailTab: tab }),
    setDetailOpen: (open) => set({ detailOpen: open }),
    toggleDetailOpen: () => set((state) => ({ detailOpen: !state.detailOpen })),
    revealAnswer: () =>
      set((state) => ({
        activeSession: state.activeSession
          ? {
              ...state.activeSession,
              revealed: true,
            }
          : state.activeSession,
      })),
    hideAnswer: () =>
      set((state) => ({
        activeSession: state.activeSession
          ? {
              ...state.activeSession,
              revealed: false,
            }
          : state.activeSession,
      })),
    startSession: (session) =>
      set({
        activeSession: session,
        selectedQuestionId: session.questionIds[0] ?? null,
        detailOpen: false,
      }),
    clearSession: () =>
      set((state) => ({
        activeSession: null,
        selectedQuestionId: state.selectedQuestionId,
      })),
    moveSessionNext: () =>
      set((state) => {
        if (!state.activeSession) {
          return state
        }

        const nextIndex = Math.min(state.activeSession.currentIndex + 1, state.activeSession.questionIds.length - 1)
        const nextQuestionId = state.activeSession.questionIds[nextIndex] ?? state.selectedQuestionId

        return {
          activeSession: {
            ...state.activeSession,
            currentIndex: nextIndex,
            revealed: false,
          },
          selectedQuestionId: nextQuestionId ?? null,
        }
      }),
    moveSessionPrevious: () =>
      set((state) => {
        if (!state.activeSession) {
          return state
        }

        const previousIndex = Math.max(state.activeSession.currentIndex - 1, 0)
        const previousQuestionId = state.activeSession.questionIds[previousIndex] ?? state.selectedQuestionId

        return {
          activeSession: {
            ...state.activeSession,
            currentIndex: previousIndex,
            revealed: false,
          },
          selectedQuestionId: previousQuestionId ?? null,
        }
      }),
    rateCurrentQuestion: (rating, questionPool) =>
      set((state) => {
        const session = state.activeSession
        const questionId = getCurrentQuestionId(session) ?? state.selectedQuestionId

        if (!questionId) {
          return state
        }

        const timestamp = new Date().toISOString()
        const current = state.progress[questionId] ?? createEmptyProgressEntry()
        const nextProgressEntry: ProgressEntry = {
          ...current,
          mastery: rating,
          seenCount: current.seenCount + 1,
          lastStudiedAt: timestamp,
          history: [
            ...current.history,
            {
              rating,
              timestamp,
              sessionId: session?.id ?? 'manual',
            },
          ].slice(-60),
        }

        const nextProgress = {
          ...state.progress,
          [questionId]: nextProgressEntry,
        }

        if (!session) {
          return {
            progress: nextProgress,
            selectedQuestionId: questionId,
          }
        }

        const nextRatings = {
          ...session.ratings,
          [questionId]: [...(session.ratings[questionId] ?? []), rating],
        }
        const uniqueQuestionIds = [...new Set(session.questionIds)]
        const atLastQuestion = session.currentIndex >= session.questionIds.length - 1

        if (atLastQuestion) {
          if (shouldRepeatSession({ ...session, ratings: nextRatings }, nextProgress, uniqueQuestionIds)) {
            const repeatQueue = buildRepeatQueue(
              { ...session, ratings: nextRatings },
              nextProgress,
              questionPool.filter((question) => uniqueQuestionIds.includes(question.id)),
            )

            if (repeatQueue.length) {
              return {
                progress: nextProgress,
                activeSession: {
                  ...session,
                  ratings: nextRatings,
                  questionIds: repeatQueue,
                  currentIndex: 0,
                  revealed: false,
                  round: session.round + 1,
                },
                selectedQuestionId: repeatQueue[0] ?? questionId,
              }
            }
          }

          return {
            progress: nextProgress,
            activeSession: {
              ...session,
              ratings: nextRatings,
              completedAt: timestamp,
              revealed: true,
            },
            selectedQuestionId: questionId,
          }
        }

        const nextIndex = session.currentIndex + 1
        const nextQuestionId = session.questionIds[nextIndex] ?? questionId

        return {
          progress: nextProgress,
          activeSession: {
            ...session,
            ratings: nextRatings,
            currentIndex: nextIndex,
            revealed: false,
          },
          selectedQuestionId: nextQuestionId,
        }
      }),
    importSnapshot: (snapshot) =>
      set({
        ...snapshot,
        filters: { ...DEFAULT_FILTERS },
        storageIssue: null,
      }),
    resetProgress: () =>
      set((state) => ({
        ...createDefaultStoredState(),
        settings: state.settings,
        filters: { ...DEFAULT_FILTERS },
      })),
  })),
)

let persistenceInitialized = false

export function initializeAppStorePersistence() {
  if (persistenceInitialized) {
    return
  }

  persistenceInitialized = true
  useAppStore.subscribe(selectPersistedState, (persistedState) => {
    writePersistedState(persistedState)
  })
}
