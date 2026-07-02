import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FlowCanvas, ThemeProvider } from 'liquidkit'
import type { FlowNodeData, FlowEdgeData, MenuItem } from 'liquidkit'

const nodes: FlowNodeData[] = [
  { id: 'a', x: 0, y: 0, title: 'Trigger' },
  { id: 'b', x: 300, y: 0, title: 'Action' },
]
const edges: FlowEdgeData[] = [{ id: 'e', source: 'a', target: 'b', label: 'Then' }]

// jsdom's synthetic pointer events don't carry button / clientX / clientY, so
// build a plain Event with those props for the pan gesture.
function pointer(type: string, props: Record<string, number>): Event {
  const e = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(e, props)
  return e
}

const renderCanvas = (props: Partial<React.ComponentProps<typeof FlowCanvas>> = {}) =>
  render(
    <ThemeProvider>
      <div style={{ width: 800, height: 400 }}>
        <FlowCanvas nodes={nodes} edges={edges} {...props} />
      </div>
    </ThemeProvider>,
  )

describe('FlowCanvas', () => {
  it('renders nodes and edges from data', () => {
    const { container } = renderCanvas()
    expect(screen.getByText('Trigger')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    // One connector path (plus its transparent hit path) per edge.
    expect(container.querySelectorAll('.lk-flow-edge__line')).toHaveLength(1)
    expect(screen.getByText('Then')).toBeInTheDocument()
  })

  it('pans when the canvas is dragged', () => {
    const { container } = renderCanvas()
    const canvas = container.querySelector('.lk-flow') as HTMLElement
    const layer = container.querySelector('.lk-flow__layer') as HTMLElement
    fireEvent(
      canvas,
      pointer('pointerdown', { button: 0, clientX: 100, clientY: 100, pointerId: 1 }),
    )
    fireEvent(canvas, pointer('pointermove', { clientX: 160, clientY: 130, pointerId: 1 }))
    expect(layer.style.transform).toContain('translate(60px, 30px)')
  })

  it('selects a node on click', () => {
    const onSelectionChange = vi.fn()
    const { container } = renderCanvas({ onSelectionChange })
    const nodeEl = container.querySelector('[data-node-id="a"]') as HTMLElement
    fireEvent.pointerDown(nodeEl, { button: 0, clientX: 10, clientY: 10, pointerId: 2 })
    fireEvent.pointerUp(nodeEl, { clientX: 10, clientY: 10, pointerId: 2 })
    expect(onSelectionChange).toHaveBeenCalledWith(['a'])
    expect(nodeEl.className).toContain('is-selected')
  })

  it('opens a context menu with shortcut hints on right-click', () => {
    const menu = (): MenuItem[] => [
      { id: 'copy', label: 'Copy link', shortcut: '⌘C' },
      { id: 'remove', label: 'Remove', destructive: true },
    ]
    const { container } = renderCanvas({ nodeContextMenu: menu })
    const nodeEl = container.querySelector('[data-node-id="a"]') as HTMLElement
    fireEvent.contextMenu(nodeEl, { clientX: 40, clientY: 40 })
    expect(screen.getByText('Copy link')).toBeInTheDocument()
    expect(screen.getByText('⌘C')).toBeInTheDocument()
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })
})
