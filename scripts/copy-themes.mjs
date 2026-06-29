// Copy the optional preset stylesheet into the published bundle.
// The lib build emits only the core `liquidkit.css` from the single entry;
// the presets ship as a separate, opt-in `liquidkit/themes.css`.
// Run after `vite build --mode lib` (which empties dist/).
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'src/styles/themes.css')
const dest = resolve(root, 'dist/themes.css')

if (!existsSync(dirname(dest))) mkdirSync(dirname(dest), { recursive: true })
copyFileSync(src, dest)
console.log('copied themes.css -> dist/themes.css')
