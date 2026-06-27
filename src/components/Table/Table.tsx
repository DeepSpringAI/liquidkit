import type { CSSProperties, ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Table.css'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  /** @default 'left' */
  align?: 'left' | 'right' | 'center'
  width?: number | string
  /** Custom cell renderer. Defaults to `row[key]`. */
  render?: (row: T, index: number) => ReactNode
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  /** Stable row key. Defaults to the row index. */
  rowKey?: (row: T, index: number) => string
  /** Glass surface. Set false for an opaque card. @default true */
  glass?: boolean
  /** Zebra striping. @default false */
  striped?: boolean
  /** Highlight rows on hover. @default true */
  hover?: boolean
  /** @default 'auto' */
  tint?: GlassTint
  className?: string
  style?: CSSProperties
}

/** A data table on a glass surface, with custom renderers and per-column alignment. */
export function Table<T>({
  columns,
  data,
  rowKey,
  glass = true,
  striped = false,
  hover = true,
  tint = 'auto',
  className,
  style,
}: TableProps<T>) {
  const table = (
    <table className={cx('lk-table', striped && 'lk-table--striped', hover && 'lk-table--hover')}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ textAlign: c.align ?? 'left', width: c.width }}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={rowKey ? rowKey(row, i) : i}>
            {columns.map((c) => (
              <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                {c.render ? c.render(row, i) : ((row as Record<string, unknown>)[c.key] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

  if (!glass) {
    return (
      <div className={cx('lk-table-wrap', 'lk-table-wrap--bare', className)} style={style}>
        {table}
      </div>
    )
  }

  return (
    <LiquidGlass
      radius={18}
      tint={tint}
      sheen={false}
      elevation={1}
      className={cx('lk-table-wrap', className)}
      style={style}
    >
      {table}
    </LiquidGlass>
  )
}
