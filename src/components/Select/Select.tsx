import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LiquidGlass } from '../../core/LiquidGlass'
import { ChevronDownIcon, CheckIcon } from '../../icons/icons'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/mergeRefs'
import { moveListFocus } from '../../utils/moveListFocus'
import { useThemedPortal } from '../../utils/useThemedPortal'
import { useAnchoredPosition } from '../../utils/useAnchoredPosition'
import './Select.css'

export interface SelectOption {
  value: string
  label: ReactNode
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: ReactNode
  disabled?: boolean
}

const OPTION_SELECTOR = '[role="option"]'

/** A glass select / dropdown menu. */
export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    disabled = false,
    className,
    ...rest
  },
  ref,
) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue)
  const v = controlled ? value : internal
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const selected = options.find((o) => o.value === v)
  const container = useThemedPortal()
  // The panel lives in the portal, so it is in the DOM only once the container
  // is — one commit after mount. Anything that reaches into the panel keys off
  // this, not off `open`, or it runs against an empty ref and never re-runs.
  const panelMounted = open && container !== null
  const posStyle = useAnchoredPosition(triggerRef, panelRef, panelMounted, {
    placement: 'bottom-start',
    gap: 8,
    matchWidth: true,
  })

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
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Move focus into the listbox (selected option first) when it opens.
  useEffect(() => {
    if (!panelMounted) return
    const panel = panelRef.current
    if (!panel) return
    const target =
      panel.querySelector<HTMLElement>(`${OPTION_SELECTOR}[aria-selected="true"]`) ??
      panel.querySelector<HTMLElement>(OPTION_SELECTOR)
    target?.focus()
  }, [panelMounted])

  const choose = (val: string) => {
    if (!controlled) setInternal(val)
    onChange?.(val)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (
      !open &&
      (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')
    ) {
      e.preventDefault()
      setOpen(true)
    }
  }

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (moveListFocus(panelRef.current, e.key, OPTION_SELECTOR)) e.preventDefault()
  }

  return (
    <div className={cx('lk-select', className)} ref={mergeRefs(rootRef, ref)} {...rest}>
      <button
        ref={triggerRef}
        type="button"
        className="lk-select__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={cx('lk-select__value', !selected && 'is-placeholder')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon size={18} className={cx('lk-select__chevron', open && 'is-open')} />
      </button>
      {open &&
        container &&
        createPortal(
          <LiquidGlass
            ref={panelRef as never}
            radius={16}
            elevation={3}
            material="thick"
            sheen={false}
            className="lk-select__menu"
            style={{ ...posStyle, width: 'auto' }}
            role="listbox"
            id={listboxId}
            onKeyDown={onPanelKeyDown}
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === v}
                className={cx('lk-select__option', o.value === v && 'is-selected')}
                onClick={() => choose(o.value)}
              >
                <span>{o.label}</span>
                {o.value === v && <CheckIcon size={16} />}
              </button>
            ))}
          </LiquidGlass>,
          container,
        )}
    </div>
  )
})
