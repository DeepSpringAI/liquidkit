import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = join(__dirname, '..')

/**
 * Tokens that describe the product's voice and geometry rather than its
 * colours. They must be declared on `:root` only. liquidkit themes a portal by
 * putting `data-theme` on the portal element itself, so a token re-declared
 * under `[data-theme='…']` is re-declared *inside* that portal — silently
 * undoing an app's own override for every menu, toast and modal it renders.
 */
const THEME_INDEPENDENT = /^--lk-(font|text|tracking|leading|radius|space|duration|ease|weight)/

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return cssFiles(full)
    return full.endsWith('.css') ? [full] : []
  })
}

/** Every `--lk-*` declaration whose enclosing selector mentions `data-theme`. */
function themedDeclarations(file: string): string[] {
  const found: string[] = []
  let selector = ''
  let pending = ''

  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.replace(/\/\*.*?\*\//g, '').trim()
    if (!line) continue
    if (line.includes('{')) {
      const head = (pending + ' ' + line.slice(0, line.indexOf('{'))).trim()
      if (!head.startsWith('@')) selector = head.replace(/\s+/g, ' ')
      pending = ''
      continue
    }
    if (line === '}') {
      selector = ''
      continue
    }
    if (line.endsWith(',')) {
      pending = (pending + ' ' + line).trim()
      continue
    }
    const declared = /^(--lk-[a-z0-9-]+)\s*:/.exec(line)
    if (declared && selector.includes('data-theme') && THEME_INDEPENDENT.test(declared[1])) {
      found.push(`${selector} → ${declared[1]}`)
    }
  }
  return found
}

describe('design tokens', () => {
  it('keeps the theme-independent tokens out of every themed scope', () => {
    const offenders = cssFiles(SRC).flatMap((file) =>
      themedDeclarations(file).map((entry) => `${relative(SRC, file)}: ${entry}`),
    )
    expect(offenders).toEqual([])
  })
})
