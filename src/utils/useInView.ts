import { useCallback, useEffect, useState } from 'react'

/* ============================================================================
   A single process-wide IntersectionObserver shared by every glass surface,
   mirroring the glassFilterRegistry singleton. One observer + a target→setter
   map is dramatically cheaper than one observer per surface when a page mounts
   dozens of them, and it lets the engine drop the GPU-expensive backdrop-filter
   on anything scrolled out of view.

   `rootMargin: '256px'` arms a surface a little before it reaches the viewport
   so the refraction filter is already live by the time it is visible — the
   re-arm happens off-screen, never as an on-screen pop.
   ========================================================================== */

let observer: IntersectionObserver | null = null
let observerUnavailable = false
const callbacks = new Map<Element, (inView: boolean) => void>()

function getObserver(): IntersectionObserver | null {
  if (observer) return observer
  if (observerUnavailable) return null
  if (typeof IntersectionObserver === 'undefined') {
    observerUnavailable = true
    return null
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        callbacks.get(entry.target)?.(entry.isIntersecting)
      }
    },
    { root: null, rootMargin: '256px', threshold: 0 },
  )
  return observer
}

/**
 * Track whether an element is within (or near) the viewport via the shared
 * observer. Returns `[inView, ref]`. Attach `ref` to the element.
 *
 * - Starts `true` (optimistic) so first paint — and SSR hydration — matches the
 *   non-paused output exactly, with no above-the-fold flash.
 * - When `enabled` is false, or `IntersectionObserver` is unavailable (SSR /
 *   jsdom), it stays `true` and never observes.
 */
export function useInView<T extends Element = Element>(
  enabled: boolean = true,
): [boolean, (node: T | null) => void] {
  const [inView, setInView] = useState(true)
  // Drives the observe effect. Functional updates collapse the null→node churn
  // that `mergeRefs` produces on every render into a no-op when the node is
  // unchanged, so we never re-observe a stable element.
  const [node, setNode] = useState<T | null>(null)

  const ref = useCallback((next: T | null) => {
    setNode((prev) => (prev === next ? prev : next))
  }, [])

  useEffect(() => {
    if (!node) return
    const obs = getObserver()
    if (!enabled || !obs) {
      setInView(true)
      return
    }
    callbacks.set(node, (v) => setInView((prev) => (prev === v ? prev : v)))
    obs.observe(node)
    return () => {
      obs.unobserve(node)
      callbacks.delete(node)
    }
  }, [node, enabled])

  return [enabled ? inView : true, ref]
}
