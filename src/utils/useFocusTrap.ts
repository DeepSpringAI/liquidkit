import { useEffect } from 'react'
import type { RefObject } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Trap keyboard focus within `ref` while `active` is true. On activation it moves
 * focus to the first focusable descendant (or the container itself); on
 * deactivation it restores focus to whatever was focused beforehand. Tab and
 * Shift+Tab cycle within the container. SSR-safe (no-op without `document`).
 *
 * The container should have `tabIndex={-1}` so it can receive focus when it has
 * no focusable children.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return
    const node = ref.current
    if (!node) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusable = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )

    const first = focusable()[0]
    if (first) first.focus()
    else node.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const els = focusable()
      if (els.length === 0) {
        e.preventDefault()
        node.focus()
        return
      }
      const firstEl = els[0]
      const lastEl = els[els.length - 1]
      const activeEl = document.activeElement
      if (e.shiftKey && (activeEl === firstEl || !node.contains(activeEl))) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && (activeEl === lastEl || !node.contains(activeEl))) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      previouslyFocused?.focus?.()
    }
  }, [active, ref])
}
