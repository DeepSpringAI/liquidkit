import { forwardRef, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Sidebar.css'

export interface SidebarItem {
  id: string
  label: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  href?: string
  onClick?: () => void
}

export interface SidebarSection {
  title?: ReactNode
  items: SidebarItem[]
}

/** How much room a navigation row is given. */
export type SidebarDensity = 'compact' | 'comfortable'

/** Travel, in px, past which a drag on the edge stops counting as a click. */
const DRAG_SLOP = 3
/** How far one arrow key moves the edge. */
const KEY_STEP = 16

export interface SidebarProps {
  sections: SidebarSection[]
  activeId?: string
  onSelect?: (id: string) => void
  /** Content pinned above the nav (app title, search…). */
  header?: ReactNode
  /** Content pinned to the bottom (an account row…). */
  footer?: ReactNode
  /** @default 248 */
  width?: number
  /**
   * Collapsed to an icon rail. The same element and the same DOM — only the
   * width and the labels change, so the toggle animates and nothing jumps.
   */
  collapsed?: boolean
  /** Rail width when collapsed. @default 68 */
  collapsedWidth?: number
  /**
   * Called when the edge strip is clicked, or activated from the keyboard.
   * Providing it is what puts the strip on screen.
   */
  onToggleCollapsed?: () => void
  /** Let the edge strip be dragged to change `width`. */
  resizable?: boolean
  /** Floor for a drag. @default 248 */
  minWidth?: number
  /** Ceiling for a drag. @default 460 */
  maxWidth?: number
  /** Called with the clamped width while the edge is dragged. */
  onResize?: (width: number) => void
  /** Row density: `comfortable` is the desktop-app ladder. @default 'compact' */
  density?: SidebarDensity
  /** @default 'auto' */
  tint?: GlassTint
  /** Glass surface. Set false for an opaque sidebar. @default true */
  glass?: boolean
  /** Accessible name for the edge strip. @default 'Resize sidebar' */
  edgeLabel?: string
  className?: string
  style?: CSSProperties
}

function SidebarRow({
  item,
  active,
  onSelect,
}: {
  item: SidebarItem
  active: boolean
  onSelect?: (id: string) => void
}) {
  const className = cx('lk-sidebar__item', active && 'is-active')
  const handle = () => {
    item.onClick?.()
    onSelect?.(item.id)
  }
  const inner = (
    <>
      {item.icon != null && <span className="lk-sidebar__icon">{item.icon}</span>}
      <span className="lk-sidebar__label">{item.label}</span>
      {item.badge != null && <span className="lk-sidebar__badge">{item.badge}</span>}
    </>
  )
  if (item.href) {
    return (
      <a
        href={item.href}
        className={className}
        aria-current={active ? 'page' : undefined}
        onClick={handle}
      >
        {inner}
      </a>
    )
  }
  return (
    <button
      type="button"
      className={className}
      aria-current={active ? 'true' : undefined}
      onClick={handle}
    >
      {inner}
    </button>
  )
}

interface EdgeProps {
  collapsed: boolean
  resizable: boolean
  width: number
  minWidth: number
  maxWidth: number
  label: string
  onResize?: (width: number) => void
  onToggleCollapsed?: () => void
  onDraggingChange: (dragging: boolean) => void
}

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, Math.round(value)))

/**
 * The sidebar's trailing edge, which is two affordances sharing one hit area:
 * dragging it resizes the column, and letting go without having travelled
 * collapses it. One strip, because until the pointer moves they are the same
 * gesture — and because asking anyone to aim at two 12 px targets would not be
 * an improvement.
 */
function SidebarEdge({
  collapsed,
  resizable,
  width,
  minWidth,
  maxWidth,
  label,
  onResize,
  onToggleCollapsed,
  onDraggingChange,
}: EdgeProps) {
  const gesture = useRef<{ x: number; width: number; travelled: boolean } | null>(null)

  // A collapsed rail has no width to drag to; the strip is only an expander.
  const canDrag = resizable && !collapsed && onResize != null

  function down(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return
    gesture.current = { x: event.clientX, width, travelled: false }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const start = gesture.current
    if (!start) return
    const dx = event.clientX - start.x
    if (!start.travelled && Math.abs(dx) > DRAG_SLOP) {
      start.travelled = true
      if (canDrag) onDraggingChange(true)
    }
    if (start.travelled && canDrag) onResize?.(clamp(start.width + dx, minWidth, maxWidth))
  }

  function up(event: PointerEvent<HTMLButtonElement>) {
    const start = gesture.current
    gesture.current = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    onDraggingChange(false)
    if (start && !start.travelled) onToggleCollapsed?.()
  }

  /** Keyboard activation only — a pointer click was already settled in `up`. */
  function click(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail === 0) onToggleCollapsed?.()
  }

  function key(event: KeyboardEvent<HTMLButtonElement>) {
    if (!canDrag) return
    const step = event.key === 'ArrowLeft' ? -KEY_STEP : event.key === 'ArrowRight' ? KEY_STEP : 0
    if (step === 0) return
    event.preventDefault()
    onResize?.(clamp(width + step, minWidth, maxWidth))
  }

  return (
    <button
      type="button"
      className={cx('lk-sidebar__edge', canDrag && 'is-draggable')}
      aria-label={label}
      aria-expanded={!collapsed}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClick={click}
      onKeyDown={key}
    >
      <span className="lk-sidebar__rail" aria-hidden="true" />
    </button>
  )
}

/** The macOS source-list sidebar: sectioned nav with an accent selection. */
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  {
    sections,
    activeId,
    onSelect,
    header,
    footer,
    width = 248,
    collapsed = false,
    collapsedWidth = 68,
    onToggleCollapsed,
    resizable = false,
    minWidth = 248,
    maxWidth = 460,
    onResize,
    density = 'compact',
    tint = 'auto',
    glass = true,
    edgeLabel = 'Resize sidebar',
    className,
    style,
  },
  ref,
) {
  const [dragging, setDragging] = useState(false)
  const hasEdge = onToggleCollapsed != null || (resizable && onResize != null)

  const body = (
    <>
      {header != null && <div className="lk-sidebar__header">{header}</div>}
      <nav className="lk-sidebar__nav">
        {sections.map((s, i) => (
          <div className="lk-sidebar__section" key={i}>
            {s.title != null && <div className="lk-sidebar__title">{s.title}</div>}
            {s.items.map((it) => (
              <SidebarRow key={it.id} item={it} active={it.id === activeId} onSelect={onSelect} />
            ))}
          </div>
        ))}
      </nav>
      {footer != null && <div className="lk-sidebar__footer">{footer}</div>}
      {hasEdge && (
        <SidebarEdge
          collapsed={collapsed}
          resizable={resizable}
          width={width}
          minWidth={minWidth}
          maxWidth={maxWidth}
          label={edgeLabel}
          onResize={onResize}
          onToggleCollapsed={onToggleCollapsed}
          onDraggingChange={setDragging}
        />
      )}
    </>
  )

  const shell = cx(
    'lk-sidebar',
    `lk-sidebar--${density}`,
    collapsed && 'is-collapsed',
    dragging && 'is-dragging',
    className,
  )
  const box: CSSProperties = { width: collapsed ? collapsedWidth : width, ...style }

  if (!glass) {
    return (
      <div ref={ref} className={cx(shell, 'lk-sidebar--bare')} style={box}>
        {body}
      </div>
    )
  }

  return (
    <LiquidGlass
      ref={ref as never}
      radius={20}
      tint={tint}
      sheen={false}
      elevation={2}
      className={shell}
      style={box}
    >
      {body}
    </LiquidGlass>
  )
})
