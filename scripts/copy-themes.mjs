// Copy the optional stylesheets into the published bundle.
// The lib build emits only the core `liquidkit.css` from the single entry;
// the preset themes and raw palette swatches ship as separate, opt-in
// `liquidkit/themes.css` and `liquidkit/palettes.css`.
// Run after `vite build --mode lib` (which empties dist/).
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assets = ['themes.css', 'palettes.css']

for (const file of assets) {
  const src = resolve(root, 'src/styles', file)
  const dest = resolve(root, 'dist', file)
  if (!existsSync(dirname(dest))) mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(src, dest)
  console.log(`copied ${file} -> dist/${file}`)
}
