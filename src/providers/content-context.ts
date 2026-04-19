import { createContext } from 'react'

import type { ContentIndex } from '@/types/content'

export const ContentContext = createContext<ContentIndex | null>(null)
