import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, act } from '@testing-library/react'
import { LiquidGlass } from './LiquidGlass'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { IconButton } from '../components/Button/IconButton'

/* A controllable IntersectionObserver: the engine creates one shared instance,
   so we capture its callback and drive intersection by hand. */
let ioCb: IntersectionObserverCallback | null = null
const observedEls = new Set<Element>()
class FakeIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    ioCb = cb
  }
  observe(el: Element) {
    observedEls.add(el)
  }
  unobserve(el: Element) {
    observedEls.delete(el)
  }
  disconnect() {
    observedEls.clear()
  }
}

function setIntersecting(el: Element, isIntersecting: boolean) {
  const entry = { target: el, isIntersecting } as unknown as IntersectionObserverEntry
  act(() => {
    ioCb?.([entry], {} as IntersectionObserver)
  })
}

const RECT = { width: 121, height: 48, top: 0, left: 0, right: 121, bottom: 48, x: 0, y: 0 }

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    RECT as unknown as DOMRect,
  )
})

afterAll(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const filterCount = () => document.querySelectorAll('[data-lk-glass-defs] filter').length

describe('LiquidGlass memoization', () => {
  it('wraps the hot components in React.memo', () => {
    const memo = Symbol.for('react.memo')
    const typeOf = (c: unknown) => (c as { $$typeof?: symbol }).$$typeof
    expect(typeOf(LiquidGlass)).toBe(memo)
    expect(typeOf(Button)).toBe(memo)
    expect(typeOf(Card)).toBe(memo)
    expect(typeOf(IconButton)).toBe(memo)
  })
})

describe('LiquidGlass off-screen pausing', () => {
  it('drops the backdrop-filter and releases the filter when scrolled out of view', () => {
    const { container } = render(<LiquidGlass>hi</LiquidGlass>)
    const root = container.querySelector('.lk-glass') as HTMLElement
    const refraction = () => container.querySelector('.lk-glass__refraction') as HTMLElement

    // On screen (optimistic default) → full glass, with the url() displacement.
    expect(refraction().style.backdropFilter).toContain('url(#lk-glass-')
    const before = filterCount()
    expect(before).toBeGreaterThan(0)

    // Off screen → the entire backdrop-filter is dropped and the filter released.
    setIntersecting(root, false)
    expect(refraction().style.backdropFilter).toBe('none')
    expect(filterCount()).toBe(before - 1)

    // Back on screen → refraction returns.
    setIntersecting(root, true)
    expect(refraction().style.backdropFilter).toContain('url(#lk-glass-')
  })
})

describe('LiquidGlass ref stability', () => {
  // Regression: the callback ref was built inline with mergeRefs(...), so it changed identity on
  // every render. React then detached and re-attached it each time, tearing down and rebuilding the
  // size ResizeObserver — and any re-render fed the next, which could spin into "Maximum update
  // depth exceeded" (e.g. opening a second Menu flyout).
  it('does not re-attach its ref (or rebuild the ResizeObserver) on re-render', () => {
    let observeCount = 0
    let disconnectCount = 0
    class CountingResizeObserver {
      observe() {
        observeCount += 1
      }
      unobserve() {}
      disconnect() {
        disconnectCount += 1
      }
    }
    vi.stubGlobal('ResizeObserver', CountingResizeObserver)

    const { rerender } = render(<LiquidGlass>hi</LiquidGlass>)
    const afterFirst = observeCount
    expect(afterFirst).toBe(1)

    // Re-render with different children/props — the element is the same, so the ref must not churn.
    rerender(<LiquidGlass>hello</LiquidGlass>)
    rerender(<LiquidGlass>hello again</LiquidGlass>)

    expect(observeCount).toBe(afterFirst)
    expect(disconnectCount).toBe(0)

    vi.unstubAllGlobals()
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  })
})

describe('LiquidGlass filter sharing', () => {
  it('draws the displacement map at the ceil-bucketed size, not the raw size', () => {
    render(<LiquidGlass>hi</LiquidGlass>)
    const feImage = document.querySelector('[data-lk-glass-defs] feImage')
    // raw 121×48 → quantize(121,8)=128, quantize(48,8)=48
    expect(feImage?.getAttribute('width')).toBe('128')
    expect(feImage?.getAttribute('height')).toBe('48')
  })

  it('shares one <filter> node across similarly-sized surfaces', () => {
    render(
      <div>
        <LiquidGlass>a</LiquidGlass>
        <LiquidGlass>b</LiquidGlass>
        <LiquidGlass>c</LiquidGlass>
      </div>,
    )
    // All three fall in the same size bucket → one ref-counted definition.
    expect(filterCount()).toBe(1)
  })
})
