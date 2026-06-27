import { forwardRef } from 'react'
import { LiquidGlass, type LiquidGlassProps } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Card.css'

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends LiquidGlassProps {
  /** Inner padding preset. @default 'md' */
  padding?: CardPadding
}

/** A glass panel/card surface. Thin wrapper over LiquidGlass with padding presets. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = 'md', radius = 28, className, children, ...rest },
  ref,
) {
  return (
    <LiquidGlass
      ref={ref as never}
      radius={radius}
      className={cx('lk-card', padding !== 'none' && `lk-card--pad-${padding}`, className)}
      {...rest}
    >
      {children}
    </LiquidGlass>
  )
})
