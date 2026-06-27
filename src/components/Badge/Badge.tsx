import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import './Badge.css'

export type BadgeVariant =
  | 'glass'
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** @default 'glass' */
  variant?: BadgeVariant
  /** @default 'md' */
  size?: 'sm' | 'md'
  /** Leading status dot. */
  dot?: boolean
}

/** A small pill label / status chip. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'glass', size = 'md', dot = false, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx('lk-badge', `lk-badge--${variant}`, `lk-badge--${size}`, className)}
      {...rest}
    >
      {dot && <span className="lk-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
})
