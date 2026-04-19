import { parseImportedSnapshot } from '@/lib/progress'
import { SettingsPanel } from '@/components/settings-panel'
import { useAppStore } from '@/store/app-store'

export function SettingsView() {
  const settings = useAppStore((state) => state.settings)
  const progress = useAppStore((state) => state.progress)
  const activeSession = useAppStore((state) => state.activeSession)
  const selectedQuestionId = useAppStore((state) => state.selectedQuestionId)
  const detailTab = useAppStore((state) => state.detailTab)
  const detailOpen = useAppStore((state) => state.detailOpen)
  const applySettings = useAppStore((state) => state.applySettings)
  const restoreDefaultSettings = useAppStore((state) => state.restoreDefaultSettings)
  const resetProgress = useAppStore((state) => state.resetProgress)
  const importSnapshot = useAppStore((state) => state.importSnapshot)

  return (
    <div className="h-full space-y-4 overflow-y-auto pr-1">
      <section className="rounded-[2rem] border border-border/70 bg-surface/75 p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Nastavení</p>
        <h2 className="mt-3 font-serif text-4xl text-text-primary">Lokální preference a data</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary">
          Aplikace ukládá stav pouze do prohlížeče. Odtud si můžeš postup exportovat, importovat nebo bezpečně resetovat.
        </p>
      </section>

      <SettingsPanel
        settings={settings}
        snapshot={{
          version: 1,
          progress,
          settings,
          activeSession,
          selectedQuestionId,
          detailTab,
          detailOpen,
        }}
        onChange={applySettings}
        onRestoreDefaults={restoreDefaultSettings}
        onResetProgress={resetProgress}
        onImportSnapshot={(raw) => {
          const snapshot = parseImportedSnapshot(raw)
          importSnapshot(snapshot)
        }}
      />
    </div>
  )
}
