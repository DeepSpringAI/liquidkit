import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { Sidebar, useSidebarState } from '@hamidrezazargham/liquidkit'

const SECTIONS = [
  {
    title: 'Recents',
    items: [
      { id: 'chat', label: 'Chat', href: '/chat' },
      { id: 'files', label: 'Files', href: '/files' },
    ],
  },
]

function Resizable() {
  const sidebar = useSidebarState({ defaultWidth: 300, minWidth: 272, maxWidth: 460 })
  return (
    <>
      <p>{`width: ${sidebar.width}`}</p>
      <Sidebar sections={SECTIONS} {...sidebar.props} />
    </>
  )
}

/** A pointer gesture on the edge strip, in one call. */
function dragEdge(travel: number) {
  const edge = screen.getByRole('button', { name: 'Resize sidebar' })
  fireEvent.pointerDown(edge, { button: 0, clientX: 500, pointerId: 1 })
  fireEvent.pointerMove(edge, { clientX: 500 + travel, pointerId: 1 })
  fireEvent.pointerUp(edge, { clientX: 500 + travel, pointerId: 1 })
}

describe('Sidebar collapse and resize', () => {
  it('shows no edge strip until it is given something to do', () => {
    render(<Sidebar sections={SECTIONS} />)
    expect(screen.queryByRole('button', { name: 'Resize sidebar' })).not.toBeInTheDocument()
  })

  it('collapses on a click that did not travel, and resizes on one that did', () => {
    render(<Resizable />)

    dragEdge(80)
    expect(screen.getByText('width: 380')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resize sidebar' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    dragEdge(1)
    expect(screen.getByRole('button', { name: 'Resize sidebar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('clamps a drag to the range it was given', () => {
    render(<Resizable />)
    dragEdge(400)
    expect(screen.getByText('width: 460')).toBeInTheDocument()
  })

  it('resizes from the keyboard, and toggles on a keyboard activation', () => {
    render(<Resizable />)
    const edge = screen.getByRole('button', { name: 'Resize sidebar' })

    fireEvent.keyDown(edge, { key: 'ArrowRight' })
    expect(screen.getByText('width: 316')).toBeInTheDocument()

    // detail: 0 is what a keyboard-generated click looks like.
    fireEvent.click(edge, { detail: 0 })
    expect(edge).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps the same DOM when collapsed, labels and all', () => {
    function Collapsible() {
      const [collapsed, setCollapsed] = useState(false)
      return (
        <Sidebar
          sections={SECTIONS}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
        />
      )
    }
    const { container } = render(<Collapsible />)
    const before = container.querySelectorAll('.lk-sidebar__item').length

    fireEvent.click(screen.getByRole('button', { name: 'Resize sidebar' }), { detail: 0 })

    expect(container.querySelector('.lk-sidebar')).toHaveClass('is-collapsed')
    expect(container.querySelectorAll('.lk-sidebar__item')).toHaveLength(before)
    // Still nameable: the label is hidden by CSS, not taken out of the tree.
    expect(screen.getByRole('link', { name: 'Files' })).toBeInTheDocument()
  })

  it('carries a density class so a desktop app can ask for the looser ladder', () => {
    const { container } = render(<Sidebar sections={SECTIONS} density="comfortable" />)
    expect(container.querySelector('.lk-sidebar')).toHaveClass('lk-sidebar--comfortable')
  })
})

describe('useSidebarState', () => {
  it('remembers the width and the collapsed flag', () => {
    const key = 'lk-test-sidebar'
    localStorage.clear()

    const first = renderHook(() => useSidebarState({ storageKey: key }))
    act(() => first.result.current.setWidth(420))
    act(() => first.result.current.toggle())
    first.unmount()

    const second = renderHook(() => useSidebarState({ storageKey: key }))
    expect(second.result.current.width).toBe(420)
    expect(second.result.current.collapsed).toBe(true)
  })

  it('clamps what it reads back, so a stale width cannot outlive its range', () => {
    const key = 'lk-test-sidebar-stale'
    localStorage.setItem(key, JSON.stringify({ width: 9000, collapsed: false }))

    const { result } = renderHook(() => useSidebarState({ storageKey: key, maxWidth: 460 }))
    expect(result.current.width).toBe(460)
  })

  it('survives a store that refuses to answer', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    const { result } = renderHook(() => useSidebarState({ storageKey: 'lk-test-denied' }))
    expect(result.current.width).toBe(272)
    getItem.mockRestore()
  })
})

describe('a list of rows', () => {
  const CONVERSATIONS = [
    {
      id: 'c-1',
      label: 'What is our expense policy?',
      busy: true,
      trailing: (
        <button type="button" aria-label="Delete this conversation">
          ×
        </button>
      ),
    },
    { id: 'c-2', label: 'Q3 revenue by region', unread: true },
  ]

  it('keeps a row affordance out of the row it belongs to', () => {
    render(<Sidebar sections={[{ title: 'Recents', items: CONVERSATIONS, dense: true }]} />)

    const affordance = screen.getByRole('button', { name: 'Delete this conversation' })
    const row = screen.getByRole('button', { name: 'What is our expense policy?' })
    expect(row).not.toContainElement(affordance)
  })

  it('says which row is still working, and which finished unseen', () => {
    const { container } = render(
      <Sidebar sections={[{ title: 'Recents', items: CONVERSATIONS, dense: true }]} />,
    )

    expect(screen.getByRole('button', { name: 'What is our expense policy?' })).toHaveClass(
      'is-busy',
    )
    expect(screen.getByRole('button', { name: 'Q3 revenue by region' })).not.toHaveClass('is-busy')
    expect(container.querySelectorAll('.lk-sidebar__unread')).toHaveLength(1)
  })
})
