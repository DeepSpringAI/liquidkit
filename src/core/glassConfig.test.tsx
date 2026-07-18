import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  GlassConfigProvider,
  useGlassConfig,
  resolveGlassTier,
  DEFAULT_GLASS_CONFIG,
} from './glassConfig'

function Probe() {
  const c = useGlassConfig()
  return <div data-testid="cfg">{`${c.performance}|${c.pauseOffscreen}|${String(c.glass)}`}</div>
}

describe('resolveGlassTier', () => {
  it('high is the identity — the default path is unchanged', () => {
    expect(resolveGlassTier('high', 46, 2)).toEqual({ scale: 46, dispersion: 2, blurScale: 1 })
  })

  it('balanced drops dispersion to the single-pass branch, keeps frost', () => {
    expect(resolveGlassTier('balanced', 46, 2)).toEqual({ scale: 46, dispersion: 0, blurScale: 1 })
  })

  it('low reduces refraction, dispersion and blur', () => {
    const r = resolveGlassTier('low', 46, 2)
    expect(r.dispersion).toBe(0)
    expect(r.scale).toBeLessThan(46)
    expect(r.blurScale).toBeLessThan(1)
  })
})

describe('useGlassConfig', () => {
  it('returns full-fidelity defaults with no provider (never throws)', () => {
    render(<Probe />)
    expect(screen.getByTestId('cfg')).toHaveTextContent('high|true|undefined')
  })

  it('reflects provider overrides', () => {
    render(
      <GlassConfigProvider performance="low" pauseOffscreen={false} glass={false}>
        <Probe />
      </GlassConfigProvider>,
    )
    expect(screen.getByTestId('cfg')).toHaveTextContent('low|false|false')
  })
})

describe('DEFAULT_GLASS_CONFIG', () => {
  it('is full fidelity with off-screen pausing on', () => {
    expect(DEFAULT_GLASS_CONFIG).toEqual({ performance: 'high', pauseOffscreen: true })
  })
})
