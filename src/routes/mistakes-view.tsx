import { StudyView } from '@/routes/study-view'

export function MistakesView() {
  return (
    <StudyView
      mode="mistakes"
      title="Trénink chyb"
      description="Průchod otázkami, které byly v historii slabé nebo nezvládnuté. Filtry zůstávají plně k dispozici, ale pořadí zvýhodňuje otázky s nejnižší úrovní zvládnutí."
    />
  )
}
