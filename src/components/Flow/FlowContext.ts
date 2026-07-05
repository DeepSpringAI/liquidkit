import { createContext, useContext } from 'react'
import type { FlowTransform, NodeBounds } from './types'

export interface FlowContextValue {
  transform: FlowTransform
  /** Resolved bounds (world space) for every rendered node, keyed by id. */
  nodeBounds: Record<string, NodeBounds>
  /** Live viewport size in px. */
  viewport: { width: number; height: number }
  /** Zoom about the viewport center by a multiplicative factor. */
  zoomBy: (factor: number) => void
  /** Fit all nodes into view. */
  fitView: () => void
  /** Recenter the viewport on a world point (used by the minimap). */
  centerOn: (worldX: number, worldY: number) => void
}

export const FlowContext = createContext<FlowContextValue | null>(null)

/** Access the enclosing FlowCanvas state. Throws outside a canvas. */
export function useFlow(): FlowContextValue {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('Flow components must be rendered inside a <FlowCanvas>.')
  return ctx
}
