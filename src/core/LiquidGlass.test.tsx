import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { LiquidGlass } from './LiquidGlass'
import { GlassConfigProvider } from './glassConfig'
import { __resetDeprecationWarnings } from '../utils/deprecate'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { IconButton } from '../components/Button/IconButton'

/* A controllable IntersectionObserver: the surface creates one shared instance,
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

const frostLayer = (root: ParentNode = document) =>
  root.querySelector('.lk-glass__refraction') as HTMLElement

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

describe('LiquidGlass frost', () => {
  it('applies blur, saturate and brightness — and no SVG filter', () => {
    const { container } = render(<LiquidGlass>hi</LiquidGlass>)
    const backdrop = frostLayer(container).style.backdropFilter
    expect(backdrop).toContain('blur(')
    expect(backdrop).toContain('saturate(')
    expect(backdrop).toContain('brightness(')
    // The displacement engine is gone; nothing may reference url(#…) any more.
    expect(backdrop).not.toContain('url(')
  })

  it('never injects a filter definition into the document', () => {
    render(<LiquidGlass>hi</LiquidGlass>)
    expect(document.querySelectorAll('filter')).toHaveLength(0)
    expect(document.querySelector('[data-lk-glass-defs]')).toBeNull()
  })

  it('honours an explicit blur override', () => {
    const { container } = render(<LiquidGlass blur={30}>hi</LiquidGlass>)
    expect(frostLayer(container).style.backdropFilter).toContain('blur(30px)')
  })

  it('softens the blur at the low performance tier', () => {
    const { container } = render(
      <GlassConfigProvider performance="low">
        <LiquidGlass blur={20}>hi</LiquidGlass>
      </GlassConfigProvider>,
    )
    expect(frostLayer(container).style.backdropFilter).toContain('calc(20px * 0.75)')
  })
})

describe('LiquidGlass off-screen pausing', () => {
  it('drops the backdrop-filter entirely when scrolled out of view', () => {
    const { container } = render(<LiquidGlass>hi</LiquidGlass>)
    const root = container.querySelector('.lk-glass') as HTMLElement

    expect(frostLayer(container).style.backdropFilter).toContain('blur(')

    // Off screen → the whole backdrop-filter goes, freeing the GPU texture.
    setIntersecting(root, false)
    expect(frostLayer(container).style.backdropFilter).toBe('none')

    setIntersecting(root, true)
    expect(frostLayer(container).style.backdropFilter).toContain('blur(')
  })
})

describe('LiquidGlass ref stability', () => {
  // Regression: the callback ref was built inline with mergeRefs(...), so it changed identity on
  // every render. React then detached and re-attached it each time — and any re-render fed the
  // next, which could spin into "Maximum update depth exceeded" (e.g. opening a second Menu flyout).
  it('does not re-attach its ref on re-render', () => {
    // React re-runs a callback ref (null, then the node) whenever its identity
    // changes. Counting calls on a *stable* forwarded ref therefore detects the
    // churn directly: one attach, and nothing more across re-renders.
    const calls: (HTMLElement | null)[] = []
    const countingRef = (node: HTMLElement | null) => {
      calls.push(node)
    }

    const { rerender } = render(<LiquidGlass ref={countingRef}>hi</LiquidGlass>)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toBeInstanceOf(HTMLElement)

    rerender(<LiquidGlass ref={countingRef}>hello</LiquidGlass>)
    rerender(<LiquidGlass ref={countingRef}>hello again</LiquidGlass>)

    expect(calls).toHaveLength(1)
  })
})

/**
 * Regression guard: a child with a non-normal `mix-blend-mode` turns `.lk-glass`
 * into an isolated group, which makes it a *backdrop root* — and every
 * `backdrop-filter` inside it then filters an empty backdrop, so the frost
 * silently disappears. jsdom doesn't composite, so assert on the stylesheet.
 */
describe('LiquidGlass stylesheet', () => {
  it('never blends a glass sub-layer (it would kill every backdrop-filter inside)', () => {
    const css = readFileSync(resolve(__dirname, 'LiquidGlass.css'), 'utf8')
    expect(css).not.toMatch(/mix-blend-mode\s*:\s*(?!normal)[a-z-]+/)
  })
})

/**
 * The displacement props stay accepted-but-ignored for one deprecation cycle so
 * existing apps keep compiling. They must not reach the DOM, and they must say
 * so once in development.
 */
describe('removed displacement props', () => {
  afterEach(() => {
    __resetDeprecationWarnings()
    vi.restoreAllMocks()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      RECT as unknown as DOMRect,
    )
  })

  it('accepts them, ignores them, and never leaks them as DOM attributes', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(
      <LiquidGlass refraction={90} dispersion={14} bezel={40} glass={false}>
        hi
      </LiquidGlass>,
    )
    const root = container.querySelector('.lk-glass') as HTMLElement
    for (const attr of ['refraction', 'dispersion', 'bezel', 'glass']) {
      expect(root.hasAttribute(attr)).toBe(false)
    }
    // glass={false} used to mean "frosted fallback" — frost is all there is now.
    expect(frostLayer(container).style.backdropFilter).toContain('blur(')
  })

  it('warns once in development, not once per surface', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <div>
        <LiquidGlass refraction={90}>a</LiquidGlass>
        <LiquidGlass dispersion={4}>b</LiquidGlass>
      </div>,
    )
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toMatch(/no longer do anything/i)
  })

  it('stays quiet when nobody passes them', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<LiquidGlass>hi</LiquidGlass>)
    expect(warn).not.toHaveBeenCalled()
  })
})
