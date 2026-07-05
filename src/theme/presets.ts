/**
 * Built-in preset palettes shipped in `@hamidrezazargham/liquidkit/themes.css`.
 *
 * Each palette has a full light AND dark variant — it's an axis orthogonal to
 * light/dark, so the mode toggle switches between a theme's two looks. To use
 * them, opt into the optional stylesheet and pick a palette by name:
 *
 *     import '@hamidrezazargham/liquidkit/styles.css'
 *     import '@hamidrezazargham/liquidkit/themes.css'
 *
 *     <ThemeProvider defaultMode="dark" defaultPalette="aurora"> … </ThemeProvider>
 *     // or, without the provider:
 *     <div data-theme="dark" data-palette="aurora"> … </div>
 *
 * This list is data so you can build a theme picker:
 *
 *     import { themePresets } from '@hamidrezazargham/liquidkit'
 *     themePresets.map((p) => <option value={p.name}>{p.label}</option>)
 */
export interface ThemePreset {
  /** Value to put in `data-palette` / pass as `defaultPalette`. */
  name: string
  /** Human-friendly name for a picker. */
  label: string
}

export const themePresets = [
  { name: 'aurora', label: 'Aurora' },
  { name: 'indigo', label: 'Indigo' },
  { name: 'orchid', label: 'Orchid' },
  { name: 'amber', label: 'Amber' },
  { name: 'glacier', label: 'Glacier' },
  { name: 'rose', label: 'Rose' },
] as const satisfies readonly ThemePreset[]

/** Union of the built-in palette names (`'aurora' | 'indigo' | …`). */
export type ThemePresetName = (typeof themePresets)[number]['name']
