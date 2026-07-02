import type { MouseEvent as ReactMouseEvent } from 'react'
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

/** A scaled overview of the canvas with a draggable viewport indicator. */
export function FlowMinimap({
  position = 'bottom-right',
  width = 200,
  height = 140,
  className,
}: FlowMinimapProps) {
  const { nodeBounds, transform, viewport, centerOn } = useFlow()
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

  // Visible world region → minimap rect.
  const viewW = viewport.width / transform.zoom
  const viewH = viewport.height / transform.zoom
  const viewX = -transform.x / transform.zoom
  const viewY = -transform.y / transform.zoom
  const vp = toMap(viewX, viewY)

  const recenter = (e: ReactMouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    centerOn(wx + (mx - ox) / scale, wy + (my - oy) / scale)
  }

  return (
    <LiquidGlass
      radius={14}
      elevation={2}
      className={cx('lk-flow-minimap', `lk-flow-minimap--${position}`, className)}
    >
      <svg
        className="lk-flow-minimap__svg"
        width={width}
        height={height}
        onPointerDown={recenter}
        onClick={recenter}
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
              rx={2}
            />
          )
        })}
        <rect
          className="lk-flow-minimap__view"
          x={vp.x}
          y={vp.y}
          width={viewW * scale}
          height={viewH * scale}
          rx={3}
        />
      </svg>
    </LiquidGlass>
  )
}
