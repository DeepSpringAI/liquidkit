import { useCallback, useEffect, useRef, useState } from 'react'

export interface Size {
  width: number
  height: number
}

/**
 * Observe an element's size. Returns the latest size and a callback ref to
 * attach to the element. Size is rounded to whole pixels to keep the glass
 * filter cache from thrashing on sub-pixel layout shifts.
 */
export function useSize<T extends HTMLElement = HTMLElement>(): [
  Size | null,
  (node: T | null) => void,
] {
  const [size, setSize] = useState<Size | null>(null)
  const observer = useRef<ResizeObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    observer.current?.disconnect()
    if (!node || typeof ResizeObserver === 'undefined') return

    const measure = (w: number, h: number) => {
      setSize((prev) =>
        prev && prev.width === w && prev.height === h ? prev : { width: w, height: h },
      )
    }

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) measure(Math.round(rect.width), Math.round(rect.height))
    })
    ro.observe(node)
    observer.current = ro

    const rect = node.getBoundingClientRect()
    measure(Math.round(rect.width), Math.round(rect.height))
  }, [])

  useEffect(() => () => observer.current?.disconnect(), [])

  return [size, ref]
}
