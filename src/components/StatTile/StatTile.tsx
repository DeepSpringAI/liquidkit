import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './StatTile.css'

export interface StatTileProps {
  label?: ReactNode
  value: ReactNode
  delta?: ReactNode
  /** @default 'up' */
  direction?: 'up' | 'down'
  /** Strong colored glow — the glowing data-tile look. */
  glow?: boolean
  /** Glow / accent color. @default '#3b82f6' */
  accent?: string
  /** Square tile size in px. @default 180 */
  size?: number
  className?: string
  style?: CSSProperties
}

/** A glowing glass data tile (value + delta), as in finance dashboards. */
export const StatTile = forwardRef<HTMLDivElement, StatTileProps>(function StatTile(
  {
    label,
    value,
    delta,
    direction = 'up',
    glow = false,
    accent = '#3b82f6',
    size = 180,
    className,
    style,
  },
  ref,
) {
  const css = {
    width: size,
    height: size,
    '--lk-stat-accent': accent,
    ...style,
  } as CSSProperties

  return (
    <LiquidGlass
      ref={ref as never}
      radius={26}
      elevation={glow ? 3 : 2}
      className={cx('lk-stat', glow && 'lk-stat--glow', className)}
      style={css}
    >
      <div className="lk-stat__inner">
        <span className="lk-stat__value">{value}</span>
        <div className="lk-stat__foot">
          {label != null && <span className="lk-stat__label">{label}</span>}
          {delta != null && (
            <span className={cx('lk-stat__delta', `lk-stat__delta--${direction}`)}>
              <span className="lk-stat__arrow">{direction === 'up' ? '▲' : '▼'}</span>
              {delta}
            </span>
          )}
        </div>
      </div>
    </LiquidGlass>
  )
})
