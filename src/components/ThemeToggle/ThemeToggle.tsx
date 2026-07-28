import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { useTheme } from '../../theme/ThemeProvider'
import { cx } from '../../utils/cx'
import './ThemeToggle.css'

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export type ThemeToggleSize = 'sm' | 'md' | 'lg'

export interface ThemeToggleProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  /** @default 'md' */
  size?: ThemeToggleSize
}

/**
 * A purpose-built light/dark theme switch — its own component, independent of
 * Switch. Shows a sun and a moon on the rail; a sliding glass highlight
 * spotlights the active one (warm for light, cool for dark). Must live inside
 * a ThemeProvider.
 */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(
  { size = 'md', className, ...props },
  ref,
) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Toggle color theme"
      onClick={toggle}
      className={cx('lk-theme-toggle', `lk-theme-toggle--${size}`, className)}
      data-mode={dark ? 'dark' : 'light'}
      {...props}
    >
      <LiquidGlass pill elevation={1} tint="auto" sheen={false} className="lk-theme-toggle__track">
        <span className="lk-theme-toggle__highlight" aria-hidden="true" />
        <span className="lk-theme-toggle__rail" aria-hidden="true">
          <span className="lk-theme-toggle__glyph lk-theme-toggle__glyph--sun">
            <SunIcon />
          </span>
          <span className="lk-theme-toggle__glyph lk-theme-toggle__glyph--moon">
            <MoonIcon />
          </span>
        </span>
      </LiquidGlass>
    </button>
  )
})
