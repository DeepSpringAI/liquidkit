import { useCallback, useEffect, useRef, useState } from 'react'

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

function unobserve(node: Element) {
  callbacks.delete(node)
  observer?.unobserve(node)
}

/**
 * Track whether an element is within (or near) the viewport via the shared
 * observer. Returns `[inView, ref]`. Attach `ref` to the element.
 *
 * - Starts `true` (optimistic) so first paint — and SSR hydration — matches the
 *   non-paused output exactly, with no above-the-fold flash.
 * - When `enabled` is false, or `IntersectionObserver` is unavailable (SSR /
 *   jsdom), it stays `true` and never observes.
 *
 * The callback ref intentionally holds the node in a ref and NEVER calls
 * setState. `mergeRefs` re-invokes callback refs (null then node) on every
 * render, so setting React state from here would risk a render loop; instead
 * `inView` only changes from the observer callback.
 */
export function useInView<T extends Element = Element>(
  enabled: boolean = true,
): [boolean, (node: T | null) => void] {
  const [inView, setInView] = useState(true)
  const nodeRef = useRef<T | null>(null)
  const enabledRef = useRef(enabled)

  const observeNode = useCallback((node: Element) => {
    const obs = getObserver()
    if (!obs) return
    if (!callbacks.has(node)) {
      callbacks.set(node, (v) => setInView((prev) => (prev === v ? prev : v)))
      obs.observe(node)
    }
  }, [])

  const ref = useCallback(
    (node: T | null) => {
      // Ignore the transient `null` that mergeRefs fires on every re-render;
      // a real unmount is handled by the cleanup effect. Only act on a genuinely
      // new node. No setState here → no render loop.
      if (node === null || node === nodeRef.current) return
      if (nodeRef.current) unobserve(nodeRef.current)
      nodeRef.current = node
      if (enabledRef.current) observeNode(node)
    },
    [observeNode],
  )

  // React to `enabled` flipping without re-creating the ref.
  useEffect(() => {
    enabledRef.current = enabled
    const node = nodeRef.current
    if (!node) return
    if (enabled) {
      observeNode(node)
    } else {
      unobserve(node)
      setInView(true)
    }
  }, [enabled, observeNode])

  // Cleanup on unmount.
  useEffect(
    () => () => {
      if (nodeRef.current) unobserve(nodeRef.current)
      nodeRef.current = null
    },
    [],
  )

  return [enabled ? inView : true, ref]
}
