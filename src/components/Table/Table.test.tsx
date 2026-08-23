import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Table } from '@hamidrezazargham/liquidkit'

const COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'size', header: 'Size' },
]
const DATA = [{ name: 'Board pack.pdf', size: '1.4 MB' }]

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
})
