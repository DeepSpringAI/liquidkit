import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { FlowTransform, NodeBounds } from './types'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

export interface PanZoomOptions {
  minZoom?: number
  maxZoom?: number
  defaultTransform?: FlowTransform
}

export interface PanZoomApi {
  transform: FlowTransform
  setTransform: (t: FlowTransform | ((prev: FlowTransform) => FlowTransform)) => void
  /** Zoom by a multiplicative factor, keeping the point (px,py) in viewport space fixed. */
  zoomAtPoint: (px: number, py: number, factor: number) => void
  /** Zoom by a multiplicative factor about the viewport center. */
  zoomBy: (factor: number, viewport: { width: number; height: number }) => void
  /** Whether a pan gesture is currently active (for cursor styling). */
  panning: boolean
  /** Spread onto the canvas viewport element. Wheel is bound natively by FlowCanvas. */
  handlers: {
    onPointerDown: (e: ReactPointerEvent) => void
    onPointerMove: (e: ReactPointerEvent) => void
    onPointerUp: (e: ReactPointerEvent) => void
    onPointerCancel: (e: ReactPointerEvent) => void
  }
}

/**
 * Two-axis pan (drag the canvas) + cursor-anchored zoom, clamped to
 * `[minZoom, maxZoom]`. Screen = world · zoom + {x, y}. Built on the
 * pointer-capture drag pattern used by Sheet.
 */
export function usePanZoom(opts: PanZoomOptions = {}): PanZoomApi {
  const { minZoom = 0.3, maxZoom = 2.5, defaultTransform } = opts
  const [transform, setTransform] = useState<FlowTransform>(
    defaultTransform ?? { x: 0, y: 0, zoom: 1 },
  )
  const [panning, setPanning] = useState(false)
  const pan = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null)

  const onPointerDown = (e: ReactPointerEvent) => {
    // Pan on primary button from anywhere on the canvas EXCEPT the overlay (controls /
    // minimap). Nodes call stopPropagation, so a node press never reaches here.
    const el = e.target as Element | null
    if ((e.button ?? 0) !== 0 || el?.closest?.('.lk-flow__overlay')) return
    pan.current = { startX: e.clientX, startY: e.clientY, ox: transform.x, oy: transform.y }
    setPanning(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    const p = pan.current
    if (!p) return
    setTransform((t) => ({
      ...t,
      x: p.ox + (e.clientX - p.startX),
      y: p.oy + (e.clientY - p.startY),
    }))
  }
  const endPan = (e: ReactPointerEvent) => {
    if (!pan.current) return
    pan.current = null
    setPanning(false)
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      /* pointer may already be released */
    }
  }
  const zoomAtPoint = (px: number, py: number, factor: number) => {
    setTransform((t) => {
      const zoom = clamp(t.zoom * factor, minZoom, maxZoom)
      const scale = zoom / t.zoom
      // Keep the world point under (px,py) fixed while zooming.
      return { x: px - (px - t.x) * scale, y: py - (py - t.y) * scale, zoom }
    })
  }
  const zoomBy = (factor: number, viewport: { width: number; height: number }) =>
    zoomAtPoint(viewport.width / 2, viewport.height / 2, factor)

  return {
    transform,
    setTransform,
    zoomAtPoint,
    zoomBy,
    panning,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPan,
      onPointerCancel: endPan,
    },
  }
}

/**
 * Compute the transform that fits `bounds` into a viewport with padding,
 * clamped to the zoom range. Returns the identity-ish default when there is
 * nothing to fit.
 */
export function computeFitTransform(
  bounds: NodeBounds | null,
  viewport: { width: number; height: number },
  opts: { padding?: number; minZoom?: number; maxZoom?: number } = {},
): FlowTransform {
  const { padding = 48, minZoom = 0.3, maxZoom = 2.5 } = opts
  if (!bounds || bounds.width <= 0 || bounds.height <= 0 || viewport.width <= 0) {
    return { x: 0, y: 0, zoom: 1 }
  }
  const zoom = clamp(
    Math.min(
      (viewport.width - padding * 2) / bounds.width,
      (viewport.height - padding * 2) / bounds.height,
    ),
    minZoom,
    maxZoom,
  )
  const cx = bounds.x + bounds.width / 2
  const cy = bounds.y + bounds.height / 2
  return {
    x: viewport.width / 2 - cx * zoom,
    y: viewport.height / 2 - cy * zoom,
    zoom,
  }
}
