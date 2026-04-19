import {
  BookOpenText,
  Brain,
  FileStack,
  FolderSearch2,
  Gauge,
  ScrollText,
  Settings2,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { NAV_ITEMS } from '@/lib/theme'
import type { ContentIndex } from '@/types/content'
import type { SessionState } from '@/types/state'
import { cn } from '@/lib/utils'

const ICONS = {
  flashcards: Brain,
  mistakes: FolderSearch2,
  exam: Gauge,
  pdf: FileStack,
  summaries: ScrollText,
  stats: BookOpenText,
  settings: Settings2,
}

interface SidebarNavigationProps {
  content: ContentIndex
  activeSession: SessionState | null
}

export function SidebarNavigation({ content, activeSession }: SidebarNavigationProps) {
  return (
    <>
      <aside className="hidden h-screen overflow-y-auto border-r border-border/60 bg-surface/70 px-4 py-5 lg:sticky lg:top-0 lg:block">
        <div className="rounded-[1.5rem] border border-border/70 bg-background/55 p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">EKOPOD</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Lokální studijní rozhraní pro otázky, simulaci a skripta.
          </p>
        </div>

        <nav className="mt-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.mode]
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'border-accent/50 bg-accent/14 text-text-primary shadow-card'
                      : 'border-border/60 bg-background/20 text-text-secondary hover:border-accent/30 hover:text-text-primary',
                  )
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <section className="mt-4 rounded-[1.5rem] border border-border/70 bg-background/45 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">Obsah</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-2xl border border-border/60 bg-surface/70 p-3">
              <div className="font-serif text-xl text-text-primary">{content.health.totalQuestions}</div>
              <div className="mt-1 text-text-secondary">otázek</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface/70 p-3">
              <div className="font-serif text-xl text-text-primary">{content.health.totalSummaries}</div>
              <div className="mt-1 text-text-secondary">souhrnů</div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[1.5rem] border border-border/70 bg-background/45 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">Sezení</p>
          {activeSession ? (
            <div className="mt-3 space-y-1.5 text-sm text-text-secondary">
              <p className="font-medium text-text-primary">{activeSession.sourceLabel}</p>
              <p>
                Otázka {activeSession.currentIndex + 1} z {activeSession.questionIds.length}
              </p>
              {activeSession.round > 1 ? <p>Kolo {activeSession.round}</p> : null}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Bez aktivního sezení. Můžeš rovnou procházet otázky nebo spustit nový průchod.
            </p>
          )}
        </section>
      </aside>

      <div className="border-b border-border/60 bg-surface/85 px-4 py-4 backdrop-blur lg:hidden">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">EKOPOD</p>
          <p className="mt-2 text-sm text-text-secondary">Lokální studijní rozhraní bez backendu.</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.mode]
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'inline-flex min-w-max items-center gap-2 rounded-full border px-4 py-2 text-sm transition',
                    isActive
                      ? 'border-accent/50 bg-accent/14 text-text-primary'
                      : 'border-border/60 bg-background/20 text-text-secondary',
                  )
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </>
  )
}
