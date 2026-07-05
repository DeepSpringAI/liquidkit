import { Select, useTheme, themePresets, type SelectOption } from '@hamidrezazargham/liquidkit'

const OPTIONS: SelectOption[] = [
  { value: '', label: 'Default' },
  ...themePresets.map((p) => ({ value: p.name, label: p.label })),
]

/**
 * Live palette switcher for the docs. Drives the `data-palette` axis via
 * `useTheme().setPalette`; the light/dark toggle in the topbar owns the mode,
 * so picking a palette keeps whichever light/dark variant is active.
 */
export function ThemePicker() {
  const { palette, setPalette } = useTheme()
  return (
    <div className="doc-theme-picker">
      <span className="doc-theme-picker__label">Theme</span>
      <Select
        options={OPTIONS}
        value={palette ?? ''}
        onChange={(v) => setPalette(v || null)}
        aria-label="Choose a theme palette"
      />
    </div>
  )
}
