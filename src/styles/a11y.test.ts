import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = join(__dirname, '..')
const A11Y = join(SRC, 'styles/a11y.css')

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return cssFiles(full)
    return full.endsWith('.css') && full !== A11Y ? [full] : []
  })
}

/**
 * Every selector that sets `backdrop-filter`, paired with the file it came
 * from. Deliberately a hand-rolled line scan rather than a CSS parser: the
 * rule we're enforcing is about the literal selector text a maintainer reads,
 * and a dependency-free check keeps this honest in a zero-dependency library.
 */
function backdropSelectors(file: string): string[] {
  const found: string[] = []
  let pending = ''
  let current = ''

  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.replace(/\/\*.*?\*\//g, '').trim()
    if (!line || line.startsWith('*') || line.startsWith('/*')) continue

    if (line.includes('{')) {
      const head = (pending + ' ' + line.slice(0, line.indexOf('{'))).trim()
      // @media / @supports open a block but don't own declarations.
      if (!head.startsWith('@')) current = head.replace(/\s+/g, ' ')
      pending = ''
      continue
    }
    if (line.endsWith(',')) {
      pending = (pending + ' ' + line).trim()
      continue
    }
    if (line.startsWith('backdrop-filter') && !line.includes('none')) {
      if (current) found.push(current)
    }
  }
  return [...new Set(found)]
}

describe('accessibility material layer', () => {
  const a11y = readFileSync(A11Y, 'utf8')

  it('neutralises translucency for prefers-reduced-transparency', () => {
    expect(a11y).toContain('prefers-reduced-transparency: reduce')
  })

  it('provides a high-contrast surface for prefers-contrast: more', () => {
    expect(a11y).toContain('prefers-contrast: more')
  })

  it('prefixes its overrides with `html` so they outrank component CSS', () => {
    // a11y.css is imported from src/index.ts and therefore bundles *before* the
    // component stylesheets, which are pulled in by the component modules. At
    // equal specificity the component would win and the frost would survive, so
    // every override here carries an extra element for the +0-0-1.
    const overrides = a11y
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('.lk-'))
    expect(overrides).toEqual([])
  })

  const offenders: string[] = []

  for (const file of cssFiles(SRC)) {
    for (const selector of backdropSelectors(file)) {
      const covered = selector
        .split(',')
        .map((part) => part.trim())
        .some((part) => part && a11y.includes(part))
      if (!covered) offenders.push(`${relative(SRC, file)} → ${selector}`)
    }
  }

  it('covers every backdrop-filter site in src/', () => {
    // A new glass surface must opt into the reduced-transparency and
    // high-contrast fallbacks, or users with those settings on still get the
    // full frost. Add the selector to src/styles/a11y.css.
    expect(offenders).toEqual([])
  })
})
