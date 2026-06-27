import { useEffect, useState } from 'react'

function readActiveTheme(): string | null {
  if (typeof document === 'undefined') return null
  // The ThemeProvider sets [data-theme] on its wrapper div (or <html>). Exclude
  // our own portal containers so we read the real source, not a sibling portal.
  const el = document.querySelector('[data-theme]:not(.lk-portal)')
  return el ? el.getAttribute('data-theme') : null
}

/**
 * A portal target appended to `document.body` that mirrors the app's active
 * theme, so portaled overlays (modals, sheets, toasts, dropdowns) render with
 * the *chosen* theme rather than falling back to the OS preference once they
 * escape the ThemeProvider wrapper. Stays in sync if the theme toggles while
 * open. Returns `null` during SSR (callers should render nothing until ready).
 */
export function useThemedPortal(): HTMLElement | null {
  const [el] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined' ? null : document.createElement('div'),
  )

  useEffect(() => {
    if (!el) return
    el.className = 'lk-portal'

    const sync = () => {
      const theme = readActiveTheme()
      if (theme) el.setAttribute('data-theme', theme)
      else el.removeAttribute('data-theme')
    }
    sync()
    document.body.appendChild(el)

    // Keep the portal's theme in sync if the app toggles it while open.
    const source =
      document.querySelector('[data-theme]:not(.lk-portal)') ?? document.documentElement
    const observer = new MutationObserver(sync)
    observer.observe(source, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      observer.disconnect()
      el.remove()
    }
  }, [el])

  return el
}
