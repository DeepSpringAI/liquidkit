import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Input.css'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  /** @default 'md' */
  inputSize?: InputSize
  /** Fully rounded. */
  pill?: boolean
  /** Wrapper class (the input itself stays unstyled-by-class). */
  className?: string
}

/** A glass text input with optional leading/trailing icons. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightIcon, inputSize = 'md', pill = false, className, style, disabled, ...rest },
  ref,
) {
  return (
    <LiquidGlass
      pill={pill}
      radius={pill ? 999 : 14}
      elevation={1}
      sheen={false}
      refraction={30}
      dispersion={3}
      className={cx('lk-input', `lk-input--${inputSize}`, disabled && 'is-disabled', className)}
      style={style}
    >
      {leftIcon && <span className="lk-input__icon">{leftIcon}</span>}
      <input ref={ref} className="lk-input__field" disabled={disabled} {...rest} />
      {rightIcon && <span className="lk-input__icon">{rightIcon}</span>}
    </LiquidGlass>
  )
})
