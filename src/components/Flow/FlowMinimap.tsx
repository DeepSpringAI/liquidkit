import { useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import { useFlow } from './FlowContext'
import type { NodeBounds } from './types'
import './FlowMinimap.css'

export type FlowMinimapPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

export interface FlowMinimapProps {
  /** Corner to pin to. @default 'bottom-right' */
  position?: FlowMinimapPosition
  width?: number
  height?: number
  className?: string
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function graphBounds(list: NodeBounds[]): NodeBounds | null {
  if (list.length === 0) return null
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const b of list) {
    minX = Math.min(minX, b.x)
    minY = Math.min(minY, b.y)
    maxX = Math.max(maxX, b.x + b.width)
    maxY = Math.max(maxY, b.y + b.height)
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

/**
 * A scaled overview of the canvas. The current view is drawn as a rectangle that
 * is always kept fully inside the minimap; drag it to pan and scroll/pinch over
 * it to zoom.
 */
export function FlowMinimap({
  position = 'bottom-right',
  width = 160,
  height = 104,
  className,
}: FlowMinimapProps) {
  const { nodeBounds, transform, viewport, centerOn, zoomBy } = useFlow()
  const dragging = useRef(false)

  // Bind a native, non-passive wheel listener via a callback ref so it survives
  // the minimap mounting after nodes appear, and can preventDefault the page scroll.
  const zoomByRef = useRef(zoomBy)
  zoomByRef.current = zoomBy
  const wheelCleanup = useRef<(() => void) | null>(null)
  const svgRef = useCallback((node: SVGSVGElement | null) => {
    wheelCleanup.current?.()
    wheelCleanup.current = null
    if (!node) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomByRef.current(Math.exp(-e.deltaY * 0.0015))
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    wheelCleanup.current = () => node.removeEventListener('wheel', onWheel)
  }, [])

  const nodes = Object.values(nodeBounds)
  const world = graphBounds(nodes)
  if (!world) return null

  const pad = 40
  const wx = world.x - pad
  const wy = world.y - pad
  const ww = world.width + pad * 2
  const wh = world.height + pad * 2
  const scale = Math.min(width / ww, height / wh)
  const ox = (width - ww * scale) / 2
  const oy = (height - wh * scale) / 2

  const toMap = (x: number, y: number) => ({ x: ox + (x - wx) * scale, y: oy + (y - wy) * scale })

  // Current view region in world space, projected + clamped to the minimap so all
  // four edges of the "view window" stay visible even when zoomed out.
  const viewW = viewport.width / transform.zoom
  const viewH = viewport.height / transform.zoom
  const vp = toMap(-transform.x / transform.zoom, -transform.y / transform.zoom)
  const vx0 = clamp(vp.x, 0, width)
  const vy0 = clamp(vp.y, 0, height)
  const vx1 = clamp(vp.x + viewW * scale, 0, width)
  const vy1 = clamp(vp.y + viewH * scale, 0, height)

  const posToWorld = (e: ReactPointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    return { x: wx + (mx - ox) / scale, y: wy + (my - oy) / scale }
  }
  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if ((e.button ?? 0) !== 0) return
    dragging.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const p = posToWorld(e)
    centerOn(p.x, p.y)
  }
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return
    const p = posToWorld(e)
    centerOn(p.x, p.y)
  }
  const onPointerUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    dragging.current = false
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      /* already released */
    }
  }

  return (
    <LiquidGlass
      radius={12}
      elevation={2}
      className={cx('lk-flow-minimap', `lk-flow-minimap--${position}`, className)}
    >
      <svg
        ref={svgRef}
        className="lk-flow-minimap__svg"
        width={width}
        height={height}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {nodes.map((b, i) => {
          const p = toMap(b.x, b.y)
          return (
            <rect
              key={i}
              className="lk-flow-minimap__node"
              x={p.x}
              y={p.y}
              width={Math.max(2, b.width * scale)}
              height={Math.max(2, b.height * scale)}
              rx={1.5}
            />
          )
        })}
        <rect
          className="lk-flow-minimap__view"
          x={vx0}
          y={vy0}
          width={Math.max(0, vx1 - vx0)}
          height={Math.max(0, vy1 - vy0)}
          rx={3}
        />
      </svg>
    </LiquidGlass>
  )
}
