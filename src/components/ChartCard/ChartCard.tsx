import { forwardRef, useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Card } from '../Card/Card'
import { cx } from '../../utils/cx'
import './ChartCard.css'

export interface ChartCardProps {
  title?: ReactNode
  value?: ReactNode
  /** Y values; rendered as a smooth glowing line. */
  data: number[]
  /** X-axis tick labels. */
  labels?: string[]
  /** Line gradient: [from, to]. Defaults to a warm gradient. */
  colors?: [string, string]
  /** Top-right slot (e.g. a like button). */
  action?: ReactNode
  /** Fill the area under the line. @default true */
  area?: boolean
  height?: number
  className?: string
  style?: CSSProperties
}

const W = 520
const PAD_X = 8
const PAD_Y = 16

function buildPoints(data: number[], h: number): [number, number][] {
  if (data.length === 0) return []
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const innerW = W - PAD_X * 2
  const innerH = h - PAD_Y * 2
  const step = data.length > 1 ? innerW / (data.length - 1) : 0
  return data.map((v, i) => [PAD_X + i * step, PAD_Y + innerH - ((v - min) / span) * innerH])
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return pts.length ? `M ${pts[0][0]} ${pts[0][1]}` : ''
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  const t = 0.18
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) * t
    const c1y = p1[1] + (p2[1] - p0[1]) * t
    const c2x = p2[0] - (p3[0] - p1[0]) * t
    const c2y = p2[1] - (p3[1] - p1[1]) * t
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}

/** A glass analytics card with a glowing smooth line chart. */
export const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(function ChartCard(
  {
    title,
    value,
    data,
    labels,
    colors = ['#ff9d4d', '#ff4d6d'],
    action,
    area = true,
    height = 180,
    className,
    style,
  },
  ref,
) {
  const uid = useId().replace(/:/g, '')
  const pts = buildPoints(data, height)
  const line = smoothPath(pts)
  const areaPath =
    pts.length > 1
      ? `${line} L ${pts[pts.length - 1][0]} ${height - PAD_Y} L ${pts[0][0]} ${height - PAD_Y} Z`
      : ''

  return (
    <Card ref={ref} radius={26} className={cx('lk-chartcard', className)} style={style}>
      <div className="lk-chartcard__head">
        <div>
          {title != null && <p className="lk-chartcard__title">{title}</p>}
          {value != null && <p className="lk-chartcard__value">{value}</p>}
        </div>
        {action && <div className="lk-chartcard__action">{action}</div>}
      </div>

      <svg
        className="lk-chartcard__chart"
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        style={{ height }}
        role="img"
      >
        <defs>
          <linearGradient id={`lk-line-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={colors[0]} />
            <stop offset="1" stopColor={colors[1]} />
          </linearGradient>
          <linearGradient id={`lk-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={colors[1]} stopOpacity="0.32" />
            <stop offset="1" stopColor={colors[1]} stopOpacity="0" />
          </linearGradient>
        </defs>
        {area && areaPath && <path d={areaPath} fill={`url(#lk-fill-${uid})`} />}
        <path
          className="lk-chartcard__line"
          d={line}
          fill="none"
          stroke={`url(#lk-line-${uid})`}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {labels && labels.length > 0 && (
        <div
          className="lk-chartcard__labels"
          style={{ '--lk-chartcard-cols': labels.length } as CSSProperties}
        >
          {labels.map((l, i) => (
            <span key={i} className="lk-chartcard__label" title={l}>
              {l}
            </span>
          ))}
        </div>
      )}
    </Card>
  )
})
