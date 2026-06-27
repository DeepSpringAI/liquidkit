import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactElement, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { CheckIcon } from '../../icons'
import { cx } from '../../utils/cx'
import './Menu.css'

export type MenuItem =
  | { divider: true }
  | {
      id: string
      label: ReactNode
      icon?: ReactNode
      checked?: boolean
      destructive?: boolean
      disabled?: boolean
      onSelect?: () => void
    }

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface MenuProps {
  /** The element that opens the menu. Its onClick is wrapped automatically. */
  trigger: ReactNode
  items: MenuItem[]
  /** @default 'bottom-start' */
  placement?: MenuPlacement
  className?: string
}

/** A dropdown action menu (also a context menu) anchored to its trigger. */
export function Menu({ trigger, items, placement = 'bottom-start', className }: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent | globalThis.MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc as EventListener)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc as EventListener)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const triggerEl = isValidElement(trigger) ? (
    cloneElement(trigger as ReactElement<Record<string, unknown>>, {
      onClick: (e: MouseEvent) => {
        ;(trigger as ReactElement<{ onClick?: (e: MouseEvent) => void }>).props.onClick?.(e)
        setOpen((o) => !o)
      },
      'aria-haspopup': 'menu',
      'aria-expanded': open,
    })
  ) : (
    <button type="button" className="lk-menu__trigger" onClick={() => setOpen((o) => !o)}>
      {trigger}
    </button>
  )

  const select = (it: Extract<MenuItem, { id: string }>) => {
    if (it.disabled) return
    it.onSelect?.()
    setOpen(false)
  }

  return (
    <div className={cx('lk-menu', className)} ref={rootRef}>
      {triggerEl}
      {open && (
        <LiquidGlass
          radius={14}
          elevation={3}
          sheen={false}
          className={cx('lk-menu__panel', `lk-menu__panel--${placement}`)}
          role="menu"
        >
          {items.map((it, i) =>
            'divider' in it ? (
              <span key={`d${i}`} className="lk-menu__divider" role="separator" />
            ) : (
              <button
                key={it.id}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                className={cx('lk-menu__item', it.destructive && 'is-destructive')}
                onClick={() => select(it)}
              >
                {it.icon != null && <span className="lk-menu__icon">{it.icon}</span>}
                <span className="lk-menu__label">{it.label}</span>
                {it.checked && <CheckIcon size={16} className="lk-menu__check" />}
              </button>
            ),
          )}
        </LiquidGlass>
      )}
    </div>
  )
}
