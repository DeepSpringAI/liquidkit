// Screenshot the docs site to verify the glass renders in dark + light.
// Usage: node scripts/shoot.mjs [baseUrl] [outDir]
//   PW_FULL=1      full-page captures
//   PW_ROUTES=a,b  comma-separated hash routes ('' = home)
//   PW_THEMES=dark,light
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const outDir = process.argv[3] || '.shots'

const routes = (
  process.env.PW_ROUTES ??
  ',components/button,components/liquid-glass,guide/glass-engine,icons,templates'
).split(',')
const themes = (process.env.PW_THEMES ?? 'dark,light').split(',')
const fullPage = process.env.PW_FULL === '1'

const candidates = [
  process.env.PW_CHROME,
  '/home/agent/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  '/home/agent/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome',
  '/home/agent/.cache/ms-playwright/chromium-1187/chrome-linux/chrome',
].filter(Boolean)
const executablePath = candidates.find((p) => existsSync(p))

const browser = await chromium.launch(executablePath ? { executablePath } : {})

for (const theme of themes) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  })
  // Pin the docs theme deterministically before any script runs.
  await context.addInitScript((t) => {
    try {
      localStorage.setItem('lk-docs-theme', t)
    } catch {}
  }, theme)
  const page = await context.newPage()

  for (const route of routes) {
    const url = `${base}/#/${route}`
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    const name = route === '' ? 'home' : route.replace(/\//g, '-')
    const file = `${outDir}/${name}.${theme}.png`
    await page.screenshot({ path: file, fullPage })
    console.log(`wrote ${file}`)
  }
  await context.close()
}

await browser.close()
