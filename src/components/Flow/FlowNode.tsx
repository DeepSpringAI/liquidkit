import { forwardRef, useRef } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import { FlowPort } from './FlowPort'
import { nodeBounds, type FlowNodeData } from './types'

export interface FlowNodeProps {
  node: FlowNodeData
  /** Current canvas zoom, so screen drag deltas map to world units. @default 1 */
  zoom?: number
  selected?: boolean
  /** Enable pointer dragging to reposition. @default false */
  draggable?: boolean
  onSelect?: (id: string) => void
  onPositionChange?: (id: string, x: number, y: number) => void
  onContextMenu?: (node: FlowNodeData, e: ReactPointerEvent | MouseEvent) => void
  className?: string
  style?: CSSProperties
}

const MOVE_THRESHOLD = 3

/**
 * A glass workflow node. `card` renders a rounded surface with icon, title,
 * subtitle and an optional badge; `hub` renders a circular glowing core node.
 * Positioned absolutely at its world coordinates so it composes with FlowCanvas.
 */
export const FlowNode = forwardRef<HTMLDivElement, FlowNodeProps>(function FlowNode(
  {
    node,
    zoom = 1,
    selected = false,
    draggable = false,
    onSelect,
    onPositionChange,
    onContextMenu,
    className,
    style,
  },
  ref,
) {
  const b = nodeBounds(node)
  const variant = node.variant ?? 'card'
  const ports = node.ports ?? ['left', 'right']
  const isSelected = selected || node.selected
  const accent = node.accent ?? 'var(--lk-accent)'

  const drag = useRef<{
    startX: number
    startY: number
    ox: number
    oy: number
    moved: boolean
  } | null>(null)

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.button ?? 0) !== 0) return
    // Keep the canvas from starting a pan when a node is grabbed.
    e.stopPropagation()
    if (draggable) {
      drag.current = { startX: e.clientX, startY: e.clientY, ox: node.x, oy: node.y, moved: false }
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const dstate = drag.current
    if (!dstate) return
    const dx = (e.clientX - dstate.startX) / zoom
    const dy = (e.clientY - dstate.startY) / zoom
    if (!dstate.moved && Math.hypot(dx * zoom, dy * zoom) > MOVE_THRESHOLD) dstate.moved = true
    if (dstate.moved) onPositionChange?.(node.id, dstate.ox + dx, dstate.oy + dy)
  }
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const dstate = drag.current
    drag.current = null
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      /* already released */
    }
    if (!dstate || !dstate.moved) onSelect?.(node.id)
  }
  const handleContextMenu = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!onContextMenu) return
    e.preventDefault()
    e.stopPropagation()
    onContextMenu(node, e)
  }

  const positioned: CSSProperties = {
    position: 'absolute',
    left: b.x,
    top: b.y,
    width: b.width,
    height: b.height,
    ['--lk-flow-node-accent' as string]: accent,
    ...style,
  }

  const body =
    variant === 'hub' ? (
      <span className="lk-flow-node__hub">
        {node.icon != null && <span className="lk-flow-node__hub-icon">{node.icon}</span>}
      </span>
    ) : (
      <>
        {node.icon != null && <span className="lk-flow-node__icon">{node.icon}</span>}
        <span className="lk-flow-node__text">
          <span className="lk-flow-node__title">{node.title}</span>
          {node.subtitle != null && <span className="lk-flow-node__subtitle">{node.subtitle}</span>}
        </span>
        {node.badge != null && <span className="lk-flow-node__badge">{node.badge}</span>}
      </>
    )

  return (
    <div
      ref={ref}
      className={cx(
        'lk-flow-node',
        `lk-flow-node--${variant}`,
        isSelected && 'is-selected',
        draggable && 'is-draggable',
        node.status && `is-${node.status}`,
        className,
      )}
      style={positioned}
      data-node-id={node.id}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={handleContextMenu}
      role="button"
      tabIndex={0}
    >
      <LiquidGlass
        radius={variant === 'hub' ? 999 : 18}
        pill={variant === 'hub'}
        elevation={isSelected ? 3 : 2}
        interactive
        className="lk-flow-node__surface"
      >
        <span className="lk-flow-node__inner">{body}</span>
      </LiquidGlass>

      {node.status && node.status !== 'idle' && (
        <span className="lk-flow-node__status" aria-hidden="true" />
      )}

      {ports.map((side) => (
        <FlowPort key={side} side={side} />
      ))}
    </div>
  )
})
