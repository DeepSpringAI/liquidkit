import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { ChevronDownIcon, ChevronUpIcon } from '../../icons'
import { Progress } from '../Progress/Progress'
import { cx } from '../../utils/cx'
import './Table.css'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  /** @default 'left' */
  align?: 'left' | 'right' | 'center'
  width?: number | string
  /** How narrow a drag may take this column. @default 64 */
  minWidth?: number
  /**
   * Makes the header a sort button and hands this value back to `onSortChange`.
   * Leave it out for a column there is no sensible order for.
   */
  sortKey?: string
  /** Adds a drag handle to this column's trailing edge. Needs `sizedColumns`. */
  resizable?: boolean
  /** Custom cell renderer. Defaults to `row[key]`. */
  render?: (row: T, index: number) => ReactNode
}

export interface TableSort {
  key: string
  direction: 'asc' | 'desc'
}

/** The heading a run of rows sits under. */
export interface TableGroup {
  key: string
  label: ReactNode
}

export type TableDensity = 'comfortable' | 'compact'

export interface TableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  columns: TableColumn<T>[]
  data: T[]
  /** Stable row key. Defaults to the row index. */
  rowKey?: (row: T, index: number) => string
  /** Glass surface. Set false for an opaque card. @default true */
  glass?: boolean
  /** Zebra striping, counted over data rows so group headings do not reset it. @default false */
  striped?: boolean
  /** Highlight rows on hover. @default true */
  hover?: boolean
  /**
   * Pin the header row to the top of whatever region scrolls the table, so the
   * columns stay named while their rows move under them.
   * @default false
   */
  stickyHeader?: boolean
  /**
   * Row and cell metrics. `compact` is the desktop file-manager density — a
   * 31 px header over 32 px rows, single-line and ellipsised.
   * @default 'comfortable'
   */
  density?: TableDensity
  /** Corner radius of the panel in px. @default 18 */
  radius?: number
  /**
   * Let the table own its own scroll region, so it reads as one bordered object
   * that fills the space it is given rather than as a block that grows.
   * @default false
   */
  scroll?: boolean
  /** Which column is ordering the rows, and which way. */
  sort?: TableSort | null
  /** A sortable header was clicked. The caller owns the ordering. */
  onSortChange?: (key: string) => void
  /**
   * Turns on `table-layout: fixed`, which is what makes a column's width — and
   * therefore a drag on it — mean anything.
   * @default false
   */
  sizedColumns?: boolean
  /** A column was dragged to a new width. */
  onColumnResize?: (key: string, width: number) => void
  /** Accessible name for a column's drag handle. @default 'Resize column' */
  resizeLabel?: string
  /** An extra class per row, for a state only the caller knows about. */
  rowClassName?: (row: T, index: number) => string | undefined
  /** Row keys drawn as selected. */
  selectedKeys?: readonly string[]
  onRowClick?: (row: T, index: number, event: MouseEvent<HTMLTableRowElement>) => void
  /** Double-click, or Enter on a focused row. */
  onRowActivate?: (row: T, index: number) => void
  onRowContextMenu?: (row: T, index: number, event: MouseEvent<HTMLTableRowElement>) => void
  /** The heading a row belongs under. A run of rows sharing a key gets one. */
  groupOf?: (row: T, index: number) => TableGroup | null
  /**
   * How the count beside a group heading is worded. The default counts in
   * English; anything that ships in more than one language has to say so here.
   */
  groupCountLabel?: (count: number) => ReactNode
  /** Work is in flight: a bar rides the panel's top edge, inside its corners. */
  loading?: boolean
  /** Names that work on a pill floating over the rows. */
  busyLabel?: ReactNode
  /** How much shape to draw while a first load has nothing to show. @default 8 */
  skeletonRows?: number
  /** Shown in place of the rows when there are none and nothing is loading. */
  emptyState?: ReactNode
  /** @default 'auto' */
  tint?: GlassTint
}

