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
  /** Make the in-field × also dismiss the keyboard (blur) as a cancel. @default false */
  cancelable?: boolean
  onCancel?: () => void
  className?: string
  style?: CSSProperties
}

/** The iOS search bar — a rounded fill with a leading magnifier and an
 *  in-field clear (×) button that can double as a cancel action. */
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

  return (
    <div className={cx('lk-search', `lk-search--${size}`, className)} style={style}>
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
          {...rest}
        />
        {hasValue && (
          <button
            type="button"
            className="lk-search__clear"
            aria-label={cancelable ? 'Cancel search' : 'Clear search'}
            onClick={cancelable ? cancel : clear}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  )
})
