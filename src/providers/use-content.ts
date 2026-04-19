import { useContext } from 'react'

import { ContentContext } from '@/providers/content-context'

export function useContent() {
  const context = useContext(ContentContext)

  if (!context) {
    throw new Error('useContent musí být použitý uvnitř ContentProvideru.')
  }

  return context
}
