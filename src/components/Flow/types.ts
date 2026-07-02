import type { ReactNode } from 'react'

/** Which edge of a node a port/connector attaches to. */
export type FlowSide = 'top' | 'right' | 'bottom' | 'left'

/** Node run/health state — drives the status dot and glow. */
export type FlowNodeStatus = 'idle' | 'running' | 'done' | 'error'

/** Visual shape of a node. */
export type FlowNodeVariant = 'card' | 'hub'

export interface FlowNodeData {
  id: string
  /** World-space top-left, in px. */
  x: number
  y: number
  /** Overrides the variant default (card 220×76, hub 104×104). */
  width?: number
  height?: number
  /** @default 'card' */
  variant?: FlowNodeVariant
  title: ReactNode
  subtitle?: ReactNode
  /** Leading glyph (icon element). */
  icon?: ReactNode
  /** A short status/type chip rendered in the node header. */
  badge?: ReactNode
  /** Accent color for the hub ring / glow and the selected outline. */
  accent?: string
  status?: FlowNodeStatus
  /** Marks the node visually selected (in addition to canvas click selection). */
  selected?: boolean
  /** Which sides expose connection ports. @default ['left','right'] */
  ports?: FlowSide[]
  /** Arbitrary payload carried through to callbacks. */
  data?: unknown
}

export interface FlowEdgeData {
  id: string
  /** Source / target node ids. */
  source: string
  target: string
  /** Side of the source/target node the connector leaves/enters. */
  sourceSide?: FlowSide
  targetSide?: FlowSide
  /** Centered pill label (e.g. "Condition"). */
  label?: ReactNode
  /** Stroke gradient [from, to], or a single color. Defaults to the accent gradient. */
  color?: string | [string, string]
  /** Animate a flowing dash along the connector. */
  animated?: boolean
  selected?: boolean
}

/** Canvas pan/zoom transform. `x`/`y` are the screen-space pan offset in px. */
export interface FlowTransform {
  x: number
  y: number
  zoom: number
}

export interface NodeBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

/** Default node dimensions per variant. */
export const NODE_SIZE: Record<FlowNodeVariant, { width: number; height: number }> = {
  card: { width: 220, height: 76 },
  hub: { width: 104, height: 104 },
}

/** Resolve a node's bounds from its data, applying variant defaults. */
export function nodeBounds(node: FlowNodeData): NodeBounds {
  const size = NODE_SIZE[node.variant ?? 'card']
  return {
    x: node.x,
    y: node.y,
    width: node.width ?? size.width,
    height: node.height ?? size.height,
  }
}
