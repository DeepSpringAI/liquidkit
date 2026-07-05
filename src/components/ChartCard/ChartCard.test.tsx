import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ChartCard, ThemeProvider } from '@hamidrezazargham/liquidkit'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

describe('ChartCard labels', () => {
  it('renders one label per column and exposes the full name via title for hover', () => {
    const { container } = render(
      <ThemeProvider>
        <ChartCard value="$1.2M" data={MONTHS.map((_, i) => i)} labels={MONTHS} />
      </ThemeProvider>,
    )

    const labels = container.querySelectorAll('.lk-chartcard__label')
    expect(labels).toHaveLength(MONTHS.length)
    // Long names stay readable: the full text is available as a native tooltip.
    labels.forEach((el, i) => {
      expect(el.getAttribute('title')).toBe(MONTHS[i])
      expect(el.textContent).toBe(MONTHS[i])
    })

    // The column count is published so the layout can react to it.
    const row = container.querySelector('.lk-chartcard__labels') as HTMLElement
    expect(row.style.getPropertyValue('--lk-chartcard-cols')).toBe(String(MONTHS.length))
  })

  it('omits the label row when no labels are given', () => {
    const { container } = render(
      <ThemeProvider>
        <ChartCard data={[1, 2, 3]} />
      </ThemeProvider>,
    )
    expect(container.querySelector('.lk-chartcard__labels')).toBeNull()
  })
})
