import { z } from 'zod'

import { DETAIL_TAB_KEYS, type MasteryLevel } from '@/types/content'
import type { ProgressEntry, QuestionFiltersState, SettingsState, StoredProgressState } from '@/types/state'

export const STORAGE_KEY = 'ekopod-progress-v1'
export const STORAGE_VERSION = 1

const masterySchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])

const progressEntrySchema = z.object({
  mastery: masterySchema.nullable(),
  favorite: z.boolean(),
  history: z.array(
    z.object({
      rating: masterySchema,
      timestamp: z.string(),
      sessionId: z.string(),
    }),
  ),
  seenCount: z.number().int().nonnegative(),
  lastStudiedAt: z.string().optional(),
})

const settingsSchema = z.object({
  flipAnimation: z.boolean(),
  keyboardShortcuts: z.boolean(),
  examTimerEnabled: z.boolean(),
  examTimerSeconds: z.number().int().positive(),
  defaultSort: z.enum(['content', 'weakest', 'recent', 'random']),
  density: z.enum(['comfortable', 'compact']),
  fontScale: z.enum(['normal', 'large', 'xlarge']),
  reducedMotion: z.boolean(),
})

const sessionSchema = z.object({
  id: z.string(),
  mode: z.enum(['flashcards', 'mistakes', 'exam']),
  sourceLabel: z.string(),
  allQuestionIds: z.array(z.string()).optional(),
  requestedCount: z.number().int().positive().optional(),
  questionIds: z.array(z.string()),
  currentIndex: z.number().int().nonnegative(),
  revealed: z.boolean(),
  startedAt: z.string(),
  completedAt: z.string().nullable().optional(),
  repeatUntilMastered: z.boolean(),
  repeatThreshold: masterySchema,
  timerEnabled: z.boolean(),
  timerSeconds: z.number().int().nonnegative(),
  round: z.number().int().positive(),
  ratings: z.record(z.string(), z.array(masterySchema)),
})

const storedStateSchema = z.object({
  version: z.number().int(),
  progress: z.record(z.string(), progressEntrySchema),
  settings: settingsSchema,
  activeSession: sessionSchema.nullable(),
  selectedQuestionId: z.string().nullable(),
  detailTab: z.enum(DETAIL_TAB_KEYS),
  detailOpen: z.boolean(),
})

export const DEFAULT_SETTINGS: SettingsState = {
  flipAnimation: true,
  keyboardShortcuts: true,
  examTimerEnabled: true,
  examTimerSeconds: 120,
  defaultSort: 'content',
  density: 'comfortable',
  fontScale: 'normal',
  reducedMotion: false,
}

export const DEFAULT_FILTERS: QuestionFiltersState = {
  sets: [],
  chapters: [],
  subchapters: [],
  tags: [],
  difficulties: [],
  masteryLevels: [],
  favoritesOnly: false,
  newOnly: false,
  mistakesOnly: false,
  showInvalid: true,
  lastResult: 'all',
  search: '',
}

export function createEmptyProgressEntry(): ProgressEntry {
  return {
    mastery: null,
    favorite: false,
    history: [],
    seenCount: 0,
  }
}

export function createDefaultStoredState(): StoredProgressState {
  return {
    version: STORAGE_VERSION,
    progress: {},
    settings: { ...DEFAULT_SETTINGS },
    activeSession: null,
    selectedQuestionId: null,
    detailTab: 'modelAnswer',
    detailOpen: false,
  }
}

function normalizeSessionState(session: z.infer<typeof sessionSchema> | null): StoredProgressState['activeSession'] {
  if (!session) {
    return null
  }

  const allQuestionIds = session.allQuestionIds?.length ? session.allQuestionIds : session.questionIds

  return {
    ...session,
    allQuestionIds,
    requestedCount: session.requestedCount ?? allQuestionIds.length,
  }
}

export function readPersistedState() {
  const fallback = createDefaultStoredState()

  if (typeof window === 'undefined') {
    return { state: fallback, error: null as string | null }
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { state: fallback, error: null as string | null }
  }

  try {
    const parsed = JSON.parse(raw)
    const result = storedStateSchema.safeParse(parsed)

    if (!result.success) {
      window.localStorage.removeItem(STORAGE_KEY)
      return {
        state: fallback,
        error: 'Lokální postup byl poškozený a aplikace ho obnovila do výchozího stavu.',
      }
    }

    return {
      state: {
        ...fallback,
        ...result.data,
        activeSession: normalizeSessionState(result.data.activeSession),
        version: STORAGE_VERSION,
      },
      error: null as string | null,
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return {
      state: fallback,
      error: 'Nepodařilo se načíst lokální postup. Data byla resetována.',
    }
  }
}

export function writePersistedState(state: StoredProgressState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function serializeProgressSnapshot(state: StoredProgressState) {
  return JSON.stringify(state, null, 2)
}

export function parseImportedSnapshot(raw: string) {
  const parsed = JSON.parse(raw)
  const result = storedStateSchema.safeParse(parsed)

  if (!result.success) {
    throw new Error('Importovaný JSON nemá očekávaný formát progress snapshotu.')
  }

  return {
    ...result.data,
    activeSession: normalizeSessionState(result.data.activeSession),
    version: STORAGE_VERSION,
  } satisfies StoredProgressState
}

export function masteryFromHistory(entry: ProgressEntry): MasteryLevel | null {
  return entry.history.at(-1)?.rating ?? entry.mastery
}
