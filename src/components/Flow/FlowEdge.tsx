import { useId } from 'react'
import { cx } from '../../utils/cx'
import { edgePath, edgeMidpoint } from './geometry'
import type { FlowEdgeData, Point } from './types'

export interface FlowEdgeProps {
  edge: FlowEdgeData
  /** Resolved endpoints in world space (computed by FlowCanvas). */
  source: Point
  target: Point
}

const DEFAULT_COLORS: [string, string] = ['#37d0d6', '#5b8cff']

/**
 * One connector: a glowing gradient bezier drawn inside the canvas SVG layer,
 * with an optional flowing dash and a centered label pill. Mirrors ChartCard's
 * gradient-stroke + drop-shadow glow technique.
 */
export function FlowEdge({ edge, source, target }: FlowEdgeProps) {
  const uid = useId().replace(/:/g, '')
  const d = edgePath(source, target, edge.sourceSide ?? 'right', edge.targetSide ?? 'left')
  const [from, to] = Array.isArray(edge.color)
    ? edge.color
    : edge.color
      ? [edge.color, edge.color]
      : DEFAULT_COLORS
  const mid = edgeMidpoint(source, target)

  return (
    <g
      className={cx('lk-flow-edge', edge.selected && 'is-selected', edge.animated && 'is-animated')}
    >
      <defs>
        <linearGradient
          id={`lk-flow-edge-${uid}`}
          gradientUnits="userSpaceOnUse"
          x1={source.x}
          y1={source.y}
          x2={target.x}
          y2={target.y}
        >
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      {/* Wide transparent hit area for future interaction / easier hover. */}
      <path className="lk-flow-edge__hit" d={d} fill="none" />
      <path
        className="lk-flow-edge__line"
        d={d}
        fill="none"
        stroke={`url(#lk-flow-edge-${uid})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {edge.label != null && (
        <foreignObject
          x={mid.x - 90}
          y={mid.y - 18}
          width={180}
          height={36}
          className="lk-flow-edge__label-fo"
        >
          <div className="lk-flow-edge__label-wrap">
            <span className="lk-flow-edge__label">{edge.label}</span>
          </div>
        </foreignObject>
      )}
    </g>
  )
}
