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

let rafQueue: FrameRequestCallback[] = []

function emitResize(width: number, height: number) {
  const entry = { contentRect: { width, height } } as unknown as ResizeObserverEntry
  act(() => {
    roCb?.([entry], {} as ResizeObserver)
  })
}

function flushRaf() {
  const q = rafQueue
  rafQueue = []
  act(() => {
    q.forEach((cb) => cb(0))
  })
}

beforeEach(() => {
  roCb = null
  rafQueue = []
  vi.stubGlobal('ResizeObserver', FakeResizeObserver)
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => rafQueue.push(cb))
  vi.stubGlobal('cancelAnimationFrame', () => {})
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
  it('coalesces a burst of resizes into a single measure per frame', () => {
    render(<Probe />)
    // First measure is synchronous; jsdom's getBoundingClientRect is 0×0.
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('0x0')

    emitResize(100, 50)
    emitResize(120, 50)
    emitResize(140, 50)
    // Still pending — the burst was collapsed into one scheduled frame.
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('0x0')

    flushRaf()
    // Only the last size lands; the 100 and 120 intermediates were skipped.
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('140x50')
  })

  it('keeps the ±1px dead-band (guards the resize→setState loop)', () => {
    render(<Probe />)
    emitResize(100, 50)
    flushRaf()
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('100x50')

    emitResize(101, 50) // within the dead-band
    flushRaf()
    expect(screen.getByTestId('box').getAttribute('data-size')).toBe('100x50')
  })
})
