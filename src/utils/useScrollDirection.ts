import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export type ScrollDirection = 'up' | 'down'

export interface UseScrollDirectionOptions {
  /** Element to observe. Omit to watch the window / document scroll. */
  target?: RefObject<HTMLElement | null>
  /** Pixels of movement required before the reported direction flips. @default 6 */
  threshold?: number
  /** scrollY at or below this counts as "at top". @default 8 */
  topOffset?: number
}

export interface ScrollDirectionState {
  /** Most recent scroll direction. Starts at `'up'`. */
  direction: ScrollDirection
  /** Current scroll offset in px. */
  scrollY: number
  /** True while within `topOffset` of the top — drive a full-size bar from this. */
  atTop: boolean
}

/**
 * Reports scroll direction and top-proximity, rAF-throttled. This is the
 * primitive behind iOS 26's scroll-reactive chrome: a tab bar or nav bar that
 * condenses on `direction === 'down'` and expands when scrolling up or `atTop`.
 */
export function useScrollDirection(options: UseScrollDirectionOptions = {}): ScrollDirectionState {
  const { target, threshold = 6, topOffset = 8 } = options
  const [state, setState] = useState<ScrollDirectionState>({
    direction: 'up',
    scrollY: 0,
    atTop: true,
  })
  const last = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = target?.current ?? null
    const getY = () => (el ? el.scrollTop : window.scrollY)
    last.current = getY()

    let ticking = false
    const update = () => {
      ticking = false
      const y = getY()
      const dy = y - last.current
      const atTop = y <= topOffset
      let direction: ScrollDirection | null = null
      if (Math.abs(dy) >= threshold) {
        direction = dy > 0 ? 'down' : 'up'
        last.current = y
      }
      setState((s) => {
        const next: ScrollDirectionState = {
          direction: direction ?? s.direction,
          scrollY: y,
          atTop,
        }
        return next.direction === s.direction &&
          next.scrollY === s.scrollY &&
          next.atTop === s.atTop
          ? s
          : next
      })
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    const node: HTMLElement | Window = el ?? window
    node.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => node.removeEventListener('scroll', onScroll)
  }, [target, threshold, topOffset])

  return state
}
