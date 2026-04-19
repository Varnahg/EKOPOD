import { clsx } from 'clsx'
import GithubSlugger from 'github-slugger'

const slugger = new GithubSlugger()
const csNaturalCollator = new Intl.Collator('cs', {
  numeric: true,
  sensitivity: 'base',
})

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values)
}

export function slugify(value: string) {
  slugger.reset()
  return slugger.slug(value)
}

export function slugifySequence(values: string[]) {
  slugger.reset()
  return values.map((value) => slugger.slug(value))
}

export function normalizeLabel(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function formatDateTime(value?: string) {
  if (!value) {
    return 'zatím bez aktivity'
  }

  const date = new Date(value)
  return new Intl.DateTimeFormat('cs-CZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function unique<T>(items: T[]) {
  return [...new Set(items)]
}

export function sortText(values: string[]) {
  return [...values].sort(compareNaturalText)
}

export function compareNaturalText(left: string, right: string) {
  return csNaturalCollator.compare(left, right)
}

export function shuffle<T>(values: T[]) {
  const copy = [...values]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }
  return copy
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`
}

export function toNumberArray(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined
  }

  const numericValues = value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item))

  return numericValues.length ? numericValues : undefined
}

export function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined
  }

  const stringValues = value
    .map((item) => String(item).trim())
    .filter(Boolean)

  return stringValues.length ? stringValues : undefined
}
