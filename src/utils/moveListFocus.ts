/**
 * Move DOM focus between roving-focus items inside `container` in response to an
 * Arrow / Home / End key. Skips disabled items. Returns true if it handled the
 * key (the caller should then `preventDefault`).
 */
export function moveListFocus(
  container: HTMLElement | null,
  key: string,
  selector: string,
): boolean {
  if (!container) return false
  const items = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true',
  )
  if (items.length === 0) return false
  const idx = items.indexOf(document.activeElement as HTMLElement)
  let next: number
  switch (key) {
    case 'ArrowDown':
      next = idx < 0 ? 0 : (idx + 1) % items.length
      break
    case 'ArrowUp':
      next = idx <= 0 ? items.length - 1 : idx - 1
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = items.length - 1
      break
    default:
      return false
  }
  items[next]?.focus()
  return true
}
