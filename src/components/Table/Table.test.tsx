import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { Table } from '@hamidrezazargham/liquidkit'

const COLUMNS = [
  { key: 'name', header: 'Name', sortKey: 'name', resizable: true, width: 200 },
  { key: 'size', header: 'Size' },
]
const DATA = [{ name: 'Board pack.pdf', size: '1.4 MB' }]
const FOLDER = [
  { name: 'Reports', kind: 'folder', size: '--' },
  { name: 'Brand', kind: 'folder', size: '--' },
  { name: 'pricing.csv', kind: 'file', size: '2 KB' },
]
const byName = (row: { name: string }) => row.name

describe('Table sticky header', () => {
  it('is off by default', () => {
    const { container } = render(<Table columns={COLUMNS} data={DATA} />)
    expect(container.querySelector('.lk-table')).not.toHaveClass('lk-table--sticky')
    expect(container.querySelector('.lk-table-wrap')).not.toHaveClass('lk-table-wrap--sticky')
  })

  it('marks the table and releases the wrapper so the header can stick', () => {
    const { container } = render(<Table columns={COLUMNS} data={DATA} stickyHeader />)
    expect(container.querySelector('.lk-table')).toHaveClass('lk-table--sticky')
    // Without this the wrapper is its own scrollport and the header sticks to a
    // box that never scrolls.
    expect(container.querySelector('.lk-table-wrap')).toHaveClass('lk-table-wrap--sticky')
  })

  it('gives the table its own scrollport when it owns the region', () => {
    const { container } = render(<Table columns={COLUMNS} data={DATA} stickyHeader scroll />)
    expect(container.querySelector('.lk-table__scroller')).toHaveClass('lk-table__scroller--own')
  })
})

describe('Table sorting', () => {
  it('makes a header with a sortKey a button and reports the click', () => {
    const onSortChange = vi.fn()
    render(<Table columns={COLUMNS} data={DATA} onSortChange={onSortChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Name' }))

    expect(onSortChange).toHaveBeenCalledWith('name')
    // A column with no order to it stays plain text.
    expect(screen.queryByRole('button', { name: 'Size' })).toBeNull()
  })

  it('says which column is ordering the rows, and which way', () => {
    const { rerender } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        sort={{ key: 'name', direction: 'asc' }}
        onSortChange={() => {}}
      />,
    )
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    )

    rerender(
      <Table
        columns={COLUMNS}
        data={DATA}
        sort={{ key: 'name', direction: 'desc' }}
        onSortChange={() => {}}
      />,
    )
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
    expect(screen.getByRole('columnheader', { name: 'Size' })).not.toHaveAttribute('aria-sort')
  })
})

describe('Table column resizing', () => {
  it('offers a keyboard-reachable separator per resizable column', () => {
    const onColumnResize = vi.fn()
    render(<Table columns={COLUMNS} data={DATA} sizedColumns onColumnResize={onColumnResize} />)

    const handles = screen.getAllByRole('separator')
    expect(handles).toHaveLength(1)

    fireEvent.keyDown(handles[0], { key: 'ArrowRight' })

    // jsdom reports every rect as zero, so a nudge lands on the floor — the
    // point being that the keyboard reaches the same code the drag does.
    expect(onColumnResize).toHaveBeenCalledWith('name', 64)
  })

  it('leaves the handles out unless the columns are sized', () => {
    render(<Table columns={COLUMNS} data={DATA} />)
    expect(screen.queryAllByRole('separator')).toHaveLength(0)
  })
})

describe('Table grouping', () => {
  it('heads each run of rows with its group and a count', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={FOLDER}
        rowKey={byName}
        groupOf={(row) => ({ key: row.kind, label: row.kind === 'folder' ? 'Folders' : 'Files' })}
      />,
    )

    const headings = container.querySelectorAll('.lk-table__group')
    expect(headings).toHaveLength(2)
    expect(headings[0]).toHaveTextContent('Folders2 items')
    expect(headings[1]).toHaveTextContent('Files1 item')
  })

  it('heads each run, so an ordering that interleaves two groups gets both', () => {
    const interleaved = [
      { name: 'pricing.csv', kind: 'file', size: '2 KB' },
      { name: 'Reports', kind: 'folder', size: '--' },
      { name: 'notes.txt', kind: 'file', size: '1 KB' },
    ]
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={interleaved}
        rowKey={byName}
        groupOf={(row) => ({ key: row.kind, label: row.kind })}
      />,
    )

    // Three runs, three headings — and three distinct React keys, or the rows
    // between them get duplicated or dropped.
    expect(container.querySelectorAll('.lk-table__group')).toHaveLength(3)
    expect(container.querySelectorAll('tbody tr')).toHaveLength(6)
  })

  it('counts the stripe over the data, so a heading does not restart it', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={FOLDER}
        rowKey={byName}
        striped
        groupOf={(row) => ({ key: row.kind, label: row.kind })}
      />,
    )

    const striped = [...container.querySelectorAll('tbody tr')].map((row) =>
      row.classList.contains('is-striped'),
    )
    // group, row 0, row 1, group, row 2
    expect(striped).toEqual([false, false, true, false, false])
  })
})

