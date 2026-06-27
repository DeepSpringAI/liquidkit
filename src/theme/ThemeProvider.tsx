import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  /** The chosen mode (may be 'system'). */
  mode: ThemeMode
  /** The concrete theme currently applied. */
  theme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  /** Flip between light and dark (resolving 'system' first). */
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function prefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export interface ThemeProviderProps {
  children: ReactNode
  /** Initial mode. @default 'system' */
  defaultMode?: ThemeMode
  /**
   * Where to apply the `data-theme` attribute.
   * - `wrapper` (default): renders a `<div class="lk-root">` carrying the theme.
   * - `html`: sets it on `<html>` and renders children unwrapped.
   */
  attach?: 'wrapper' | 'html'
  /** Persist the chosen mode under this localStorage key. */
  storageKey?: string
  className?: string
}

export function ThemeProvider({
  children,
  defaultMode = 'system',
  attach = 'wrapper',
  storageKey,
  className,
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (storageKey && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(storageKey) as ThemeMode | null
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    }
    return defaultMode
  })

  const [systemDark, setSystemDark] = useState(prefersDark)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
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

  const toggle = useCallback(() => {
    setMode(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setMode])

  useEffect(() => {
    if (attach !== 'html' || typeof document === 'undefined') return
    const el = document.documentElement
    const prev = el.getAttribute('data-theme')
    el.setAttribute('data-theme', theme)
    return () => {
      if (prev) el.setAttribute('data-theme', prev)
      else el.removeAttribute('data-theme')
    }
  }, [attach, theme])

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, theme, setMode, toggle }),
    [mode, theme, setMode, toggle],
  )

  return (
    <ThemeContext.Provider value={value}>
      {attach === 'wrapper' ? (
        <div className={className ? `lk-root ${className}` : 'lk-root'} data-theme={theme}>
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
