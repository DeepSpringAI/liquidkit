import { describe, it, expect } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Menu, ThemeProvider } from '@hamidrezazargham/liquidkit'
import type { MenuItem } from '@hamidrezazargham/liquidkit'

const items: MenuItem[] = [
  { id: 'plain', label: 'Plain' },
  { divider: true },
  {
    id: 'reasoning',
    label: 'Reasoning',
    submenu: [
      { id: 'low', label: 'Low' },
      { id: 'high', label: 'High' },
    ],
  },
  {
    id: 'mode',
    label: 'Mode',
    submenu: [
      { id: 'work', label: 'Work' },
      { id: 'plan', label: 'Plan' },
    ],
  },
]

const openMenu = () => {
  render(
    <ThemeProvider>
      <Menu trigger={<button type="button">open</button>} items={items} />
    </ThemeProvider>,
  )
  fireEvent.click(screen.getByText('open'))
}

describe('Menu flyouts', () => {
  // Regression: opening a SECOND flyout used to blow the render budget ("Maximum update depth
  // exceeded"). The positioner re-ran from a capture-phase scroll listener and always handed React a
  // brand-new style object, so it could never bail out.
  it('switches between two submenus', () => {
    openMenu()

    fireEvent.click(screen.getByText('Reasoning'))
    expect(screen.getByText('High')).toBeTruthy()

    fireEvent.click(screen.getByText('Mode'))
    expect(screen.getByText('Plan')).toBeTruthy()
    // The first flyout's items are gone — only one flyout is open at a time.
    expect(screen.queryByText('High')).toBeNull()
  })

  it('survives repeated scrolls while a flyout is open', () => {
    openMenu()
    fireEvent.click(screen.getByText('Reasoning'))

    // Each scroll re-runs the positioner; with an unchanged position it must be a no-op rather than
    // another state update.
    act(() => {
      for (let i = 0; i < 50; i += 1) window.dispatchEvent(new Event('scroll'))
    })

    expect(screen.getByText('High')).toBeTruthy()
  })
})
