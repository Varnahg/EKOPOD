import { AlertTriangle, ChevronRight } from 'lucide-react'

import { MarkdownRenderer } from '@/components/markdown-renderer'
import type { QuestionDocument } from '@/types/content'
import { cn } from '@/lib/utils'

interface FlashcardProps {
  question: QuestionDocument | null
  revealed: boolean
  animateFlip: boolean
  onReveal: () => void
  minimal?: boolean
}

export function Flashcard({
  question,
  revealed,
  animateFlip,
  onReveal,
  minimal = false,
}: FlashcardProps) {
  if (!question) {
    return (
      <section className="grid min-h-[26rem] place-items-center rounded-[2rem] border border-dashed border-border/70 bg-surface/60 p-8 text-center shadow-card">
        <div>
          <h2 className="font-serif text-3xl text-text-primary">Žádná otázka k zobrazení</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-text-secondary">
            Uprav filtry, otevři jinou kapitolu nebo nahraj další obsahové soubory do `content/questions`.
          </p>
        </div>
      </section>
    )
  }

  if (!question.valid) {
    return (
      <section className="rounded-[2rem] border border-warning/35 bg-warning/10 p-6 shadow-card">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-warning/40 bg-warning/12 p-3 text-warning">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-warning">Nevalidní otázka</p>
            <h2 className="mt-3 font-serif text-3xl text-text-primary">{question.title}</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Soubor obsahuje chyby ve frontmatteru nebo sekcích. Oprav metadata a otázka bude opět plně studovatelná.
            </p>
          </div>
        </div>
        <ul className="mt-6 space-y-2 rounded-2xl border border-warning/25 bg-background/35 p-4 text-sm text-text-primary">
          {question.validationIssues.map((issue) => (
            <li key={issue} className="flex gap-2">
              <ChevronRight className="mt-0.5 size-4 shrink-0 text-warning" />
              {issue}
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const surfaceClasses = minimal
    ? 'min-h-[24rem] md:min-h-[30rem]'
    : 'min-h-[30rem] xl:min-h-[34rem]'

  const front = (
    <section className={cn('card-face rounded-[2rem] border border-paper/60 bg-paper p-6 text-text-ink shadow-card md:p-8', surfaceClasses)}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-text-ink/60">
        {question.set} · {question.chapter}
      </p>
      <h2 className="mt-5 font-serif text-4xl leading-tight text-text-ink md:text-5xl">
        {question.title}
      </h2>
      {question.subchapter ? (
        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-text-ink/60">{question.subchapter}</p>
      ) : null}
      <div className="mt-8 max-w-3xl">
        <MarkdownRenderer markdown={question.sections.question} className="prose-headings:text-text-ink prose-strong:text-text-ink prose-p:text-text-ink/85 prose-li:text-text-ink/85 prose-blockquote:text-text-ink prose-code:bg-surface/15 prose-pre:bg-surface/15 prose-th:text-text-ink prose-td:text-text-ink/85" />
      </div>
      {!revealed ? (
        <button
          type="button"
          onClick={onReveal}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-text-ink/20 bg-text-ink/6 px-4 py-2 text-sm font-semibold text-text-ink transition hover:border-accent/50 hover:text-accent"
        >
          Odkrýt modelovou odpověď
          <ChevronRight className="size-4" />
        </button>
      ) : null}
    </section>
  )

  const back = (
    <section className={cn('card-face card-back rounded-[2rem] border border-paper/60 bg-paper p-6 text-text-ink shadow-card md:p-8', surfaceClasses)}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-text-ink/60">Modelová odpověď</p>
      <h2 className="mt-5 font-serif text-4xl leading-tight text-text-ink md:text-5xl">{question.title}</h2>
      <div className="mt-8 max-w-3xl">
        <MarkdownRenderer markdown={question.sections.modelAnswer} className="prose-headings:text-text-ink prose-strong:text-text-ink prose-p:text-text-ink/85 prose-li:text-text-ink/85 prose-blockquote:text-text-ink prose-code:bg-surface/15 prose-pre:bg-surface/15 prose-th:text-text-ink prose-td:text-text-ink/85" />
      </div>
    </section>
  )

  if (!animateFlip) {
    return revealed ? back : front
  }

  return (
    <div className="relative [perspective:1800px]">
      <div
        className={cn(
          'relative transition-transform duration-300 [transform-style:preserve-3d]',
          revealed ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]',
        )}
      >
        {front}
        {back}
      </div>
    </div>
  )
}
