import type { DetailTabKey, MasteryLevel } from '@/types/content'

export type AppMode =
  | 'flashcards'
  | 'mistakes'
  | 'exam'
  | 'pdf'
  | 'summaries'
  | 'stats'
  | 'settings'

export type QuestionSortMode = 'content' | 'weakest' | 'recent' | 'random'

export interface QuestionFiltersState {
  sets: string[]
  chapters: string[]
  subchapters: string[]
  tags: string[]
  difficulties: number[]
  masteryLevels: MasteryLevel[]
  favoritesOnly: boolean
  newOnly: boolean
  mistakesOnly: boolean
  showInvalid: boolean
  lastResult: MasteryLevel | 'all'
  search: string
}

export interface SettingsState {
  flipAnimation: boolean
  keyboardShortcuts: boolean
  examTimerEnabled: boolean
  examTimerSeconds: number
  defaultSort: QuestionSortMode
  density: 'comfortable' | 'compact'
  fontScale: 'normal' | 'large' | 'xlarge'
  reducedMotion: boolean
}

export interface ProgressEntry {
  mastery: MasteryLevel | null
  favorite: boolean
  history: Array<{
    rating: MasteryLevel
    timestamp: string
    sessionId: string
  }>
  seenCount: number
  lastStudiedAt?: string
}

export interface SessionState {
  id: string
  mode: Extract<AppMode, 'flashcards' | 'mistakes' | 'exam'>
  sourceLabel: string
  allQuestionIds: string[]
  requestedCount: number
  questionIds: string[]
  currentIndex: number
  revealed: boolean
  startedAt: string
  completedAt?: string | null
  repeatUntilMastered: boolean
  repeatThreshold: MasteryLevel
  timerEnabled: boolean
  timerSeconds: number
  round: number
  ratings: Record<string, MasteryLevel[]>
}

export interface StoredProgressState {
  version: number
  progress: Record<string, ProgressEntry>
  settings: SettingsState
  activeSession: SessionState | null
  selectedQuestionId: string | null
  detailTab: DetailTabKey
  detailOpen: boolean
}
