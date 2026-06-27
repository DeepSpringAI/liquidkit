import { forwardRef, useEffect, useId, useRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LiquidGlass } from '../../core/LiquidGlass'
import { IconButton } from '../Button/IconButton'
import { CloseIcon } from '../../icons/icons'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/mergeRefs'
import { useFocusTrap } from '../../utils/useFocusTrap'
import './Modal.css'

const SIZES: Record<string, number> = { sm: 380, md: 520, lg: 720 }

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean
  onClose?: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg' | number
  closeOnBackdrop?: boolean
}

/** A glass modal dialog rendered in a portal, with scrim, Esc, scroll lock and a focus trap. */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnBackdrop = true,
    className,
    style,
    ...rest
  },
  ref,
) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null
  const width = typeof size === 'number' ? size : SIZES[size]

  return createPortal(
    <div className="lk-modal">
      {/* The backdrop is a pointer affordance only; keyboard users dismiss via
          Esc or the Close button, so it stays out of the a11y tree. */}
      <div
        className="lk-modal__scrim"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <LiquidGlass
        ref={mergeRefs(panelRef, ref) as never}
        radius={28}
        elevation={3}
        {...rest}
        className={cx('lk-modal__panel', className)}
        style={{ width, ...style }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {(title || onClose) && (
          <div className="lk-modal__header">
            {title && (
              <h3 className="lk-modal__title" id={titleId}>
                {title}
              </h3>
            )}
            {onClose && (
              <IconButton aria-label="Close" size="sm" variant="ghost" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
        )}
        <div className="lk-modal__body">{children}</div>
        {footer && <div className="lk-modal__footer">{footer}</div>}
      </LiquidGlass>
    </div>,
    document.body,
  )
})
