import { describe, it, expect } from 'vitest'
import { displacementMapDataUri, glassFilterMarkup, glassFilterKey } from './displacement'

describe('displacementMapDataUri', () => {
  it('produces an svg data uri with both channel gradients', () => {
    const uri = displacementMapDataUri({ width: 120, height: 60, bezel: 12 })
    expect(uri.startsWith('data:image/svg+xml,')).toBe(true)
    const svg = decodeURIComponent(uri)
    expect(svg).toContain('linearGradient')
    expect(svg).toContain('mix-blend-mode:screen')
  })
})

describe('glassFilterMarkup', () => {
  it('emits a single displacement pass when dispersion is 0', () => {
    const m = glassFilterMarkup('id1', { width: 100, height: 100, bezel: 10, scale: 40, dispersion: 0 })
    expect(m.match(/feDisplacementMap/g)).toHaveLength(1)
    expect(m).toContain('color-interpolation-filters="sRGB"')
  })

  it('emits three displacement passes + blends for dispersion', () => {
    const m = glassFilterMarkup('id2', { width: 100, height: 100, bezel: 10, scale: 40, dispersion: 6 })
    expect(m.match(/feDisplacementMap/g)).toHaveLength(3)
    expect(m.match(/feBlend/g)).toHaveLength(2)
  })
})

describe('glassFilterKey', () => {
  it('is stable for equal params and distinct otherwise', () => {
    const a = { width: 100, height: 50, bezel: 10, scale: 40, dispersion: 5 }
    const b = { width: 100, height: 50, bezel: 10, scale: 40, dispersion: 5 }
    const c = { width: 101, height: 50, bezel: 10, scale: 40, dispersion: 5 }
    expect(glassFilterKey(a)).toBe(glassFilterKey(b))
    expect(glassFilterKey(a)).not.toBe(glassFilterKey(c))
  })
})
