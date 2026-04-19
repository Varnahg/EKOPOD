import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'

import { loadContentIndex } from '@/lib/content/loader'
import { ContentContext } from '@/providers/content-context'

export function ContentProvider({ children }: PropsWithChildren) {
  const content = useMemo(() => loadContentIndex(), [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}
