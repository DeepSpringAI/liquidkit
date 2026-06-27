import { cloneElement, forwardRef, useId, useState } from 'react'
import type {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { cx } from '../../utils/cx'
import './Tooltip.css'

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  content: ReactNode
  children: ReactElement
  /** @default 'top' */
  side?: 'top' | 'bottom' | 'left' | 'right'
}

/** A glass tooltip shown on hover/focus of its single child (Esc dismisses). */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  { content, children, side = 'top', className, ...rest },
  ref,
) {
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
    onKeyDown: (e: KeyboardEvent) => {
      props.onKeyDown?.(e)
      if (e.key === 'Escape') setOpen(false)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  return (
    <span className="lk-tooltip-wrap" ref={ref} {...rest}>
      {child}
      <span
        role="tooltip"
        id={id}
        aria-hidden={!open}
        className={cx('lk-tooltip', `lk-tooltip--${side}`, open && 'is-open', className)}
      >
        {content}
      </span>
    </span>
  )
})
