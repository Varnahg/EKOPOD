import { useEffect, useRef, useState } from 'react'

export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries
      setWidth(entry?.contentRect.width ?? 0)
    })

    observer.observe(ref.current)
    setWidth(ref.current.getBoundingClientRect().width)

    return () => observer.disconnect()
  }, [])

  return { ref, width }
}
