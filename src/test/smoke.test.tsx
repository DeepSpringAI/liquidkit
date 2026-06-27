import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider, ToastProvider } from '../index'
import { componentDocs } from '../../docs/registry'

/**
 * Smoke test: every documented example of every component must mount without
 * throwing. The docs registry is the canonical enumeration of the public
 * component surface, so this guarantees nothing in the catalog crashes on render
 * (in jsdom, with the matchMedia / ResizeObserver stubs from setup.ts).
 */
describe('component catalog smoke', () => {
  it('documents at least 30 components', () => {
    expect(componentDocs.length).toBeGreaterThanOrEqual(30)
  })

  for (const doc of componentDocs) {
    for (const example of doc.examples) {
      it(`${doc.name} — ${example.title}`, () => {
        expect(() =>
          render(
            <ThemeProvider>
              <ToastProvider>{example.demo}</ToastProvider>
            </ThemeProvider>,
          ),
        ).not.toThrow()
      })
    }
  }
})
