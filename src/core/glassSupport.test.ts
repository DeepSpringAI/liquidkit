import { describe, it, expect, afterEach } from 'vitest'
import { isGlassEngineSupported, __resetGlassSupportCache } from './glassSupport'

const REAL_UA = navigator.userAgent

function setUA(ua: string) {
  Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true })
  __resetGlassSupportCache()
}

afterEach(() => {
  Object.defineProperty(navigator, 'userAgent', { value: REAL_UA, configurable: true })
  __resetGlassSupportCache()
})

const CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
const SAFARI =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
const FIREFOX = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
const ELECTRON =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) TheSoftware/1.0 Chrome/120.0 Electron/28.0 Safari/537.36'

describe('isGlassEngineSupported', () => {
  it('is true on Chromium', () => {
    setUA(CHROME)
    expect(isGlassEngineSupported()).toBe(true)
  })

  it('is true on Electron (reports a Chrome token)', () => {
    setUA(ELECTRON)
    expect(isGlassEngineSupported()).toBe(true)
  })

  it('is false on Safari', () => {
    setUA(SAFARI)
    expect(isGlassEngineSupported()).toBe(false)
  })

  it('is false on Firefox', () => {
    setUA(FIREFOX)
    expect(isGlassEngineSupported()).toBe(false)
  })

  it('assumes supported for an unknown engine', () => {
    setUA('Some/1.0 Unknown Engine')
    expect(isGlassEngineSupported()).toBe(true)
  })

  it('caches the first result', () => {
    setUA(CHROME)
    expect(isGlassEngineSupported()).toBe(true)
    // Change UA WITHOUT resetting the cache — the memoised value must stick.
    Object.defineProperty(navigator, 'userAgent', { value: FIREFOX, configurable: true })
    expect(isGlassEngineSupported()).toBe(true)
  })
})
