import { StudyView } from '@/routes/study-view'

export function FlashcardsView() {
  return (
    <StudyView
      mode="flashcards"
      title="Otázky"
      description="Vyber sadu, nastav průchod a projížděj otázky jednu po druhé."
    />
  )
}
