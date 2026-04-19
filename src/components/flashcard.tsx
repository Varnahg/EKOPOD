import type { KeyboardEvent } from 'react'
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
            Uprav filtry, otevři jinou kapitolu nebo nahraj další obsahové soubory do
            `content/questions`.
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-warning">
              Nevalidní otázka
            </p>
            <h2 className="mt-3 font-serif text-3xl text-text-primary">{question.title}</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Soubor obsahuje chyby ve frontmatteru nebo sekcích. Oprav metadata a otázka bude
              opět plně studovatelná.
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
    ? 'h-[clamp(21rem,calc(100dvh-20rem),34rem)] w-full'
    : 'h-[clamp(24rem,calc(100dvh-24rem),38rem)] w-full'
  const markdownClassName =
    'prose-headings:text-text-ink prose-strong:text-text-ink prose-p:text-text-ink/88 prose-li:text-text-ink/88 prose-blockquote:text-text-ink prose-code:bg-text-ink/6 prose-pre:bg-text-ink/6 prose-th:text-text-ink prose-td:text-text-ink/85 prose-a:text-[#275a8c]'

  const handleRevealKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    onReveal()
  }

  const front = (
    <section
      className={cn(
        'card-face flex flex-col justify-center overflow-hidden rounded-[2rem] border border-[#d6ccb9]/90 bg-paper p-6 text-center text-text-ink shadow-card md:p-8',
        'cursor-pointer',
        surfaceClasses,
      )}
      onClick={onReveal}
      onKeyDown={handleRevealKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Otočit kartu na modelovou odpověď"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <h2 className="font-serif text-[clamp(2rem,4.1vw,3.2rem)] leading-tight text-text-ink">
          {question.title}
        </h2>
        {question.subchapter ? (
          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-text-ink/52">
            {question.subchapter}
          </p>
        ) : null}
      </div>
    </section>
  )

  const back = (
    <section
      className={cn(
        'card-face card-back flex flex-col overflow-hidden rounded-[2rem] border border-[#d6ccb9]/90 bg-paper p-6 text-text-ink shadow-card md:p-8',
        'cursor-pointer',
        surfaceClasses,
      )}
      onClick={onReveal}
      onKeyDown={handleRevealKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Otočit kartu na otázku"
    >
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        <MarkdownRenderer
          markdown={question.sections.modelAnswer}
          tone="paper"
          className={markdownClassName}
        />
      </div>
    </section>
  )

  if (!animateFlip) {
    return revealed ? back : front
  }

  return (
    <div className="relative w-full [perspective:1800px]">
      <div
        className={cn(
          'relative w-full transition-transform duration-300 [transform-style:preserve-3d]',
          revealed ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]',
        )}
      >
        {front}
        {back}
      </div>
    </div>
  )
}
