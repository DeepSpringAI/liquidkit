import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FlowCanvas, FlowMinimap, ThemeProvider } from 'liquidkit'
import type { FlowNodeData } from 'liquidkit'

const nodes: FlowNodeData[] = [
  { id: 'a', x: 0, y: 0, title: 'A' },
  { id: 'b', x: 400, y: 200, title: 'B' },
]

describe('FlowMinimap', () => {
  it('renders node marks and a view rectangle clamped inside the minimap', () => {
    const W = 160
    const H = 104
    const { container } = render(
      <ThemeProvider>
        <div style={{ width: 800, height: 400 }}>
          <FlowCanvas nodes={nodes} edges={[]} fitViewOnMount={false}>
            <FlowMinimap width={W} height={H} />
          </FlowCanvas>
        </div>
      </ThemeProvider>,
    )
    expect(container.querySelectorAll('.lk-flow-minimap__node')).toHaveLength(2)

    const view = container.querySelector('.lk-flow-minimap__view') as SVGRectElement
    expect(view).toBeTruthy()
    const x = Number(view.getAttribute('x'))
    const y = Number(view.getAttribute('y'))
    const w = Number(view.getAttribute('width'))
    const h = Number(view.getAttribute('height'))
    // The view window stays fully within the minimap bounds on every edge.
    expect(x).toBeGreaterThanOrEqual(0)
    expect(y).toBeGreaterThanOrEqual(0)
    expect(w).toBeGreaterThanOrEqual(0)
    expect(h).toBeGreaterThanOrEqual(0)
    expect(x + w).toBeLessThanOrEqual(W + 0.01)
    expect(y + h).toBeLessThanOrEqual(H + 0.01)
  })
})