/** One entry in the flattened render order: a group heading, or a row. */
type Line<T> =
  | { kind: 'group'; key: string; label: ReactNode; count: number }
  | { kind: 'row'; key: string; row: T; index: number; stripe: boolean }

function toLines<T>(
  data: T[],
  rowKey: ((row: T, index: number) => string) | undefined,
  groupOf: ((row: T, index: number) => TableGroup | null) | undefined,
): Line<T>[] {
  const lines: Line<T>[] = []
  let open: Extract<Line<T>, { kind: 'group' }> | null = null
  let openKey: string | null = null

  data.forEach((row, index) => {
    const group = groupOf?.(row, index) ?? null
    if (group && group.key !== openKey) {
      openKey = group.key
      // Keyed by where the run starts, not by the group alone: an ordering that
      // interleaves two groups gives the same key more than one run, and two
      // headings sharing a React key have rows duplicated or dropped between
      // them.
      open = { kind: 'group', key: `group:${group.key}:${index}`, label: group.label, count: 0 }
      lines.push(open)
    }
    if (open) open.count += 1
    lines.push({
      kind: 'row',
      key: rowKey ? rowKey(row, index) : String(index),
      row,
      index,
      // Counted over the data, not over the rendered lines: a group heading in
      // the middle must not restart the alternation under it.
      stripe: index % 2 === 1,
    })
  })

  return lines
}

/** The header cell for a sortable column: a button with a caret on the active one. */
function SortButton({
  label,
  sortKey,
  sort,
  onSortChange,
}: {
  label: ReactNode
  sortKey: string
  sort: TableSort | null | undefined
  onSortChange: (key: string) => void
}) {
  const active = sort?.key === sortKey
  return (
    <button
      type="button"
      className={cx('lk-table__sort', active && 'is-active')}
      onClick={() => onSortChange(sortKey)}
    >
      <span className="lk-table__sort-label">{label}</span>
      {active &&
        (sort?.direction === 'asc' ? <ChevronUpIcon size={11} /> : <ChevronDownIcon size={11} />)}
    </button>
  )
}

const RESIZE_STEP = 16

