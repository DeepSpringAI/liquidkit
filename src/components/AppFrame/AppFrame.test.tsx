import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppFrame } from '@hamidrezazargham/liquidkit'

/** jsdom answers every media query with `matches: false` unless told otherwise. */
function matchMedia(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

describe('AppFrame', () => {
  it('frames a sidebar and a work area, and locks the document', () => {
    matchMedia(true)
    const { unmount } = render(<AppFrame sidebar={<nav>furniture</nav>}>work</AppFrame>)

    expect(screen.getByText('furniture')).toBeInTheDocument()
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('lk-frame-locked')

    // The lock is the frame's, and it goes when the frame does.
    unmount()
    expect(document.documentElement).not.toHaveClass('lk-frame-locked')
  })

  it('leaves the document alone when asked not to lock it', () => {
    matchMedia(true)
    render(
      <AppFrame lockDocument={false} sidebar={<nav>furniture</nav>}>
        work
      </AppFrame>,
    )
    expect(document.documentElement).not.toHaveClass('lk-frame-locked')
  })

  it('refuses to render a squeezed frame below the minimum width', () => {
    matchMedia(false)
    render(
      <AppFrame sidebar={<nav>furniture</nav>} belowMinWidth={<p>too narrow</p>}>
        work
      </AppFrame>,
    )

    expect(screen.getByText('too narrow')).toBeInTheDocument()
    expect(screen.queryByText('work')).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveClass('lk-frame-locked')
  })

  it('has a notice of its own when the app supplies none', () => {
    matchMedia(false)
    render(<AppFrame sidebar={<nav>furniture</nav>}>work</AppFrame>)
    expect(screen.getByText('Best viewed on desktop')).toBeInTheDocument()
  })
})
