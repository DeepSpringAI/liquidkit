import { readdirSync } from 'node:fs'
import { join } from 'node:path'
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

  /**
   * The registry is only the canonical enumeration if nothing can ship without
   * being in it. Iterating it proves that what is documented mounts; this
   * proves that what exists is documented — otherwise a component lands with a
   * public export, no page, and no example anyone can copy, and the omission is
   * invisible until someone goes looking for it.
   *
   * A folder is covered when some doc's name starts with it, which is what lets
   * one folder carry a family (Flow → FlowCanvas, FlowNode, …).
   */
  it('has a registry entry for every component folder', () => {
    const folders = readdirSync(join(__dirname, '..', 'components'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
    const documented = componentDocs.map((doc) => doc.name)

    const missing = folders.filter((folder) => !documented.some((name) => name.startsWith(folder)))
    expect(missing).toEqual([])
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
