import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useSize } from './useSize'

let roCb: ResizeObserverCallback | null = null
class FakeResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    roCb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function emitResize(width: number, height: number) {
  const entry = { contentRect: { width, height } } as unknown as ResizeObserverEntry
  act(() => {
    roCb?.([entry], {} as ResizeObserver)
  })
}

beforeEach(() => {
  roCb = null
  vi.stubGlobal('ResizeObserver', FakeResizeObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function Probe() {
  const [size, ref] = useSize<HTMLDivElement>()
  return (
    <div ref={ref} data-testid="box" data-size={size ? `${size.width}x${size.height}` : 'none'} />
  )
}

describe('useSize', () => {
  it('reports the observed size synchronously from the ResizeObserver', () => {
    render(<Probe />)
    emitResize(100, 50)
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('100x50')
    emitResize(140, 60)
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('140x60')
  })

  it('ignores ±1px jitter (the dead-band guards the resize→setState loop)', () => {
    render(<Probe />)
    emitResize(100, 50)
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('100x50')
    emitResize(101, 50) // within the dead-band
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('100x50')
  })
})
