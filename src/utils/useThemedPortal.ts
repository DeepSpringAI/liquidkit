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
 *
 * Returns `null` on the server *and* on the first client render — callers
 * render nothing until it is ready. The container is made in an effect rather
 * than during render on purpose: a `typeof document` branch inside render
 * hands the client a container the server never had, so a portal that is open
 * during hydration puts a subtree in the client tree that isn't in the server
 * HTML. React fails hydration for the whole document and re-renders it on the
 * client — which, in a Next.js app, also means every `<script>` in `<head>`
 * gets recreated and never runs. One commit later is soon enough.
 */
export function useThemedPortal(): HTMLElement | null {
  const [el, setEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const node = document.createElement('div')
    node.className = 'lk-portal'

    const sync = () => {
      const source = readThemeSource()
      for (const attr of MIRRORED_ATTRS) {
        const value = source?.getAttribute(attr)
        if (value) node.setAttribute(attr, value)
        else node.removeAttribute(attr)
      }
    }
    sync()
    document.body.appendChild(node)
    setEl(node)

    // Keep the portal's theme in sync if the app changes it while open.
    const source = readThemeSource() ?? document.documentElement
    const observer = new MutationObserver(sync)
    observer.observe(source, { attributes: true, attributeFilter: [...MIRRORED_ATTRS] })

    return () => {
      observer.disconnect()
      node.remove()
      setEl(null)
    }
  }, [])

  return el
}
