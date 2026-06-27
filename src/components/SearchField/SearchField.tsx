import { forwardRef, useRef, useState } from 'react'
import type { CSSProperties, InputHTMLAttributes } from 'react'
import { SearchIcon, CloseIcon } from '../../icons'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/mergeRefs'
import './SearchField.css'

type NativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'defaultValue' | 'size'
>

export interface SearchFieldProps extends NativeProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Fires when the clear (×) button is pressed. */
  onClear?: () => void
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Reveal a Cancel button while focused or non-empty (iOS). @default false */
  cancelable?: boolean
  onCancel?: () => void
  className?: string
  style?: CSSProperties
}

/** The iOS search bar — a rounded fill with a leading magnifier, a clear
 *  button, and an optional Cancel action. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    value,
    defaultValue,
    onChange,
    onClear,
    size = 'md',
    cancelable = false,
    onCancel,
    placeholder = 'Search',
    className,
    style,
    ...rest
  },
  ref,
) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue ?? '')
  const v = controlled ? value : internal
  const [focused, setFocused] = useState(false)
  const innerRef = useRef<HTMLInputElement>(null)

  const setVal = (next: string) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }
  const clear = () => {
    setVal('')
    onClear?.()
    innerRef.current?.focus()
  }
  const cancel = () => {
    setVal('')
    onCancel?.()
    innerRef.current?.blur()
  }

  const hasValue = (v?.length ?? 0) > 0
  const showCancel = cancelable && (focused || hasValue)

  return (
    <div
      className={cx('lk-search', `lk-search--${size}`, showCancel && 'is-cancelable', className)}
      style={style}
    >
      <div className="lk-search__field">
        <span className="lk-search__icon">
          <SearchIcon />
        </span>
        <input
          ref={mergeRefs(ref, innerRef)}
          type="search"
          className="lk-search__input"
          value={v}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {hasValue && (
          <button type="button" className="lk-search__clear" aria-label="Clear search" onClick={clear}>
            <CloseIcon />
          </button>
        )}
      </div>
      {showCancel && (
        <button
          type="button"
          className="lk-search__cancel"
          // keep focus until the click lands so the button doesn't vanish first
          onMouseDown={(e) => e.preventDefault()}
          onClick={cancel}
        >
          Cancel
        </button>
      )}
    </div>
  )
})
