import { forwardRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './CommandBar.css'

export interface CommandBarProps {
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Fires on Enter (without Shift). */
  onSubmit?: (value: string) => void
  /** Controls/actions on the left of the field. */
  leading?: ReactNode
  /** Controls/actions on the right of the field. */
  trailing?: ReactNode
  /** A row of controls beneath the field (e.g. tool buttons). */
  footer?: ReactNode
  rows?: number
  radius?: number
  elevation?: 0 | 1 | 2 | 3
  className?: string
  style?: CSSProperties
}

/** A glass command/prompt bar — text field plus optional action slots. */
export const CommandBar = forwardRef<HTMLTextAreaElement, CommandBarProps>(function CommandBar(
  {
    placeholder = 'Ask me anything…',
    value,
    defaultValue = '',
    onValueChange,
    onSubmit,
    leading,
    trailing,
    footer,
    rows = 1,
    radius = 24,
    elevation = 2,
    className,
    style,
  },
  ref,
) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue)
  const v = controlled ? value : internal

  const setV = (next: string) => {
    if (!controlled) setInternal(next)
    onValueChange?.(next)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.(v)
    }
  }

  return (
    <LiquidGlass
      radius={radius}
      elevation={elevation}
      className={cx('lk-cmd', className)}
      style={style}
    >
      <div className="lk-cmd__inner">
        <div className="lk-cmd__row">
          {leading && <div className="lk-cmd__slot">{leading}</div>}
          <textarea
            ref={ref}
            className="lk-cmd__field"
            placeholder={placeholder}
            rows={rows}
            value={v}
            onChange={(e) => setV(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {trailing && <div className="lk-cmd__slot">{trailing}</div>}
        </div>
        {footer && <div className="lk-cmd__footer">{footer}</div>}
      </div>
    </LiquidGlass>
  )
})
