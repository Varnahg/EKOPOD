import { StudyView } from '@/routes/study-view'

export function FlashcardsView() {
  return (
    <StudyView
      mode="flashcards"
      title="Flashcards / Potítko"
      description="Hlavní studijní režim pro aktivní vybavování odpovědi z hlavy. Odpověz si nanečisto, odkryj modelovou odpověď, případně otevři detail a otázku ohodnoť na škále 0-3."
    />
  )
}
