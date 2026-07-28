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
    expect(resolveGlassTier('high')).toEqual({ blurScale: 1 })
  })

  it('balanced still renders the full frost', () => {
    expect(resolveGlassTier('balanced')).toEqual({ blurScale: 1 })
  })

  it('low softens the blur for weak hardware', () => {
    expect(resolveGlassTier('low').blurScale).toBeLessThan(1)
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
