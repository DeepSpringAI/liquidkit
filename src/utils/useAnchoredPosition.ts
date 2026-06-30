import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

// Layout effect on the client (positions before paint), plain effect on the
// server (avoids React's useLayoutEffect-during-SSR warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export type AnchorPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface AnchoredOptions {
  /** @default 'bottom-start' */
  placement?: AnchorPlacement
  /** Gap between anchor and panel, px. @default 6 */
  gap?: number
  /** Make the panel at least as wide as the anchor (for Select). @default false */
  matchWidth?: boolean
}

/**
 * Position a portaled panel against an anchor element using `position: fixed`,
 * flipping to the opposite side when there isn't room and clamping into the
 * viewport. Recomputes on scroll (capture, so ancestor scrolling counts) and
 * resize while `open`. Returns a style object to spread on the panel; it starts
 * hidden until measured to avoid a flash at (0,0).
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
  opts: AnchoredOptions = {},
): CSSProperties {
  const { placement = 'bottom-start', gap = 6, matchWidth = false } = opts
  // Pin every offset before the first measure. A panel's CSS may still set a
  // placement inset (e.g. `inset-inline-end: 0`); combined with the `left: 0`
  // below that would stretch it to full width and throw off the very first
  // measurement (panel flashes to the wrong edge on first open). Forcing the
  // opposite offsets to `auto` keeps the panel at its natural content size.
  const [style, setStyle] = useState<CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 'auto',
    bottom: 'auto',
    visibility: 'hidden',
  })

  const update = useCallback(() => {
    const anchor = anchorRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return
    const a = anchor.getBoundingClientRect()
    const p = panel.getBoundingClientRect()
    const vw = document.documentElement.clientWidth
    const vh = document.documentElement.clientHeight
    const [side, align] = placement.split('-') as ['top' | 'bottom', 'start' | 'end']

    const spaceBelow = vh - a.bottom
    const spaceAbove = a.top
    const placeTop =
      side === 'top'
        ? spaceAbove >= p.height + gap || spaceAbove > spaceBelow
        : spaceBelow < p.height + gap && spaceAbove > spaceBelow
    const top = placeTop ? a.top - gap - p.height : a.bottom + gap

    let left = align === 'end' ? a.right - p.width : a.left
    left = Math.max(8, Math.min(left, vw - p.width - 8))

    setStyle({
      position: 'fixed',
      top: Math.round(Math.max(8, top)),
      left: Math.round(left),
      right: 'auto',
      bottom: 'auto',
      visibility: 'visible',
      ...(matchWidth ? { minWidth: Math.round(a.width) } : {}),
    })
  }, [anchorRef, panelRef, placement, gap, matchWidth])

  useIsoLayoutEffect(() => {
    if (!open) return
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, update])

  return style
}
