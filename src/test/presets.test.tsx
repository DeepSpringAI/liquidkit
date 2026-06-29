import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider, themePresets } from '../index'

describe('theme presets', () => {
  it('exposes a non-empty, well-formed preset list', () => {
    expect(themePresets.length).toBeGreaterThan(0)
    for (const preset of themePresets) {
      expect(preset.name).toMatch(/^[a-z]+$/)
      expect(preset.label.length).toBeGreaterThan(0)
    }
  })

  it('has unique preset names', () => {
    const names = themePresets.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('applies a palette as data-palette via the provider wrapper', () => {
    const { container } = render(
      <ThemeProvider defaultPalette="aurora">
        <span>hi</span>
      </ThemeProvider>,
    )
    expect(container.querySelector('.lk-root')).toHaveAttribute('data-palette', 'aurora')
  })

  it('keeps mode and palette as independent axes', () => {
    const { container } = render(
      <ThemeProvider defaultMode="dark" defaultPalette="aurora">
        <span>hi</span>
      </ThemeProvider>,
    )
    const root = container.querySelector('.lk-root')
    expect(root).toHaveAttribute('data-theme', 'dark')
    expect(root).toHaveAttribute('data-palette', 'aurora')
  })

  it('omits data-palette when no palette is set (default theme)', () => {
    const { container } = render(
      <ThemeProvider defaultMode="light">
        <span>hi</span>
      </ThemeProvider>,
    )
    expect(container.querySelector('.lk-root')).not.toHaveAttribute('data-palette')
  })
})
