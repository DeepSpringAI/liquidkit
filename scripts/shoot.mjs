// Screenshot the playground in dark + light to verify the glass renders.
// Usage: node scripts/shoot.mjs [url] [outDir]
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'

const url = process.argv[2] || 'http://localhost:5174'
const outDir = process.argv[3] || '.shots'

// Pick a cached browser build if the bundled revision isn't present.
const candidates = [
  process.env.PW_CHROME,
  '/home/agent/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  '/home/agent/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome',
  '/home/agent/.cache/ms-playwright/chromium-1187/chrome-linux/chrome',
].filter(Boolean)
const executablePath = candidates.find((p) => existsSync(p))

const browser = await chromium.launch(executablePath ? { executablePath } : {})
const page = await browser.newPage({
  viewport: { width: 1280, height: 880 },
  deviceScaleFactor: 2,
})
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

const fullPage = process.env.PW_FULL === '1'
await page.screenshot({ path: `${outDir}/dark.png`, fullPage })
console.log(`wrote ${outDir}/dark.png`)

// Flip to light via the header theme toggle.
const toggle = page.locator('.stage__top .lk-switch__control')
if (await toggle.count()) {
  await toggle.click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${outDir}/light.png`, fullPage })
  console.log(`wrote ${outDir}/light.png`)
}

await browser.close()
