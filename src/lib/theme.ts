import type { DetailTabKey, MasteryLevel } from '@/types/content'

export const DETAIL_TAB_LABELS: Record<DetailTabKey, string> = {
  modelAnswer: 'Modelová odpověď',
  outline: 'Osnova odpovědi',
  detail: 'Detail',
  pitfalls: 'Chytáky',
  examples: 'Příklady / situace',
  scripts: 'Ve skriptech',
  summary: 'AI souhrn',
}

export const RATING_META: Record<
  MasteryLevel,
  {
    label: string
    shortLabel: string
    description: string
    badgeClassName: string
  }
> = {
  0: {
    label: 'Neumím vůbec',
    shortLabel: '0',
    description: 'Vrátit co nejdřív',
    badgeClassName: 'bg-error/18 text-error border-error/40',
  },
  1: {
    label: 'Vím něco, ale slabé',
    shortLabel: '1',
    description: 'Brzy zopakovat',
    badgeClassName: 'bg-warning/18 text-warning border-warning/40',
  },
  2: {
    label: 'Skoro umím',
    shortLabel: '2',
    description: 'Ještě jeden průchod',
    badgeClassName: 'bg-accent/18 text-accent border-accent/40',
  },
  3: {
    label: 'Umím dobře',
    shortLabel: '3',
    description: 'Může počkat',
    badgeClassName: 'bg-success/18 text-success border-success/40',
  },
}

export const NAV_ITEMS = [
  { to: '/', label: 'Potítko', mode: 'flashcards' },
  { to: '/chyby', label: 'Trénink chyb', mode: 'mistakes' },
  { to: '/zkouska', label: 'Simulace', mode: 'exam' },
  { to: '/skripta', label: 'Skripta PDF', mode: 'pdf' },
  { to: '/souhrny', label: 'AI souhrny', mode: 'summaries' },
  { to: '/statistiky', label: 'Statistiky', mode: 'stats' },
  { to: '/nastaveni', label: 'Nastavení', mode: 'settings' },
] as const
