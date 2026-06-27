import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LiquidGlass } from '../../core/LiquidGlass'
import { CloseIcon } from '../../icons'
import { cx } from '../../utils/cx'
import { useThemedPortal } from '../../utils/useThemedPortal'
import './Toast.css'

export type ToastVariant = 'glass' | 'success' | 'error' | 'accent'
export type ToastPlacement = 'top' | 'bottom'

export interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  /** @default 'glass' */
  variant?: ToastVariant
  /** ms before auto-dismiss; 0 keeps it until dismissed. @default 4000 */
  duration?: number
  action?: { label: ReactNode; onClick: () => void }
}

interface ToastItem extends ToastOptions {
  id: string
}

export interface ToastApi {
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => string
  /** Dismiss a toast by id. */
  dismiss: (id: string) => void
}

export interface ToastProviderProps {
  children: ReactNode
  /** @default 'bottom' */
  placement?: ToastPlacement
  /** Maximum simultaneously visible. @default 4 */
  max?: number
}

const ToastContext = createContext<ToastApi | null>(null)

/** Access the toast API. Must be called within a {@link ToastProvider}. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>')
  return ctx
}

/** Provides the toast API and renders the toast region in a portal. */
export function ToastProvider({ children, placement = 'bottom', max = 4 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([])
  const seq = useRef(0)
  const container = useThemedPortal()

  const dismiss = useCallback((id: string) => {
    setItems((xs) => xs.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `lk-toast-${(seq.current += 1)}`
      setItems((xs) => [...xs, { id, ...options }].slice(-max))
      return id
    },
    [max],
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {container &&
        createPortal(
          <div
            className={cx('lk-toasts', `lk-toasts--${placement}`)}
            role="region"
            aria-label="Notifications"
          >
            {items.map((t) => (
              <ToastCard key={t.id} item={t} dismiss={dismiss} />
            ))}
          </div>,
          container,
        )}
    </ToastContext.Provider>
  )
}

function ToastCard({ item, dismiss }: { item: ToastItem; dismiss: (id: string) => void }) {
  const { id, title, description, icon, variant = 'glass', duration = 4000, action } = item

  useEffect(() => {
    if (!duration) return
    const t = setTimeout(() => dismiss(id), duration)
    return () => clearTimeout(t)
  }, [duration, dismiss, id])

  // Errors interrupt (assertive); everything else is announced politely.
  const assertive = variant === 'error'

  return (
    <LiquidGlass
      radius={16}
      elevation={3}
      className={cx('lk-toast', 'lk-spring-in', variant !== 'glass' && `lk-toast--${variant}`)}
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
    >
      {icon != null && <span className="lk-toast__icon">{icon}</span>}
      <div className="lk-toast__main">
        {title != null && <div className="lk-toast__title">{title}</div>}
        {description != null && <div className="lk-toast__desc">{description}</div>}
      </div>
      {action && (
        <button
          type="button"
          className="lk-toast__action"
          onClick={() => {
            action.onClick()
            dismiss(id)
          }}
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        className="lk-toast__close"
        aria-label="Dismiss"
        onClick={() => dismiss(id)}
      >
        <CloseIcon />
      </button>
    </LiquidGlass>
  )
}
