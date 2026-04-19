import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/app-shell'
import { ErrorBoundary } from '@/components/error-boundary'
import { ContentProvider } from '@/providers/content-provider'

const FlashcardsView = lazy(async () => {
  const module = await import('@/routes/flashcards-view')
  return { default: module.FlashcardsView }
})

const MistakesView = lazy(async () => {
  const module = await import('@/routes/mistakes-view')
  return { default: module.MistakesView }
})

const ExamView = lazy(async () => {
  const module = await import('@/routes/exam-view')
  return { default: module.ExamView }
})

const PdfView = lazy(async () => {
  const module = await import('@/routes/pdf-view')
  return { default: module.PdfView }
})

const SummariesView = lazy(async () => {
  const module = await import('@/routes/summaries-view')
  return { default: module.SummariesView }
})

const StatsView = lazy(async () => {
  const module = await import('@/routes/stats-view')
  return { default: module.StatsView }
})

const SettingsView = lazy(async () => {
  const module = await import('@/routes/settings-view')
  return { default: module.SettingsView }
})

function App() {
  return (
    <ErrorBoundary>
      <ContentProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <main className="grid min-h-screen place-items-center bg-background px-6 py-16 text-text-primary">
                <div className="rounded-3xl border border-border/70 bg-surface/75 px-6 py-5 shadow-card">
                  Načítám studijní režim…
                </div>
              </main>
            }
          >
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<FlashcardsView />} />
                <Route path="/chyby" element={<MistakesView />} />
                <Route path="/zkouska" element={<ExamView />} />
                <Route path="/skripta" element={<PdfView />} />
                <Route path="/souhrny" element={<SummariesView />} />
                <Route path="/statistiky" element={<StatsView />} />
                <Route path="/nastaveni" element={<SettingsView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ContentProvider>
    </ErrorBoundary>
  )
}

export default App
