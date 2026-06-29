import { useEffect, useState } from 'react'

// Theme axes mirrored onto portal containers: mode + preset palette.
const MIRRORED_ATTRS = ['data-theme', 'data-palette'] as const

function readThemeSource(): Element | null {
  if (typeof document === 'undefined') return null
  // The ThemeProvider sets the attributes on its wrapper div (or <html>).
  // Exclude our own portal containers so we read the real source.
  return document.querySelector('[data-theme]:not(.lk-portal)')
}

/**
 * A portal target appended to `document.body` that mirrors the app's active
 * theme attributes (`data-theme` mode + `data-palette` preset), so portaled
 * overlays (modals, sheets, toasts, dropdowns) render with the *chosen* theme
 * rather than falling back to the OS preference once they escape the
 * ThemeProvider wrapper. Stays in sync if the theme changes while open.
 * Returns `null` during SSR (callers should render nothing until ready).
 */
export function useThemedPortal(): HTMLElement | null {
  const [el] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined' ? null : document.createElement('div'),
  )

  useEffect(() => {
    if (!el) return
    el.className = 'lk-portal'

    const sync = () => {
      const source = readThemeSource()
      for (const attr of MIRRORED_ATTRS) {
        const value = source?.getAttribute(attr)
        if (value) el.setAttribute(attr, value)
        else el.removeAttribute(attr)
      }
    }
    sync()
    document.body.appendChild(el)

    // Keep the portal's theme in sync if the app changes it while open.
    const source = readThemeSource() ?? document.documentElement
    const observer = new MutationObserver(sync)
    observer.observe(source, { attributes: true, attributeFilter: [...MIRRORED_ATTRS] })

    return () => {
      observer.disconnect()
      el.remove()
    }
  }, [el])

  return el
}
