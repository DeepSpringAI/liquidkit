import { forwardRef, useId, useState } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Switch.css'

export type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  /** @default 'md' */
  size?: SwitchSize
  /** Optional text label rendered next to the control. */
  label?: ReactNode
  /** Icon shown inside the thumb when on. */
  iconOn?: ReactNode
  /** Icon shown inside the thumb when off. */
  iconOff?: ReactNode
  /** Accent glow around the thumb when on (the dark-mode-switch look). */
  glow?: boolean
}

/** A glass on/off switch with a sliding thumb that can carry an icon. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    size = 'md',
    label,
    iconOn,
    iconOff,
    glow = false,
    id,
    name,
    className,
    ...rest
  },
  ref,
) {
  const isControlled = checked != null
  const [internal, setInternal] = useState(defaultChecked)
  const value = isControlled ? checked : internal
  const autoId = useId()
  const sid = id ?? autoId

  const toggle = () => {
    if (disabled) return
    const next = !value
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <span
      className={cx('lk-switch', `lk-switch--${size}`, className)}
      data-checked={value}
      data-disabled={disabled || undefined}
    >
      {name && <input type="hidden" name={name} value={value ? 'on' : 'off'} />}
      <button
        ref={ref}
        type="button"
        {...rest}
        role="switch"
        id={sid}
        aria-checked={value}
        disabled={disabled}
        onClick={toggle}
        className="lk-switch__control"
      >
        <LiquidGlass
          pill
          elevation={1}
          material="ultraThin"
          tint="auto"
          sheen={false}
          refraction={26}
          dispersion={3}
          bezel={8}
          className="lk-switch__track"
        />
        <LiquidGlass
          pill
          elevation={2}
          material="clear"
          tint={value ? 'accent' : 'clear'}
          refraction={64}
          dispersion={22}
          bezel={7}
          className={cx('lk-switch__thumb', glow && 'lk-switch__thumb--glow')}
        >
          <span className="lk-switch__thumb-glint" aria-hidden="true" />
          <span className="lk-switch__thumb-icon" aria-hidden="true">
            {value ? iconOn : iconOff}
          </span>
        </LiquidGlass>
      </button>
      {label && (
        <label htmlFor={sid} className="lk-switch__label">
          {label}
        </label>
      )}
    </span>
  )
})