describe('Table selection and activation', () => {
  it('marks the selected rows and reports clicks and double-clicks', () => {
    const onRowClick = vi.fn()
    const onRowActivate = vi.fn()
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={FOLDER}
        rowKey={byName}
        selectedKeys={['Brand']}
        onRowClick={onRowClick}
        onRowActivate={onRowActivate}
      />,
    )

    const rows = container.querySelectorAll('tbody tr')
    expect(rows[1]).toHaveClass('is-selected')
    expect(rows[1]).toHaveAttribute('aria-selected', 'true')
    expect(rows[0]).toHaveAttribute('aria-selected', 'false')

    fireEvent.click(rows[0])
    expect(onRowClick).toHaveBeenCalledWith(FOLDER[0], 0, expect.anything())

    fireEvent.doubleClick(rows[2])
    expect(onRowActivate).toHaveBeenCalledWith(FOLDER[2], 2)

    // The same reach from the keyboard, which double-click has none of.
    fireEvent.keyDown(rows[2], { key: 'Enter' })
    expect(onRowActivate).toHaveBeenCalledTimes(2)
  })

  it('is one tab stop however many rows are selected', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={FOLDER}
        rowKey={byName}
        selectedKeys={['Reports', 'Brand']}
        onRowActivate={() => {}}
      />,
    )

    const stops = [...container.querySelectorAll('tbody tr')].map((row) =>
      row.getAttribute('tabindex'),
    )
    // The first selected row takes the stop; a grid with two is two stops, and
    // then tabbing through the page walks the list instead of leaving it.
    expect(stops).toEqual(['0', '-1', '-1'])
  })

  it('falls back to the first row when the selection is not on screen', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={FOLDER}
        rowKey={byName}
        selectedKeys={['gone.pdf']}
        onRowActivate={() => {}}
      />,
    )
    expect(container.querySelector('tbody tr')).toHaveAttribute('tabindex', '0')
  })

  it('walks the rows with the arrow keys, which is how a grid is read', () => {
    const { container } = render(
      <Table columns={COLUMNS} data={FOLDER} rowKey={byName} onRowActivate={() => {}} />,
    )

    const rows = [...container.querySelectorAll<HTMLTableRowElement>('tbody tr')]
    rows[0].focus()
    fireEvent.keyDown(rows[0], { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rows[1])

    fireEvent.keyDown(rows[1], { key: 'ArrowUp' })
    expect(document.activeElement).toBe(rows[0])

    // Nothing above the first row, so focus stays where it is.
    fireEvent.keyDown(rows[0], { key: 'ArrowUp' })
    expect(document.activeElement).toBe(rows[0])
  })
})

describe('Table loading', () => {
  it('draws its own shape while a first load has nothing to show', () => {
    const { container } = render(
      <Table columns={COLUMNS} data={[]} loading skeletonRows={4} busyLabel="Loading files…" />,
    )

    expect(container.querySelectorAll('.lk-table__skeleton')).toHaveLength(4)
    expect(container.querySelector('.lk-table__bar')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading files…')
  })

  it('keeps the rows and reports on top of them when a reload is in flight', () => {
    const { container } = render(<Table columns={COLUMNS} data={DATA} rowKey={byName} loading />)

    expect(container.querySelectorAll('.lk-table__skeleton')).toHaveLength(0)
    expect(screen.getByText('Board pack.pdf')).toBeInTheDocument()
    expect(container.querySelector('.lk-table__bar')).toBeInTheDocument()
  })

  it('says the list is empty only once nothing is still arriving', () => {
    const { rerender } = render(
      <Table columns={COLUMNS} data={[]} loading emptyState="Nothing here." />,
    )
    expect(screen.queryByText('Nothing here.')).toBeNull()

    rerender(<Table columns={COLUMNS} data={[]} emptyState="Nothing here." />)
    expect(screen.getByText('Nothing here.')).toBeInTheDocument()
  })
})

describe('Table density', () => {
  it('is comfortable unless asked otherwise', () => {
    const { container, rerender } = render(<Table columns={COLUMNS} data={DATA} />)
    expect(container.querySelector('.lk-table')).toHaveClass('lk-table--comfortable')

    rerender(<Table columns={COLUMNS} data={DATA} density="compact" />)
    expect(container.querySelector('.lk-table')).toHaveClass('lk-table--compact')
  })

  it('renders the same cells either way', () => {
    render(<Table columns={COLUMNS} data={DATA} density="compact" rowKey={byName} />)
    const row = screen.getAllByRole('row')[1]
    expect(within(row).getByText('1.4 MB')).toBeInTheDocument()
  })
})
