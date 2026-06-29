import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { palettes, themePresets } from '../index'

const HEX = /^#[0-9A-Fa-f]{6}$/

describe('raw palettes', () => {
  it('exposes one swatch group per theme preset', () => {
    expect(Object.keys(palettes).sort()).toEqual(themePresets.map((p) => p.name).sort())
  })

  it('has well-formed hex values and no empty groups', () => {
    for (const [name, group] of Object.entries(palettes)) {
      const entries = Object.entries(group)
      expect(entries.length, name).toBeGreaterThan(0)
      for (const [swatch, hex] of entries) {
        expect(hex, `${name}.${swatch}`).toMatch(HEX)
      }
    }
  })

  it('never repeats the palette name in a swatch key', () => {
    for (const [name, group] of Object.entries(palettes)) {
      for (const key of Object.keys(group)) {
        expect(key.toLowerCase().startsWith(name), `${name}.${key}`).toBe(false)
      }
    }
  })

  it('merges the three aurora source groups into one palette', () => {
    // 6 + 5 + 6 swatches across Ice, Forest, Borealis
    expect(Object.keys(palettes.aurora).length).toBe(17)
    expect(palettes.aurora.frostCyan).toBe('#70B8C8') // Borealis
    expect(palettes.aurora.aquamarineIce).toBe('#CBEFEB') // Forest
    expect(palettes.aurora.polarMint).toBe('#8CC1B7') // Ice
  })

  it('ships a matching CSS custom property for every JS swatch', () => {
    // Hex case can differ (Prettier lowercases CSS), so compare case-insensitively.
    const css = readFileSync(resolve(__dirname, '../styles/palettes.css'), 'utf8').toLowerCase()
    const toKebab = (s: string) => s.replace(/([A-Z0-9]+)/g, (m) => '-' + m.toLowerCase())
    for (const [name, group] of Object.entries(palettes)) {
      for (const [key, hex] of Object.entries(group)) {
        const decl = `--lk-${name}-${toKebab(key)}: ${hex.toLowerCase()};`
        expect(css, decl).toContain(decl)
      }
    }
  })
})
