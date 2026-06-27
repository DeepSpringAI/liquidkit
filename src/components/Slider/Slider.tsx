import { forwardRef, useState } from 'react'
import type { CSSProperties, InputHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import './Slider.css'

export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'type'
> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}

/** A glass range slider (native input under the hood — keyboard accessible). */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    defaultValue = 50,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    disabled = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue)
  const v = controlled ? value : internal
  const pct = ((v - min) / (max - min)) * 100

  return (
    <input
      ref={ref}
      {...rest}
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      disabled={disabled}
      onChange={(e) => {
        const nv = Number(e.target.value)
        if (!controlled) setInternal(nv)
        onChange?.(nv)
      }}
      className={cx('lk-slider', className)}
      style={{ '--lk-slider-pct': `${pct}%`, ...style } as CSSProperties}
    />
  )
})
