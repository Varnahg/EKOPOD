import { useEffect } from 'react'

type ShortcutHandlers = {
  onReveal?: () => void
  onPrevious?: () => void
  onNext?: () => void
  onToggleDetail?: () => void
  onToggleFavorite?: () => void
  onClose?: () => void
  onFocusSearch?: () => void
  onRate?: (rating: 0 | 1 | 2 | 3) => void
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
}

export function useKeyboardShortcuts(
  enabled: boolean,
  handlers: ShortcutHandlers,
) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const listener = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) && event.key !== 'Escape') {
        return
      }

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        handlers.onReveal?.()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handlers.onPrevious?.()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handlers.onNext?.()
        return
      }

      if (event.key === 'd' || event.key === 'D') {
        event.preventDefault()
        handlers.onToggleDetail?.()
        return
      }

      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        handlers.onToggleFavorite?.()
        return
      }

      if (event.key === 'Escape') {
        handlers.onClose?.()
        return
      }

      if (event.key === '/') {
        event.preventDefault()
        handlers.onFocusSearch?.()
        return
      }

      if (['0', '1', '2', '3'].includes(event.key)) {
        handlers.onRate?.(Number(event.key) as 0 | 1 | 2 | 3)
      }
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [enabled, handlers])
}
