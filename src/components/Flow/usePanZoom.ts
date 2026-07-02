import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react'
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
  /** Zoom by a multiplicative factor about the viewport center. */
  zoomBy: (factor: number, viewport: { width: number; height: number }) => void
  /** Whether a pan gesture is currently active (for cursor styling). */
  panning: boolean
  /** Spread onto the canvas viewport element. */
  handlers: {
    onPointerDown: (e: ReactPointerEvent) => void
    onPointerMove: (e: ReactPointerEvent) => void
    onPointerUp: (e: ReactPointerEvent) => void
    onPointerCancel: (e: ReactPointerEvent) => void
    onWheel: (e: ReactWheelEvent) => void
  }
}

/**
 * Two-axis pan (drag empty canvas) + wheel zoom about the cursor, clamped to
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
    // Only pan from the canvas surface itself (nodes stop propagation), primary button.
    if ((e.button ?? 0) !== 0 || e.currentTarget !== e.target) return
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
  const onWheel = (e: ReactWheelEvent) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    setTransform((t) => {
      const zoom = clamp(t.zoom * Math.exp(-e.deltaY * 0.0015), minZoom, maxZoom)
      const scale = zoom / t.zoom
      // Keep the world point under the cursor fixed while zooming.
      return { x: px - (px - t.x) * scale, y: py - (py - t.y) * scale, zoom }
    })
  }
  const zoomBy = (factor: number, viewport: { width: number; height: number }) => {
    const px = viewport.width / 2
    const py = viewport.height / 2
    setTransform((t) => {
      const zoom = clamp(t.zoom * factor, minZoom, maxZoom)
      const scale = zoom / t.zoom
      return { x: px - (px - t.x) * scale, y: py - (py - t.y) * scale, zoom }
    })
  }

  return {
    transform,
    setTransform,
    zoomBy,
    panning,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPan,
      onPointerCancel: endPan,
      onWheel,
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
