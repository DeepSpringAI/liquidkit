import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../core/LiquidGlass'
import { cx } from '../utils/cx'
import './GlassIcon.css'

export interface GlassIconProps {
  /** The icon to render inside the glass tile. */
  children: ReactNode
  /** Tile size in px. @default 64 */
  size?: number
  /** Corner radius. Defaults to a squircle-ish ~32% of size. */
  radius?: number
  /** Circular tile. */
  pill?: boolean
  /** @default 'auto' */
  tint?: GlassTint
  /** Override the icon color. */
  iconColor?: string
  /** @default 2 */
  elevation?: 0 | 1 | 2 | 3
  refraction?: number
  dispersion?: number
  className?: string
  style?: CSSProperties
}

/** Renders an icon inside a refractive glass tile — the "glass app icon" look. */
export const GlassIcon = forwardRef<HTMLDivElement, GlassIconProps>(function GlassIcon(
  {
    children,
    size = 64,
    radius,
    pill = false,
    tint = 'auto',
    iconColor,
    elevation = 2,
    refraction,
    dispersion,
    className,
    style,
  },
  ref,
) {
  return (
    <LiquidGlass
      ref={ref as never}
      radius={radius ?? Math.round(size * 0.32)}
      pill={pill}
      tint={tint}
      elevation={elevation}
      refraction={refraction}
      dispersion={dispersion}
      className={cx('lk-glassicon', className)}
      style={{ width: size, height: size, ...style }}
    >
      <span className="lk-glassicon__icon" style={iconColor ? { color: iconColor } : undefined}>
        {children}
      </span>
    </LiquidGlass>
  )
})
