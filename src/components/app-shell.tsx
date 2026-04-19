import { Outlet } from 'react-router-dom'

import { ContentStatusBanner } from '@/components/content-status-banner'
import { SidebarNavigation } from '@/components/sidebar-navigation'
import { cn } from '@/lib/utils'
import { useContent } from '@/providers/use-content'
import { useAppStore } from '@/store/app-store'

const FONT_SCALE_CLASS = {
  normal: 'text-base',
  large: 'text-[17px]',
  xlarge: 'text-[18px]',
}

export function AppShell() {
  const content = useContent()
  const activeSession = useAppStore((state) => state.activeSession)
  const settings = useAppStore((state) => state.settings)
  const storageIssue = useAppStore((state) => state.storageIssue)
  const dismissStorageIssue = useAppStore((state) => state.dismissStorageIssue)

  return (
    <div
      className={cn(
        'min-h-screen bg-background text-text-primary lg:h-screen lg:overflow-hidden',
        FONT_SCALE_CLASS[settings.fontScale],
      )}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(89,160,255,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,198,135,0.12),transparent_28%),linear-gradient(180deg,rgba(11,15,24,1),rgba(11,15,24,0.96))]" />
      <div className="lg:grid lg:h-full lg:grid-cols-[22.5rem_minmax(0,1fr)]">
        <SidebarNavigation content={content} activeSession={activeSession} />
        <div className="min-w-0 px-4 pb-6 pt-4 sm:px-5 lg:flex lg:min-h-0 lg:flex-col lg:px-5 lg:py-4">
          {storageIssue ? (
            <section className="mb-3 rounded-3xl border border-error/40 bg-error/12 px-4 py-3 text-sm text-text-primary">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>{storageIssue}</span>
                <button
                  type="button"
                  onClick={dismissStorageIssue}
                  className="rounded-full border border-error/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-error"
                >
                  Zavřít
                </button>
              </div>
            </section>
          ) : null}

          <ContentStatusBanner content={content} />

          <main className="mt-3 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
