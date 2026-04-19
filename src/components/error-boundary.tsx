import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError() {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[EKOPOD] Neočekávaná chyba aplikace', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-background px-6 py-16 text-text-primary">
          <section className="max-w-lg rounded-3xl border border-error/40 bg-surface/90 p-8 shadow-soft">
            <div className="mb-5 inline-flex rounded-2xl border border-error/40 bg-error/12 p-3 text-error">
              <AlertTriangle className="size-7" />
            </div>
            <h1 className="font-serif text-3xl text-text-primary">Aplikace narazila na chybu</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Rozhraní se bezpečně zastavilo, aby ses neztratil v rozbitém stavu. Zkus stránku obnovit;
              pokud problém přetrvá, mrkni do vývojové konzole.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-accent/60 hover:text-accent"
            >
              <RefreshCcw className="size-4" />
              Obnovit aplikaci
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
