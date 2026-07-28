import { forwardRef, memo } from 'react'
import type { AllHTMLAttributes, ElementType, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Button.css'

export type ButtonVariant = 'glass' | 'accent' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<AllHTMLAttributes<HTMLElement>, 'as' | 'size'> {
  /** Element/component to render as (e.g. 'a' for a link button). @default 'button' */
  as?: ElementType
  /** @default 'glass' */
  variant?: ButtonVariant
  /** @default 'md' */
  size?: ButtonSize
  /** Fully rounded pill (bubble). Pass `pill={false}` for softly-rounded corners. @default true */
  pill?: boolean
  /** Square/circular icon-only button. */
  iconOnly?: boolean
  /** Chromatic glow ring behind the button (the "Liquid Home" look). */
  glow?: boolean
  /** Stretch to fill the container width. */
  block?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  /** @deprecated No longer does anything — the displacement engine was removed. */
  refraction?: number
  /** @deprecated No longer does anything — the displacement engine was removed. */
  dispersion?: number
}

const RADIUS: Record<ButtonSize, number> = { sm: 12, md: 16, lg: 20 }

const ButtonInner = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    as: Comp = 'button',
    variant = 'glass',
    size = 'md',
    pill = true,
    iconOnly = false,
    glow = false,
    block = false,
    leftIcon,
    rightIcon,
    // Destructured only to keep them out of `...rest` (and off the DOM); see the
    // deprecation note on the props.
    refraction,
    dispersion,
    className,
    children,
    type,
    ...rest
  },
  ref,
) {
  void refraction
  void dispersion
  const inner = (
    <span className="lk-btn__inner">
      {leftIcon && <span className="lk-btn__icon">{leftIcon}</span>}
      {children != null && <span className="lk-btn__label">{children}</span>}
      {rightIcon && <span className="lk-btn__icon">{rightIcon}</span>}
    </span>
  )

  const classes = cx(
    'lk-btn',
    `lk-btn--${size}`,
    iconOnly && 'lk-btn--icon',
    pill && 'lk-btn--pill',
    block && 'lk-btn--block',
    glow && 'lk-btn--glow',
    className,
  )

  // `type` only applies to a real <button>.
  const typeAttr = Comp === 'button' ? { type: type ?? 'button' } : {}

  if (variant === 'ghost') {
    return (
      <Comp
        ref={ref as never}
        className={cx(classes, 'lk-btn--ghost', 'lk-press')}
        {...typeAttr}
        {...rest}
      >
        {inner}
      </Comp>
    )
  }

  return (
    <LiquidGlass
      as={Comp}
      ref={ref as never}
      interactive
      pill={pill}
      radius={RADIUS[size]}
      tint={variant === 'accent' ? 'accent' : 'auto'}
      className={cx(classes, `lk-btn--${variant}`)}
      {...typeAttr}
      {...rest}
    >
      {inner}
    </LiquidGlass>
  )
})
ButtonInner.displayName = 'Button'

/** A glass button. Supports icons, sizes, pill/icon-only shapes and a glow ring. */
export const Button = memo(ButtonInner)
