import { forwardRef } from 'react'
import { Switch, type SwitchProps } from '../Switch/Switch'
import { useTheme } from '../../theme/ThemeProvider'

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

export type ThemeToggleProps = Omit<SwitchProps, 'checked' | 'onChange' | 'iconOn' | 'iconOff'>

/** A pre-wired light/dark switch. Must be used within a ThemeProvider. */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(
  { glow = true, ...props },
  ref,
) {
  const { theme, toggle } = useTheme()
  return (
    <Switch
      ref={ref}
      checked={theme === 'dark'}
      onChange={toggle}
      iconOn={<MoonIcon />}
      iconOff={<SunIcon />}
      glow={glow}
      aria-label="Toggle color theme"
      {...props}
    />
  )
})
