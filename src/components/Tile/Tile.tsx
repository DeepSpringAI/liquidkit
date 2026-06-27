import { forwardRef } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Tile.css'

export interface TileProps {
  icon?: ReactNode
  label?: ReactNode
  /** Secondary line under the label. */
  detail?: ReactNode
  /** On state — fills the icon badge with `activeColor`. */
  active?: boolean
  /** Fill color of the icon badge when active. @default var(--lk-accent) */
  activeColor?: string
  onClick?: () => void
  /** Square size in px. Omit to size to content / its grid cell. */
  size?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** The iOS Control Center tile: an icon badge with a label, toggled on/off. */
export const Tile = forwardRef<HTMLElement, TileProps>(function Tile(
  {
    icon,
    label,
    detail,
    active = false,
    activeColor = 'var(--lk-accent)',
    onClick,
    size,
    as,
    className,
    style,
    children,
  },
  ref,
) {
  const Comp: ElementType = as ?? (onClick ? 'button' : 'div')
  const typeAttr = Comp === 'button' ? { type: 'button' as const } : {}

  return (
    <LiquidGlass
      as={Comp}
      ref={ref as never}
      interactive={!!onClick}
      radius={22}
      className={cx('lk-tile', active && 'is-active', className)}
      style={{ ...(size ? { width: size, height: size } : null), ...style } as CSSProperties}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      {...typeAttr}
    >
      {icon != null && (
        <span
          className="lk-tile__icon"
          style={active ? { background: activeColor, color: '#fff' } : undefined}
        >
          {icon}
        </span>
      )}
      {(label != null || detail != null) && (
        <span className="lk-tile__meta">
          {label != null && <span className="lk-tile__label">{label}</span>}
          {detail != null && <span className="lk-tile__detail">{detail}</span>}
        </span>
      )}
      {children}
    </LiquidGlass>
  )
})
