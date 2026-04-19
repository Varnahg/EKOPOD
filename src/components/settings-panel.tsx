import { Download, RotateCcw, Trash2, Upload } from 'lucide-react'
import { useRef, type ChangeEvent, type PropsWithChildren } from 'react'

import { serializeProgressSnapshot } from '@/lib/progress'
import type { StoredProgressState, SettingsState } from '@/types/state'

interface SettingsPanelProps {
  settings: SettingsState
  snapshot: StoredProgressState
  onChange: (patch: Partial<SettingsState>) => void
  onRestoreDefaults: () => void
  onResetProgress: () => void
  onImportSnapshot: (raw: string) => void
}

export function SettingsPanel({
  settings,
  snapshot,
  onChange,
  onRestoreDefaults,
  onResetProgress,
  onImportSnapshot,
}: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleExport = () => {
    const blob = new Blob([serializeProgressSnapshot(snapshot)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `ekopod-progress-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const raw = await file.text()
    onImportSnapshot(raw)
    event.target.value = ''
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <SettingsGroup title="Interakce">
            <Toggle
              label="Flip animace"
              description="Jemné otočení kartičky při odhalení odpovědi."
              checked={settings.flipAnimation}
              onChange={(checked) => onChange({ flipAnimation: checked })}
            />
            <Toggle
              label="Klávesové zkratky"
              description="Space, Enter, 0-3, šipky, D, F, Esc a /."
              checked={settings.keyboardShortcuts}
              onChange={(checked) => onChange({ keyboardShortcuts: checked })}
            />
            <Toggle
              label="Reduced motion"
              description="Potlačí pohybové přechody a otočení karty."
              checked={settings.reducedMotion}
              onChange={(checked) => onChange({ reducedMotion: checked })}
            />
          </SettingsGroup>

          <SettingsGroup title="Studijní režimy">
            <Toggle
              label="Časovač v simulaci"
              description="Automaticky zobrazí odpočet pro vlastní odpověď."
              checked={settings.examTimerEnabled}
              onChange={(checked) => onChange({ examTimerEnabled: checked })}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-primary">Délka odpovědi v simulaci (sekundy)</span>
              <input
                type="number"
                min={15}
                max={600}
                step={15}
                value={settings.examTimerSeconds}
                onChange={(event) => onChange({ examTimerSeconds: Number(event.target.value) })}
                className="w-full rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-text-primary outline-none focus:border-accent/50"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-primary">Výchozí řazení otázek</span>
              <select
                value={settings.defaultSort}
                onChange={(event) =>
                  onChange({ defaultSort: event.target.value as SettingsState['defaultSort'] })
                }
                className="w-full rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-text-primary outline-none focus:border-accent/50"
              >
                <option value="content">Podle obsahu</option>
                <option value="weakest">Od nejslabších</option>
                <option value="recent">Podle poslední aktivity</option>
                <option value="random">Náhodně</option>
              </select>
            </label>
          </SettingsGroup>

          <SettingsGroup title="Typografie a hustota">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-primary">Hustota seznamů</span>
              <select
                value={settings.density}
                onChange={(event) =>
                  onChange({ density: event.target.value as SettingsState['density'] })
                }
                className="w-full rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-text-primary outline-none focus:border-accent/50"
              >
                <option value="comfortable">Pohodlná</option>
                <option value="compact">Kompaktní</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-primary">Velikost písma</span>
              <select
                value={settings.fontScale}
                onChange={(event) =>
                  onChange({ fontScale: event.target.value as SettingsState['fontScale'] })
                }
                className="w-full rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-text-primary outline-none focus:border-accent/50"
              >
                <option value="normal">Standardní</option>
                <option value="large">Větší</option>
                <option value="xlarge">Největší</option>
              </select>
            </label>
          </SettingsGroup>
        </div>

        <aside className="space-y-6">
          <SettingsGroup title="Progress snapshot">
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-sm font-medium text-text-primary transition hover:border-accent/40 hover:text-accent"
              >
                <Download className="size-4" />
                Export do JSON
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-sm font-medium text-text-primary transition hover:border-accent/40 hover:text-accent"
              >
                <Upload className="size-4" />
                Import z JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
          </SettingsGroup>

          <SettingsGroup title="Resety">
            <div className="space-y-3">
              <button
                type="button"
                onClick={onRestoreDefaults}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-sm font-medium text-text-primary transition hover:border-accent/40"
              >
                <RotateCcw className="size-4" />
                Výchozí nastavení
              </button>
              <button
                type="button"
                onClick={onResetProgress}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-error/35 bg-error/10 px-4 py-3 text-sm font-semibold text-error transition hover:border-error/60"
              >
                <Trash2 className="size-4" />
                Reset lokálního postupu
              </button>
            </div>
          </SettingsGroup>
        </aside>
      </div>
    </section>
  )
}

function SettingsGroup({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-surface/75 p-5 shadow-card">
      <h2 className="font-serif text-3xl text-text-primary">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/25 px-4 py-4">
      <span>
        <span className="block text-sm font-medium text-text-primary">{label}</span>
        <span className="mt-1 block text-sm leading-7 text-text-secondary">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 rounded border-border bg-background text-accent focus:ring-accent"
      />
    </label>
  )
}
