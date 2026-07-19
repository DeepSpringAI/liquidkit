import { describe, it, expect } from 'vitest'
import { quantizeSize, GLASS_SIZE_BUCKET } from './quantize'

describe('quantizeSize', () => {
  it('rounds up to the bucket, never down (a smaller map would seam)', () => {
    expect(quantizeSize(121, 8)).toBe(128)
    expect(quantizeSize(128, 8)).toBe(128)
    expect(quantizeSize(129, 8)).toBe(136)
  })

  it('never returns below one bucket', () => {
    expect(quantizeSize(1, 8)).toBe(8)
    expect(quantizeSize(0, 8)).toBe(8)
    expect(quantizeSize(-5, 8)).toBe(8)
    expect(quantizeSize(Number.NaN, 8)).toBe(8)
  })

  it('collapses nearby sizes onto one shared bucket', () => {
    expect(quantizeSize(121)).toBe(quantizeSize(124))
    expect(quantizeSize(121)).toBe(quantizeSize(127))
    expect(quantizeSize(121)).not.toBe(quantizeSize(130))
  })

  it('defaults to GLASS_SIZE_BUCKET', () => {
    expect(quantizeSize(10)).toBe(Math.ceil(10 / GLASS_SIZE_BUCKET) * GLASS_SIZE_BUCKET)
  })
})
