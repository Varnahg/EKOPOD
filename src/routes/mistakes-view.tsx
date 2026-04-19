import { StudyView } from '@/routes/study-view'

export function MistakesView() {
  return (
    <StudyView
      mode="mistakes"
      title="Trénink chyb"
      description="Průchod otázkami, které byly slabé nebo nezvládnuté."
    />
  )
}
