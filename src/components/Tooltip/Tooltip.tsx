import { cloneElement, useId, useState } from 'react'
import type { FocusEvent, MouseEvent, ReactElement, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './Tooltip.css'

export interface TooltipProps {
  content: ReactNode
  children: ReactElement
  /** @default 'top' */
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

/** A glass tooltip shown on hover/focus of its single child. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = children.props as Record<string, any>

  const child = cloneElement(children, {
    'aria-describedby': open ? id : props['aria-describedby'],
    onMouseEnter: (e: MouseEvent) => {
      props.onMouseEnter?.(e)
      setOpen(true)
    },
    onMouseLeave: (e: MouseEvent) => {
      props.onMouseLeave?.(e)
      setOpen(false)
    },
    onFocus: (e: FocusEvent) => {
      props.onFocus?.(e)
      setOpen(true)
    },
    onBlur: (e: FocusEvent) => {
      props.onBlur?.(e)
      setOpen(false)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  return (
    <span className="lk-tooltip-wrap">
      {child}
      <span
        role="tooltip"
        id={id}
        className={cx('lk-tooltip', `lk-tooltip--${side}`, open && 'is-open', className)}
      >
        {content}
      </span>
    </span>
  )
}
