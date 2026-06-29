import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/** The chosen mode. `'system'` follows the OS; `'light'`/`'dark'` pin it. */
export type ThemeMode = 'light' | 'dark' | 'system'
/** The concrete mode written to `data-theme` (`'system'` resolved away). */
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  /** The chosen mode (may be 'system'). */
  mode: ThemeMode
  /** The concrete light/dark mode currently applied. */
  theme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  /** Flip between light and dark (resolving 'system' first). */
  toggle: () => void
  /**
   * The active preset palette name (e.g. `'aurora'`), or `null` for the default.
   * Requires the optional `liquidkit/themes.css`. Written to `data-palette`,
   * an axis orthogonal to light/dark — the toggle still switches mode.
   */
  palette: string | null
  setPalette: (palette: string | null) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface ThemeProviderProps {
  children: ReactNode
  /** Initial mode. @default 'system' */
  defaultMode?: ThemeMode
  /** Initial preset palette (see `themePresets`), or `null` for the default. */
  defaultPalette?: string | null
  /**
   * Where to apply the `data-theme` / `data-palette` attributes.
   * - `wrapper` (default): renders a `<div class="lk-root">` carrying them.
   * - `html`: sets them on `<html>` and renders children unwrapped.
   */
  attach?: 'wrapper' | 'html'
  /**
   * Persist the chosen mode under this localStorage key. The palette, when used,
   * is persisted under `` `${storageKey}-palette` ``.
   */
  storageKey?: string
  className?: string
}

export function ThemeProvider({
  children,
  defaultMode = 'system',
  defaultPalette = null,
  attach = 'wrapper',
  storageKey,
  className,
}: ThemeProviderProps) {
  // Start from the deterministic defaults so the server-rendered markup and the
  // first client render agree (no hydration mismatch / theme flash). The stored
  // values and OS preference are read after mount in the effects below.
  const [mode, setModeState] = useState<ThemeMode>(defaultMode)
  const [palette, setPaletteState] = useState<string | null>(defaultPalette)
  const [systemDark, setSystemDark] = useState(false)

  const paletteKey = storageKey ? `${storageKey}-palette` : undefined

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    if (storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved === 'light' || saved === 'dark' || saved === 'system') setModeState(saved)
    }
    if (paletteKey) {
      const savedPalette = localStorage.getItem(paletteKey)
      if (savedPalette !== null) setPaletteState(savedPalette || null)
    }
  }, [storageKey, paletteKey])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mql.matches)
    const onChange = () => setSystemDark(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const theme: ResolvedTheme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next)
      if (storageKey && typeof localStorage !== 'undefined') {
        localStorage.setItem(storageKey, next)
      }
    },
    [storageKey],
  )

  const setPalette = useCallback(
    (next: string | null) => {
      setPaletteState(next)
      if (paletteKey && typeof localStorage !== 'undefined') {
        localStorage.setItem(paletteKey, next ?? '')
      }
    },
    [paletteKey],
  )

  const toggle = useCallback(() => {
    setMode(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setMode])

  useEffect(() => {
    if (attach !== 'html' || typeof document === 'undefined') return
    const el = document.documentElement
    const prevTheme = el.getAttribute('data-theme')
    const prevPalette = el.getAttribute('data-palette')
    el.setAttribute('data-theme', theme)
    if (palette) el.setAttribute('data-palette', palette)
    else el.removeAttribute('data-palette')
    return () => {
      if (prevTheme) el.setAttribute('data-theme', prevTheme)
      else el.removeAttribute('data-theme')
      if (prevPalette) el.setAttribute('data-palette', prevPalette)
      else el.removeAttribute('data-palette')
    }
  }, [attach, theme, palette])

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, theme, setMode, toggle, palette, setPalette }),
    [mode, theme, setMode, toggle, palette, setPalette],
  )

  return (
    <ThemeContext.Provider value={value}>
      {attach === 'wrapper' ? (
        <div
          className={className ? `lk-root ${className}` : 'lk-root'}
          data-theme={theme}
          data-palette={palette ?? undefined}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  )
}

/** Read and control the current theme. Must be used within a ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>.')
  }
  return ctx
}
