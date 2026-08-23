import { forwardRef, useLayoutEffect, useRef } from 'react'
import type { CSSProperties, FormEvent, KeyboardEvent, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/mergeRefs'
import './Composer.css'

export interface ComposerProps {
  value: string
  onValueChange: (value: string) => void
  /** Called on Enter, or when a submit control inside `action` is pressed. */
  onSubmit: () => void
  placeholder?: string
  /** Accessible name for the field. @default 'Message' */
  label?: string
  /**
   * Controls that ride directly on the glass beside the field — a model
   * picker, a mode switch. They have no surface of their own: the bar is the
   * surface, and a second one inside it would read as a control in a box in a
   * box.
   */
  controls?: ReactNode
  /** The send (or stop) control, pinned to the trailing edge. */
  action?: ReactNode
  /** Anything above the bar, inside the same measure: a warning, a hint. */
  notice?: ReactNode
  /** Stops the field being typed in. The bar still renders. */
  disabled?: boolean
  /**
   * Enter submits and Shift+Enter is a newline. Turn it off where a newline is
   * the more likely intent. @default true
   */
  submitOnEnter?: boolean
  /** Field height at rest, in px. @default 34 */
  minHeight?: number
  /** Height the field grows to before it scrolls instead. @default 140 */
  maxHeight?: number
  className?: string
  style?: CSSProperties
}

/**
 * The docked composer: one frosted bar carrying a field that grows with what
 * is typed into it, whatever controls belong to the message, and one action.
 *
 * It is a single short row at rest and stays one row until the text needs more
 * than one — which is what keeps a chat screen's only chrome from looking like
 * a form. The controls stay pinned to the bottom as the field grows, so the
 * send button does not drift away from the last line being written.
 *
 * The bar is a `LiquidGlass` surface rather than a hand-rolled frost, so the
 * reduced-transparency and high-contrast answers are the library's own.
 */
export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  {
    value,
    onValueChange,
    onSubmit,
    placeholder,
    label = 'Message',
    controls,
    action,
    notice,
    disabled = false,
    submitOnEnter = true,
    minHeight = 34,
    maxHeight = 140,
    className,
    style,
  },
  forwardedRef,
) {
  const field = useRef<HTMLTextAreaElement>(null)

  // Measured from the content rather than counted in rows: a wrapped line and
  // a typed newline have to cost the same height, and `rows` cannot see the
  // first one.
  useLayoutEffect(() => {
    const node = field.current
    if (!node) return
    node.style.height = 'auto'
    const wanted = Math.min(Math.max(node.scrollHeight, minHeight), maxHeight)
    node.style.height = `${wanted}px`
    node.style.overflowY = node.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [value, minHeight, maxHeight])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!submitOnEnter || event.key !== 'Enter' || event.shiftKey) return
    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }

  return (
    <form className={cx('lk-composer', className)} style={style} onSubmit={submit}>
      {notice != null && <div className="lk-composer__notice">{notice}</div>}
      <LiquidGlass
        radius={24}
        elevation={2}
        sheen={false}
        className="lk-composer__bar"
        style={{ '--lk-composer-min': `${minHeight}px` } as CSSProperties}
      >
        <div className="lk-composer__row">
          <textarea
            ref={mergeRefs(forwardedRef, field)}
            className="lk-composer__field"
            aria-label={label}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            rows={1}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={keyDown}
          />
          {controls != null && <div className="lk-composer__controls">{controls}</div>}
          {action != null && <div className="lk-composer__action">{action}</div>}
        </div>
      </LiquidGlass>
    </form>
  )
})
