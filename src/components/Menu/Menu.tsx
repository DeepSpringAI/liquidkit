import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { CSSProperties, HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LiquidGlass } from '../../core/LiquidGlass'
import { CheckIcon, ChevronRightIcon } from '../../icons'
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
      /** Nested items. Renders a chevron; the row opens a flyout instead of selecting. */
      submenu?: MenuItem[]
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

type MenuEntry = Extract<MenuItem, { id: string }>

const ITEM_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"]'
const HIDDEN: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 'auto',
  bottom: 'auto',
  visibility: 'hidden',
}

/** A dropdown action menu (also a context menu) anchored to its trigger. */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { trigger, items, placement = 'bottom-start', className, ...rest },
  ref,
) {
  const [open, setOpen] = useState(false)
  const [subOpenId, setSubOpenId] = useState<string | null>(null)
  const [subStyle, setSubStyle] = useState<CSSProperties>(HIDDEN)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const subPanelRef = useRef<HTMLDivElement>(null)
  const container = useThemedPortal()
  const posStyle = useAnchoredPosition(rootRef, panelRef, open, { placement })

  const close = () => {
    setOpen(false)
    setSubOpenId(null)
  }

  useEffect(() => {
    if (!open) return
    const onDoc = (e: globalThis.MouseEvent) => {
      const t = e.target as Node
      const inRoot = rootRef.current?.contains(t)
      const inPanel = panelRef.current?.contains(t)
      const inSub = subPanelRef.current?.contains(t)
      if (!inRoot && !inPanel && !inSub) close()
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Collapse an open flyout first, then the whole menu.
        if (subOpenId) setSubOpenId(null)
        else {
          close()
          ;(rootRef.current?.firstElementChild as HTMLElement | null)?.focus?.()
        }
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, subOpenId])

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>(`${ITEM_SELECTOR}:not([disabled])`)?.focus()
  }, [open])

  // Position the submenu flyout beside its anchor row (open to the side, flip on overflow).
  useLayoutEffect(() => {
    if (!subOpenId) return
    const anchor = panelRef.current?.querySelector<HTMLElement>(`[data-sub-anchor="${subOpenId}"]`)
    const panel = subPanelRef.current
    if (!anchor || !panel) return
    const place = () => {
      const a = anchor.getBoundingClientRect()
      const p = panel.getBoundingClientRect()
      const vw = document.documentElement.clientWidth
      const vh = document.documentElement.clientHeight
      const gap = 4
      const rtl = getComputedStyle(anchor).direction === 'rtl'
      // Prefer the inline-end side; flip to the start side when there isn't room.
      const endLeft = rtl ? a.left - gap - p.width : a.right + gap
      const startLeft = rtl ? a.right + gap : a.left - gap - p.width
      let left = endLeft
      if (left < 8 || left + p.width > vw - 8) left = startLeft
      left = Math.max(8, Math.min(left, vw - p.width - 8))
      const top = Math.max(8, Math.min(a.top - 6, vh - p.height - 8))
      setSubStyle({
        position: 'fixed',
        top: Math.round(top),
        left: Math.round(left),
        right: 'auto',
        bottom: 'auto',
        visibility: 'visible',
      })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [subOpenId])

  // Focus the first flyout item when it opens; reset its style when it closes.
  useEffect(() => {
    if (!subOpenId) {
      setSubStyle(HIDDEN)
      return
    }
    subPanelRef.current?.querySelector<HTMLElement>(`${ITEM_SELECTOR}:not([disabled])`)?.focus()
  }, [subOpenId])

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

  const select = (it: MenuEntry) => {
    if (it.disabled) return
    if (it.submenu) {
      setSubOpenId((cur) => (cur === it.id ? null : it.id))
      return
    }
    it.onSelect?.()
    close()
    ;(rootRef.current?.firstElementChild as HTMLElement | null)?.focus?.()
  }

  const selectSub = (it: MenuEntry) => {
    if (it.disabled) return
    it.onSelect?.()
    close()
    ;(rootRef.current?.firstElementChild as HTMLElement | null)?.focus?.()
  }

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (moveListFocus(panelRef.current, e.key, ITEM_SELECTOR)) e.preventDefault()
  }
  const onSubKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (moveListFocus(subPanelRef.current, e.key, ITEM_SELECTOR)) e.preventDefault()
  }

  const renderItem = (it: MenuItem, i: number, onClick: (it: MenuEntry) => void) => {
    if ('divider' in it) return <span key={`d${i}`} className="lk-menu__divider" role="separator" />
    const hasSub = !!it.submenu
    return (
      <button
        key={it.id}
        type="button"
        data-sub-anchor={hasSub ? it.id : undefined}
        role={it.checked != null ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={it.checked != null ? !!it.checked : undefined}
        aria-haspopup={hasSub ? 'menu' : undefined}
        aria-expanded={hasSub ? subOpenId === it.id : undefined}
        disabled={it.disabled}
        className={cx(
          'lk-menu__item',
          it.destructive && 'is-destructive',
          hasSub && subOpenId === it.id && 'is-open',
        )}
        onClick={() => onClick(it)}
      >
        {it.icon != null && <span className="lk-menu__icon">{it.icon}</span>}
        <span className="lk-menu__label">{it.label}</span>
        {it.checked && <CheckIcon size={16} className="lk-menu__check" />}
        {hasSub && <ChevronRightIcon size={16} className="lk-menu__chevron" />}
      </button>
    )
  }

  const activeSub = items.find((it) => 'id' in it && it.id === subOpenId) as MenuEntry | undefined

  return (
    <div className={cx('lk-menu', className)} ref={mergeRefs(rootRef, ref)} {...rest}>
      {triggerEl}
      {open &&
        container &&
        createPortal(
          <>
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
              {items.map((it, i) => renderItem(it, i, select))}
            </LiquidGlass>
            {activeSub?.submenu && (
              <LiquidGlass
                ref={subPanelRef as never}
                radius={14}
                elevation={3}
                sheen={false}
                className="lk-menu__panel lk-menu__panel--sub"
                style={subStyle}
                role="menu"
                onKeyDown={onSubKeyDown}
              >
                {activeSub.submenu.map((it, i) => renderItem(it, i, selectSub))}
              </LiquidGlass>
            )}
          </>,
          container,
        )}
    </div>
  )
})
