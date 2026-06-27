import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { ChevronDownIcon, CheckIcon } from '../../icons/icons'
import { cx } from '../../utils/cx'
import './Select.css'

export interface SelectOption {
  value: string
  label: ReactNode
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: ReactNode
  disabled?: boolean
  className?: string
}

/** A glass select / dropdown menu. */
export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  className,
}: SelectProps) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue)
  const v = controlled ? value : internal
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === v)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
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
  }, [open])

  const choose = (val: string) => {
    if (!controlled) setInternal(val)
    onChange?.(val)
    setOpen(false)
  }

  return (
    <div className={cx('lk-select', className)} ref={rootRef}>
      <button
        type="button"
        className="lk-select__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={cx('lk-select__value', !selected && 'is-placeholder')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon size={18} className={cx('lk-select__chevron', open && 'is-open')} />
      </button>
      {open && (
        <LiquidGlass radius={16} elevation={3} sheen={false} className="lk-select__menu" role="listbox">
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
        </LiquidGlass>
      )}
    </div>
  )
}