/** The count beside a group heading, in English, until a caller says otherwise. */
const defaultGroupCount = (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`

/** A data table on a glass surface, at web or desktop-file-manager density. */
export function Table<T>({
  columns,
  data,
  rowKey,
  glass = true,
  striped = false,
  hover = true,
  stickyHeader = false,
  density = 'comfortable',
  radius = 18,
  scroll = false,
  sort,
  onSortChange,
  sizedColumns = false,
  onColumnResize,
  resizeLabel = 'Resize column',
  rowClassName,
  selectedKeys,
  onRowClick,
  onRowActivate,
  onRowContextMenu,
  groupOf,
  groupCountLabel = defaultGroupCount,
  loading = false,
  busyLabel,
  skeletonRows = 8,
  emptyState,
  tint = 'auto',
  className,
  style,
  ...rest
}: TableProps<T>) {
  // Dragged widths, which override a column's declared one until that column
  // leaves the set.
  const [widths, setWidths] = useState<Record<string, number>>({})

  const selected = useMemo(() => new Set(selectedKeys ?? []), [selectedKeys])
  const lines = useMemo(() => toLines(data, rowKey, groupOf), [data, rowKey, groupOf])

  const resize = useCallback(
    (key: string, width: number, min: number) => {
      const next = Math.round(Math.max(min, width))
      setWidths((current) => (current[key] === next ? current : { ...current, [key]: next }))
      onColumnResize?.(key, next)
    },
    [onColumnResize],
  )

  /**
   * A drag on a separator. The pointer is captured on the handle, so the drag
   * survives the pointer leaving the 7 px strip — which it immediately does.
   */
  const startDrag = useCallback(
    (event: PointerEvent<HTMLSpanElement>, column: TableColumn<T>) => {
      const cell = event.currentTarget.closest('th')
      if (!cell) return
      event.preventDefault()
      const handle = event.currentTarget
      const min = column.minWidth ?? 64
      const startX = event.clientX
      const startWidth = cell.getBoundingClientRect().width

      handle.setPointerCapture(event.pointerId)
      const move = (moved: globalThis.PointerEvent) =>
        resize(column.key, startWidth + (moved.clientX - startX), min)
      const stop = () => {
        handle.removeEventListener('pointermove', move)
        handle.removeEventListener('pointerup', stop)
        handle.removeEventListener('pointercancel', stop)
      }
      handle.addEventListener('pointermove', move)
      handle.addEventListener('pointerup', stop)
      handle.addEventListener('pointercancel', stop)
    },
    [resize],
  )

  /** The same drag from the keyboard, which is the only one some people have. */
  const nudge = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>, column: TableColumn<T>) => {
      const step =
        event.key === 'ArrowLeft' ? -RESIZE_STEP : event.key === 'ArrowRight' ? RESIZE_STEP : 0
      if (!step) return
      const cell = event.currentTarget.closest('th')
      if (!cell) return
      event.preventDefault()
      resize(column.key, cell.getBoundingClientRect().width + step, column.minWidth ?? 64)
    },
    [resize],
  )

  // A column that leaves the set takes its dragged width with it, so bringing
  // it back does not restore a size set for a different set of columns.
  const columnKeys = columns.map((c) => c.key).join(' ')
  useEffect(() => {
    const live = new Set(columnKeys.split(' '))
    setWidths((current) => {
      const kept = Object.keys(current).filter((key) => live.has(key))
      if (kept.length === Object.keys(current).length) return current
      return Object.fromEntries(kept.map((key) => [key, current[key]]))
    })
  }, [columnKeys])

  // Selection and activation make this an ARIA grid rather than a static
  // table: rows become reachable, and `aria-selected` means something.
  const grid = Boolean(selectedKeys || onRowClick || onRowActivate || onRowContextMenu)

  // The grid is one tab stop, so exactly one row may carry tabIndex 0: the
  // first selected row, or the first row when nothing is selected. Asking each
  // row whether it is selected instead makes a multi-selection as many tab
  // stops as it has rows, which is the thing the pattern exists to prevent.
  const tabStopKey = useMemo(() => {
    const rows = lines.filter((line) => line.kind === 'row')
    return (rows.find((line) => selected.has(line.key)) ?? rows[0])?.key
  }, [lines, selected])

  /** Up and down the rows, which is the only way a keyboard walks a grid. */
  const walk = useCallback((event: KeyboardEvent<HTMLTableRowElement>) => {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
    if (!step || event.target !== event.currentTarget) return
    const rows = [
      ...(event.currentTarget
        .closest('tbody')
        ?.querySelectorAll<HTMLTableRowElement>('tr[data-row]') ?? []),
    ]
    const next = rows[rows.indexOf(event.currentTarget) + step]
    if (!next) return
    event.preventDefault()
    next.focus()
  }, [])

  const showSkeleton = loading && data.length === 0
  const showEmpty = !loading && data.length === 0 && emptyState != null

  const table = (
    <table
      role={grid ? 'grid' : undefined}
      className={cx(
        'lk-table',
        `lk-table--${density}`,
        striped && 'lk-table--striped',
        hover && 'lk-table--hover',
        stickyHeader && 'lk-table--sticky',
        sizedColumns && 'lk-table--sized',
      )}
    >
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              scope="col"
              aria-sort={
                !c.sortKey
                  ? undefined
                  : sort?.key !== c.sortKey
                    ? 'none'
                    : sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
              }
              style={{ textAlign: c.align ?? 'left', width: widths[c.key] ?? c.width }}
            >
              {c.sortKey && onSortChange ? (
                <SortButton
                  label={c.header}
                  sortKey={c.sortKey}
                  sort={sort}
                  onSortChange={onSortChange}
                />
              ) : (
                c.header
              )}
              {sizedColumns && c.resizable && (
                // A focusable separator is a window splitter, which ARIA
                // defines as a widget — it is meant to take focus and answer
                // the arrow keys. Both rules read `separator` off their
                // non-interactive list and stop there. Scoped to this element,
                // so the rest of the table keeps both checks.
                /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
                <span
                  role="separator"
                  aria-orientation="vertical"
                  aria-label={resizeLabel}
                  /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                  tabIndex={0}
                  className="lk-table__handle"
                  onPointerDown={(event) => startDrag(event, c)}
                  onKeyDown={(event) => nudge(event, c)}
                />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {showSkeleton &&
          Array.from({ length: skeletonRows }, (_, i) => (
            <tr key={`skeleton-${i}`} className="lk-table__skeleton" aria-hidden="true">
              {columns.map((c) => (
                <td key={c.key}>
                  <span className="lk-table__shimmer" />
                </td>
              ))}
            </tr>
          ))}

        {showEmpty && (
          <tr className="lk-table__empty">
            <td colSpan={columns.length}>{emptyState}</td>
          </tr>
        )}

        {lines.map((line) =>
          line.kind === 'group' ? (
            <tr key={line.key} className="lk-table__group">
              <th scope="colgroup" colSpan={columns.length}>
                <span className="lk-table__group-label">{line.label}</span>
                <span className="lk-table__group-count">{groupCountLabel(line.count)}</span>
              </th>
            </tr>
          ) : (
            <tr
              key={line.key}
              role={grid ? 'row' : undefined}
              data-row={grid ? '' : undefined}
              className={cx(
                striped && line.stripe && 'is-striped',
                selected.has(line.key) && 'is-selected',
                rowClassName?.(line.row, line.index),
              )}
              aria-selected={grid && selectedKeys ? selected.has(line.key) : undefined}
              tabIndex={grid ? (line.key === tabStopKey ? 0 : -1) : undefined}
              onClick={onRowClick && ((event) => onRowClick(line.row, line.index, event))}
              onDoubleClick={onRowActivate && (() => onRowActivate(line.row, line.index))}
              onContextMenu={
                onRowContextMenu && ((event) => onRowContextMenu(line.row, line.index, event))
              }
              onKeyDown={
                grid
                  ? (event) => {
                      if (event.key === 'Enter' && event.target === event.currentTarget) {
                        event.preventDefault()
                        onRowActivate?.(line.row, line.index)
                        return
                      }
                      walk(event)
                    }
                  : undefined
              }
            >
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                  {c.render
                    ? c.render(line.row, line.index)
                    : ((line.row as Record<string, unknown>)[c.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ),
        )}
      </tbody>
    </table>
  )

  // The bar and the pill are siblings of the scroller rather than rows in it:
  // they report on the whole list, so they must not scroll away from it.
  const body = (
    <>
      <div className={cx('lk-table__scroller', scroll && 'lk-table__scroller--own')}>{table}</div>
      {loading && (
        <Progress
          indeterminate
          size={3}
          className="lk-table__bar"
          aria-label={typeof busyLabel === 'string' ? busyLabel : 'Loading'}
        />
      )}
      {loading && busyLabel != null && (
        <div className="lk-table__pill" role="status">
          <Progress indeterminate variant="ring" size={14} thickness={2} />
          <span>{busyLabel}</span>
        </div>
      )}
    </>
  )

  const wrapClass = cx(
    'lk-table-wrap',
    stickyHeader && 'lk-table-wrap--sticky',
    scroll && 'lk-table-wrap--scroll',
    className,
  )

  if (!glass) {
    return (
      <div
        className={cx(wrapClass, 'lk-table-wrap--bare')}
        style={{ borderRadius: radius, ...style } as CSSProperties}
        {...rest}
      >
        {body}
      </div>
    )
  }

  return (
    <LiquidGlass
      radius={radius}
      tint={tint}
      sheen={false}
      elevation={1}
      {...rest}
      className={wrapClass}
      style={style}
    >
      {body}
    </LiquidGlass>
  )
}
