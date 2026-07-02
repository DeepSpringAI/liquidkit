import { NODE_SIZE, type FlowNodeData } from './types'

export interface LayoutOptions {
  /** Primary flow direction. @default 'LR' */
  direction?: 'LR' | 'TB'
  /** Gap between siblings within a layer, px. @default 32 */
  nodeGap?: number
  /** Gap between successive layers, px. @default 120 */
  layerGap?: number
  /** Cell size used for spacing. Defaults to the card node size. */
  nodeWidth?: number
  nodeHeight?: number
  /** Top-left origin of the laid-out graph, px. @default { x: 0, y: 0 } */
  origin?: { x: number; y: number }
}

interface MinEdge {
  source: string
  target: string
}

/**
 * Assign each node a layer via longest-path layering, then place nodes in a
 * balanced (centered) grid. Pure and dependency-free; cycles are tolerated
 * (the relaxation is bounded by the node count). Returns new node objects with
 * computed `x`/`y`; all other fields are preserved.
 */
export function layoutFlow<T extends FlowNodeData>(
  nodes: T[],
  edges: MinEdge[],
  opts: LayoutOptions = {},
): T[] {
  const {
    direction = 'LR',
    nodeGap = 32,
    layerGap = 120,
    nodeWidth = NODE_SIZE.card.width,
    nodeHeight = NODE_SIZE.card.height,
    origin = { x: 0, y: 0 },
  } = opts

  if (nodes.length === 0) return nodes

  const ids = new Set(nodes.map((n) => n.id))
  const relevant = edges.filter((e) => ids.has(e.source) && ids.has(e.target))

  // Longest-path layering: layer[target] = max(layer[source] + 1). Relaxed over
  // at most N passes so cyclic graphs still converge to a stable assignment.
  const layer: Record<string, number> = {}
  for (const n of nodes) layer[n.id] = 0
  for (let pass = 0; pass < nodes.length; pass++) {
    let changed = false
    for (const e of relevant) {
      const next = layer[e.source] + 1
      if (next > layer[e.target]) {
        layer[e.target] = next
        changed = true
      }
    }
    if (!changed) break
  }

  // Group nodes by layer, preserving input order within each layer.
  const layers: T[][] = []
  for (const n of nodes) {
    const l = layer[n.id]
    ;(layers[l] ||= []).push(n)
  }

  const alongStep = direction === 'LR' ? nodeHeight + nodeGap : nodeWidth + nodeGap
  const crossStep = direction === 'LR' ? nodeWidth + layerGap : nodeHeight + layerGap

  const out = new Map<string, { x: number; y: number }>()
  layers.forEach((group, layerIndex) => {
    if (!group) return
    const span = (group.length - 1) * alongStep
    group.forEach((node, i) => {
      const along = i * alongStep - span / 2
      const cross = layerIndex * crossStep
      if (direction === 'LR') {
        out.set(node.id, { x: origin.x + cross, y: origin.y + along })
      } else {
        out.set(node.id, { x: origin.x + along, y: origin.y + cross })
      }
    })
  })

  return nodes.map((n) => {
    const p = out.get(n.id)
    return p ? { ...n, x: p.x, y: p.y } : n
  })
}
