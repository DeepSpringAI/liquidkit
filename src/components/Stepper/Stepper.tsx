import { forwardRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { PlusIcon, MinusIcon } from '../../icons'
import { cx } from '../../utils/cx'
import './Stepper.css'

export interface StepperProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  /** @default 0 */
  min?: number
  /** @default Infinity */
  max?: number
  /** @default 1 */
  step?: number
  /** Show the current value between the −/+ buttons. @default false */
  showValue?: boolean
  /** Format the displayed value. */
  formatValue?: (value: number) => ReactNode
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  'aria-label'?: string
  className?: string
  style?: CSSProperties
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** The iOS stepper: a −/+ capsule, optionally showing the current value. */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  {
    value,
    defaultValue,
    onChange,
    min = 0,
    max = Infinity,
    step = 1,
    showValue = false,
    formatValue,
    size = 'md',
    disabled = false,
    'aria-label': ariaLabel,
    className,
    style,
  },
  ref,
) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue ?? min)
  const v = controlled ? value : internal

  const set = (next: number) => {
    const c = clamp(next, min, max)
    if (c === v) return
    if (!controlled) setInternal(c)
    onChange?.(c)
  }

  const atMin = v <= min
  const atMax = v >= max

  return (
    <div
      ref={ref}
      className={cx('lk-stepper', `lk-stepper--${size}`, disabled && 'is-disabled', className)}
      style={style}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className="lk-stepper__btn"
        onClick={() => set(v - step)}
        disabled={disabled || atMin}
        aria-label="Decrease"
      >
        <MinusIcon />
      </button>
      {showValue && (
        <>
          <span className="lk-stepper__divider" />
          <span className="lk-stepper__value" aria-live="polite">
            {formatValue ? formatValue(v) : v}
          </span>
        </>
      )}
      <span className="lk-stepper__divider" />
      <button
        type="button"
        className="lk-stepper__btn"
        onClick={() => set(v + step)}
        disabled={disabled || atMax}
        aria-label="Increase"
      >
        <PlusIcon />
      </button>
    </div>
  )
})
