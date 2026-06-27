import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LiquidGlass } from '../../core/LiquidGlass'
import { IconButton } from '../Button/IconButton'
import { CloseIcon } from '../../icons/icons'
import { cx } from '../../utils/cx'
import './Modal.css'

const SIZES: Record<string, number> = { sm: 380, md: 520, lg: 720 }

export interface ModalProps {
  open: boolean
  onClose?: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg' | number
  closeOnBackdrop?: boolean
  className?: string
}

/** A glass modal dialog rendered in a portal, with scrim, Esc + scroll lock. */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  className,
}: ModalProps) {
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
      <div className="lk-modal__scrim" onClick={closeOnBackdrop ? onClose : undefined} />
      <LiquidGlass
        radius={28}
        elevation={3}
        className={cx('lk-modal__panel', className)}
        style={{ width }}
        role="dialog"
        aria-modal="true"
      >
        {(title || onClose) && (
          <div className="lk-modal__header">
            {title && <h3 className="lk-modal__title">{title}</h3>}
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
}
