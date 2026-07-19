import { useCallback, useEffect, useRef, useState } from 'react'

export interface Size {
  width: number
  height: number
}

/**
 * Observe an element's size. Returns the latest size and a callback ref to
 * attach to the element. Size is rounded to whole pixels and changes within a
 * 1px dead-band are ignored, to keep the glass filter cache from thrashing on
 * sub-pixel layout shifts (which can otherwise drive an infinite resize loop).
 *
 * The ResizeObserver callback applies the measurement synchronously so the
 * browser's own ResizeObserver loop-detection can break any resize→layout→resize
 * cycle; deferring it (e.g. via requestAnimationFrame) hides the cycle from that
 * safeguard and can spin the main thread.
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

    // Ignore ±1px jitter. Applying the glass backdrop-filter can nudge layout
    // by a sub-pixel amount that flips the rounded size between two adjacent
    // integers; without a dead-band that oscillation drives an infinite
    // ResizeObserver → setState → re-render loop. Genuine resizes (≥2px) apply.
    const EPSILON = 1
    const measure = (w: number, h: number) => {
      setSize((prev) =>
        prev && Math.abs(prev.width - w) <= EPSILON && Math.abs(prev.height - h) <= EPSILON
          ? prev
          : { width: w, height: h },
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
