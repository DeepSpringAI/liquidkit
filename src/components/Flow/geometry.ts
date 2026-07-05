import type { FlowSide, NodeBounds, Point } from './types'

/** The anchor point of a port on a given side of a node. */
export function nodePortPoint(b: NodeBounds, side: FlowSide): Point {
  switch (side) {
    case 'top':
      return { x: b.x + b.width / 2, y: b.y }
    case 'bottom':
      return { x: b.x + b.width / 2, y: b.y + b.height }
    case 'left':
      return { x: b.x, y: b.y + b.height / 2 }
    case 'right':
    default:
      return { x: b.x + b.width, y: b.y + b.height / 2 }
  }
}

/** Push a control point outward from a node side by `k` px. */
function tangent(p: Point, side: FlowSide, k: number): Point {
  switch (side) {
    case 'top':
      return { x: p.x, y: p.y - k }
    case 'bottom':
      return { x: p.x, y: p.y + k }
    case 'left':
      return { x: p.x - k, y: p.y }
    case 'right':
    default:
      return { x: p.x + k, y: p.y }
  }
}

/**
 * A smooth cubic-bezier connector between two points, with the control handles
 * pushed out from each node's side so the curve leaves/enters perpendicular to
 * the node edge (the n8n / React Flow "bezier" look). Single-segment cousin of
 * ChartCard's `smoothPath`.
 */
export function edgePath(
  source: Point,
  target: Point,
  sourceSide: FlowSide = 'right',
  targetSide: FlowSide = 'left',
): string {
  const dist = Math.hypot(target.x - source.x, target.y - source.y)
  const k = Math.max(40, dist * 0.4)
  const c1 = tangent(source, sourceSide, k)
  const c2 = tangent(target, targetSide, k)
  return `M ${round(source.x)} ${round(source.y)} C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(target.x)} ${round(target.y)}`
}

/** Midpoint of the connector, used to place a label pill. */
export function edgeMidpoint(source: Point, target: Point): Point {
  return { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 }
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
