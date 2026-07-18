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
 */
export function useSize<T extends HTMLElement = HTMLElement>(): [
  Size | null,
  (node: T | null) => void,
] {
  const [size, setSize] = useState<Size | null>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const frame = useRef<number | null>(null)

  const cancelFrame = () => {
    if (frame.current != null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(frame.current)
    }
    frame.current = null
  }

  const ref = useCallback((node: T | null) => {
    observer.current?.disconnect()
    cancelFrame()
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

    // Coalesce a burst of resize callbacks (e.g. a child that grows every frame)
    // into a single measure per animation frame. Combined with the dead-band and
    // the filter-size bucketing, this stops a self-reinforcing resize loop from
    // pegging the main thread.
    let pending: Size | null = null
    const flush = () => {
      frame.current = null
      if (pending) measure(pending.width, pending.height)
      pending = null
    }
    const schedule = (w: number, h: number) => {
      pending = { width: w, height: h }
      if (frame.current != null) return
      if (typeof requestAnimationFrame === 'undefined') {
        flush()
        return
      }
      frame.current = requestAnimationFrame(flush)
    }

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) schedule(Math.round(rect.width), Math.round(rect.height))
    })
    ro.observe(node)
    observer.current = ro

    // First measure is synchronous so the first paint already has a size.
    const rect = node.getBoundingClientRect()
    measure(Math.round(rect.width), Math.round(rect.height))
  }, [])

  useEffect(
    () => () => {
      observer.current?.disconnect()
      cancelFrame()
    },
    [],
  )

  return [size, ref]
}
