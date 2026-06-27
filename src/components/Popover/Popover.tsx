import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactElement, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Popover.css'

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverProps {
  /** The element that opens the popover. Its onClick is wrapped automatically. */
  trigger: ReactNode
  children: ReactNode
  /** @default 'bottom' */
  placement?: PopoverPlacement
  /** Cross-axis alignment for top/bottom placements. @default 'center' */
  align?: PopoverAlign
  /** Show the arrow pointer. @default true */
  arrow?: boolean
  /** Open on hover rather than click. @default false */
  openOnHover?: boolean
  /** Fixed panel width in px. */
  width?: number
  className?: string
}

/** A floating glass panel with an arrow, anchored to its trigger. */
export function Popover({
  trigger,
  children,
  placement = 'bottom',
  align = 'center',
  arrow = true,
  openOnHover = false,
  width,
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || openOnHover) return
    const onDoc = (e: globalThis.MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, openOnHover])

  const hoverProps = openOnHover
    ? { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) }
    : {}

  const triggerEl = isValidElement(trigger) ? (
    cloneElement(
      trigger as ReactElement<Record<string, unknown>>,
      openOnHover
        ? { 'aria-expanded': open }
        : {
            onClick: (e: MouseEvent) => {
              ;(trigger as ReactElement<{ onClick?: (e: MouseEvent) => void }>).props.onClick?.(e)
              setOpen((o) => !o)
            },
            'aria-expanded': open,
          },
    )
  ) : (
    <button
      type="button"
      className="lk-popover__trigger"
      onClick={() => !openOnHover && setOpen((o) => !o)}
    >
      {trigger}
    </button>
  )

  return (
    <div className={cx('lk-popover', className)} ref={rootRef} {...hoverProps}>
      {triggerEl}
      {open && (
        <LiquidGlass
          radius={16}
          elevation={3}
          className={cx(
            'lk-popover__panel',
            `lk-popover__panel--${placement}`,
            `lk-popover__panel--align-${align}`,
          )}
          style={width ? ({ width } as CSSProperties) : undefined}
          role="dialog"
        >
          {arrow && <span className={cx('lk-popover__arrow', `lk-popover__arrow--${placement}`)} aria-hidden="true" />}
          <div className="lk-popover__content">{children}</div>
        </LiquidGlass>
      )}
    </div>
  )
}
