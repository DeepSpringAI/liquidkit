import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Sheet, ThemeProvider } from '@hamidrezazargham/liquidkit'

// jsdom viewport is 768px tall, so the default detents resolve to:
const MEDIUM = 768 * 0.5 // 384
const LARGE = 768 * 0.92 // 706.56
// The dismiss line sits at MEDIUM * 0.6 = 230.4

/** A clock we control, so a gesture's velocity is deterministic. */
let now = 0
let clock: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  now = 0
  clock = vi.spyOn(performance, 'now').mockImplementation(() => now)
})
afterEach(() => {
  // Restore only this spy — the shared setup file installs its own global
  // mocks (matchMedia), and restoreAllMocks() would tear those down too.
  clock.mockRestore()
})

function renderSheet(props: Partial<React.ComponentProps<typeof Sheet>> = {}) {
  const onClose = vi.fn()
  render(
    <ThemeProvider>
      <Sheet open onClose={onClose} title="Details" {...props}>
        <p>Body</p>
      </Sheet>
    </ThemeProvider>,
  )
  return { onClose, panel: screen.getByRole('dialog') }
}

const grabArea = () => document.querySelector('.lk-sheet__grabarea') as HTMLElement
const panelHeight = () => (screen.getByRole('dialog') as HTMLElement).style.height

// jsdom's synthetic pointer events don't carry clientX / clientY, so build a
// plain Event with those props on it (same approach as the Flow canvas tests).
function pointer(type: string, props: Record<string, number> = {}): Event {
  const e = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(e, { pointerId: 1, ...props })
  return e
}

/**
 * Drag the grabber from the current detent to `toHeight`, taking `ms`.
 * Positive height deltas mean the sheet grew (finger moved up).
 */
function drag(toHeight: number, ms: number, from = MEDIUM) {
  const area = grabArea()
  now = 0
  fireEvent(area, pointer('pointerdown', { clientY: 500 }))
  now = ms
  // clientY decreases as the sheet grows.
  fireEvent(area, pointer('pointermove', { clientY: 500 - (toHeight - from) }))
  fireEvent(area, pointer('pointerup'))
}

describe('Sheet', () => {
  it('renders as a labelled modal dialog', () => {
    renderSheet()
    const panel = screen.getByRole('dialog')
    expect(panel).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('closes on Escape', () => {
    const { onClose } = renderSheet()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('closes when the scrim is clicked', () => {
    const { onClose } = renderSheet()
    fireEvent.click(document.querySelector('.lk-sheet__scrim') as HTMLElement)
    expect(onClose).toHaveBeenCalled()
  })

  it('ignores a tap on the grabber', () => {
    const { onClose } = renderSheet()
    const before = panelHeight()
    fireEvent(grabArea(), pointer('pointerdown', { clientY: 500 }))
    fireEvent(grabArea(), pointer('pointerup'))
    expect(onClose).not.toHaveBeenCalled()
    expect(panelHeight()).toBe(before)
  })

  it('ignores movement below the drag threshold', () => {
    const { onClose } = renderSheet()
    const before = panelHeight()
    fireEvent(grabArea(), pointer('pointerdown', { clientY: 500 }))
    fireEvent(grabArea(), pointer('pointermove', { clientY: 494 })) // 6px < 10px
    fireEvent(grabArea(), pointer('pointerup'))
    expect(onClose).not.toHaveBeenCalled()
    expect(panelHeight()).toBe(before)
  })

  it('snaps up to the larger detent when dragged past the midpoint', () => {
    renderSheet()
    drag(600, 400)
    expect(parseFloat(panelHeight())).toBeCloseTo(LARGE, 1)
  })

  it('dismisses when dragged well below the smallest detent', () => {
    const { onClose } = renderSheet()
    drag(150, 400) // 150 < 230.4
    expect(onClose).toHaveBeenCalled()
  })

  it('springs back when released slowly above the dismiss line', () => {
    const { onClose } = renderSheet()
    // Released at 250px — below the detent but above the 230.4 dismiss line —
    // and slowly enough to carry no momentum.
    drag(250, 8000)
    expect(onClose).not.toHaveBeenCalled()
    expect(parseFloat(panelHeight())).toBeCloseTo(MEDIUM, 1)
  })

  it('dismisses from the same point when the release is a fast flick', () => {
    const { onClose } = renderSheet()
    // Identical release position, but thrown — momentum carries it past the line.
    drag(250, 100)
    expect(onClose).toHaveBeenCalled()
  })

  it('resists past the tallest detent instead of stopping dead', () => {
    renderSheet()
    fireEvent(grabArea(), pointer('pointerdown', { clientY: 500 }))
    now = 100
    fireEvent(grabArea(), pointer('pointermove', { clientY: 500 - (LARGE + 200 - MEDIUM) }))
    const h = parseFloat(panelHeight())
    // It moved past the detent, but nowhere near the full 200px of overshoot.
    expect(h).toBeGreaterThan(LARGE)
    expect(h).toBeLessThan(LARGE + 200)
  })

  it('ends the gesture safely on pointer cancel', () => {
    const { onClose } = renderSheet()
    fireEvent(grabArea(), pointer('pointerdown', { clientY: 500 }))
    now = 100
    fireEvent(grabArea(), pointer('pointermove', { clientY: 400 }))
    fireEvent(grabArea(), pointer('pointercancel'))
    expect(onClose).not.toHaveBeenCalled()
    // A second cancel must not throw or re-fire the snap.
    expect(() => fireEvent(grabArea(), pointer('pointercancel'))).not.toThrow()
  })

  it('does not drag at all when the grabber is hidden', () => {
    const { onClose } = renderSheet({ grabber: false })
    expect(document.querySelector('.lk-sheet__grabber')).toBeNull()
    fireEvent(grabArea(), pointer('pointerdown', { clientY: 500 }))
    now = 100
    fireEvent(grabArea(), pointer('pointermove', { clientY: 200 }))
    fireEvent(grabArea(), pointer('pointerup'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders nothing when closed', () => {
    render(
      <ThemeProvider>
        <Sheet open={false} title="Details">
          <p>Body</p>
        </Sheet>
      </ThemeProvider>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
