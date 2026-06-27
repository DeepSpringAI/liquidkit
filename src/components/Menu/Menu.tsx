import { cloneElement, forwardRef, isValidElement, useEffect, useRef, useState } from 'react'
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LiquidGlass } from '../../core/LiquidGlass'
import { CheckIcon } from '../../icons'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/mergeRefs'
import { moveListFocus } from '../../utils/moveListFocus'
import { useThemedPortal } from '../../utils/useThemedPortal'
import { useAnchoredPosition } from '../../utils/useAnchoredPosition'
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

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  /** The element that opens the menu. Its onClick is wrapped automatically. */
  trigger: ReactNode
  items: MenuItem[]
  /** @default 'bottom-start' */
  placement?: MenuPlacement
}

const ITEM_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"]'

/** A dropdown action menu (also a context menu) anchored to its trigger. */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { trigger, items, placement = 'bottom-start', className, ...rest },
  ref,
) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const container = useThemedPortal()
  const posStyle = useAnchoredPosition(rootRef, panelRef, open, { placement })

  useEffect(() => {
    if (!open) return
    const onDoc = (e: globalThis.MouseEvent) => {
      const t = e.target as Node
      if (
        rootRef.current &&
        !rootRef.current.contains(t) &&
        panelRef.current &&
        !panelRef.current.contains(t)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        ;(rootRef.current?.firstElementChild as HTMLElement | null)?.focus?.()
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>(`${ITEM_SELECTOR}:not([disabled])`)?.focus()
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
    ;(rootRef.current?.firstElementChild as HTMLElement | null)?.focus?.()
  }

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (moveListFocus(panelRef.current, e.key, ITEM_SELECTOR)) e.preventDefault()
  }

  return (
    <div className={cx('lk-menu', className)} ref={mergeRefs(rootRef, ref)} {...rest}>
      {triggerEl}
      {open &&
        container &&
        createPortal(
          <LiquidGlass
            ref={panelRef as never}
            radius={14}
            elevation={3}
            sheen={false}
            className={cx('lk-menu__panel', `lk-menu__panel--${placement}`)}
            style={posStyle}
            role="menu"
            onKeyDown={onPanelKeyDown}
          >
            {items.map((it, i) =>
              'divider' in it ? (
                <span key={`d${i}`} className="lk-menu__divider" role="separator" />
              ) : (
                <button
                  key={it.id}
                  type="button"
                  role={it.checked != null ? 'menuitemcheckbox' : 'menuitem'}
                  aria-checked={it.checked != null ? !!it.checked : undefined}
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
          </LiquidGlass>,
          container,
        )}
    </div>
  )
})
