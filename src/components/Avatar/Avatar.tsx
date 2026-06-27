import { forwardRef, Children, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './Avatar.css'

export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  /** Used for initials fallback when there's no image. */
  name?: string
  /** Diameter in px. @default 44 */
  size?: number
  status?: AvatarStatus
  /** Glass ring around the avatar. */
  ring?: boolean
}

function initials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}

/** A circular avatar with image or initials, optional status dot and ring. */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, alt, name, size = 44, status, ring = false, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('lk-avatar', ring && 'lk-avatar--ring', className)}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      <div className="lk-avatar__inner" style={{ fontSize: Math.round(size * 0.38) }}>
        {src ? <img src={src} alt={alt ?? name ?? ''} /> : <span>{initials(name)}</span>}
      </div>
      {status && (
        <span
          className={cx('lk-avatar__status', `lk-avatar__status--${status}`)}
          aria-label={status}
        />
      )}
    </div>
  )
})

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Max avatars to show before a “+N” chip. */
  max?: number
  /** Diameter applied to the overflow chip. @default 44 */
  size?: number
  children: ReactNode
}

/** Overlapping stack of avatars with an optional overflow count. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = 44, className, children, ...rest },
  ref,
) {
  const all = Children.toArray(children)
  const shown = max != null ? all.slice(0, max) : all
  const overflow = all.length - shown.length

  return (
    <div ref={ref} className={cx('lk-avatargroup', className)} {...rest}>
      {shown}
      {overflow > 0 && (
        <div className="lk-avatar lk-avatargroup__more" style={{ width: size, height: size }}>
          <div className="lk-avatar__inner" style={{ fontSize: Math.round(size * 0.3) }}>
            +{overflow}
          </div>
        </div>
      )}
    </div>
  )
})
