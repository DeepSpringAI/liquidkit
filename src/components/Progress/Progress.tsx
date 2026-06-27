import { forwardRef } from 'react'
import type { CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import './Progress.css'

export interface ProgressProps {
  value: number
  max?: number
  /** @default 'bar' */
  variant?: 'bar' | 'ring'
  /** bar height or ring diameter in px */
  size?: number
  /** ring stroke thickness in px @default 8 */
  thickness?: number
  showValue?: boolean
  accent?: string
  glow?: boolean
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

/** A glass progress indicator — linear bar or circular ring. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value,
    max = 100,
    variant = 'bar',
    size,
    thickness = 8,
    showValue = false,
    accent,
    glow = false,
    className,
    style,
    ...aria
  },
  ref,
) {
  const pct = Math.max(0, Math.min(1, value / max))
  const pctText = Math.round(pct * 100)
  const vars = (accent ? { '--lk-progress-accent': accent } : {}) as CSSProperties

  if (variant === 'ring') {
    const d = size ?? 72
    const r = (d - thickness) / 2
    const c = 2 * Math.PI * r
    return (
      <div
        ref={ref}
        className={cx('lk-progress-ring', glow && 'is-glow', className)}
        style={{ width: d, height: d, ...vars, ...style }}
        role="progressbar"
        aria-valuenow={pctText}
        aria-valuemin={0}
        aria-valuemax={100}
        {...aria}
      >
        <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`}>
          <circle
            className="lk-progress-ring__track"
            cx={d / 2}
            cy={d / 2}
            r={r}
            strokeWidth={thickness}
            fill="none"
          />
          <circle
            className="lk-progress-ring__fill"
            cx={d / 2}
            cy={d / 2}
            r={r}
            strokeWidth={thickness}
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            strokeLinecap="round"
            transform={`rotate(-90 ${d / 2} ${d / 2})`}
          />
        </svg>
        {showValue && <span className="lk-progress-ring__label">{pctText}%</span>}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cx('lk-progress', glow && 'is-glow', className)}
      style={{ height: size ?? 8, ...vars, ...style }}
      role="progressbar"
      aria-valuenow={pctText}
      aria-valuemin={0}
      aria-valuemax={100}
      {...aria}
    >
      <div className="lk-progress__fill" style={{ width: `${pct * 100}%` }} />
    </div>
  )
})
