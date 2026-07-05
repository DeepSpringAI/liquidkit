import { describe, it, expect } from 'vitest'
import { layoutFlow } from 'liquidkit'
import type { FlowNodeData } from 'liquidkit'

const node = (id: string): FlowNodeData => ({ id, x: 0, y: 0, title: id })

describe('layoutFlow', () => {
  it('lays a linear chain out left-to-right in successive layers', () => {
    const nodes = [node('a'), node('b'), node('c')]
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ]
    const out = layoutFlow(nodes, edges, { direction: 'LR' })
    const by = Object.fromEntries(out.map((n) => [n.id, n]))
    expect(by.a.x).toBeLessThan(by.b.x)
    expect(by.b.x).toBeLessThan(by.c.x)
    // Single node per layer → all share the same cross-axis position.
    expect(by.a.y).toBe(by.b.y)
    expect(by.b.y).toBe(by.c.y)
  })

  it('splits siblings of a branch onto the same layer at different positions', () => {
    const nodes = [node('a'), node('b'), node('c')]
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'a', target: 'c' },
    ]
    const out = layoutFlow(nodes, edges, { direction: 'LR' })
    const by = Object.fromEntries(out.map((n) => [n.id, n]))
    // b and c are one layer past a…
    expect(by.b.x).toBe(by.c.x)
    expect(by.b.x).toBeGreaterThan(by.a.x)
    // …and stacked (centered) so they don't overlap.
    expect(by.b.y).not.toBe(by.c.y)
  })

  it('places a node at the longest path depth (diamond)', () => {
    // a → b → d and a → d : d must sit past b, not beside it.
    const nodes = [node('a'), node('b'), node('d')]
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'd' },
      { source: 'a', target: 'd' },
    ]
    const out = layoutFlow(nodes, edges, { direction: 'LR' })
    const by = Object.fromEntries(out.map((n) => [n.id, n]))
    expect(by.d.x).toBeGreaterThan(by.b.x)
  })

  it('respects TB direction and preserves other node fields', () => {
    const nodes = [node('a'), node('b')]
    const out = layoutFlow(nodes, [{ source: 'a', target: 'b' }], { direction: 'TB' })
    const by = Object.fromEntries(out.map((n) => [n.id, n]))
    expect(by.a.y).toBeLessThan(by.b.y)
    expect(by.a.title).toBe('a')
  })

  it('tolerates cycles without looping forever', () => {
    const nodes = [node('a'), node('b')]
    const out = layoutFlow(nodes, [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'a' },
    ])
    expect(out).toHaveLength(2)
  })
})
