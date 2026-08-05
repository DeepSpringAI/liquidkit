import { describe, expect, it } from 'vitest'
import { DECELERATION, VelocityTracker, projectMomentum, rubberband } from './momentum'

describe('projectMomentum', () => {
  it('matches Apple’s reference projection', () => {
    // (v / 1000) * d / (1 - d), d = 0.998 → v * 0.499
    expect(projectMomentum(1000)).toBeCloseTo(499, 5)
    expect(projectMomentum(2000)).toBeCloseTo(998, 5)
  })

  it('carries the sign of the gesture', () => {
    expect(projectMomentum(-1000)).toBeCloseTo(-499, 5)
  })

  it('coasts further at the normal rate than the fast rate', () => {
    expect(projectMomentum(1000, DECELERATION.normal)).toBeGreaterThan(
      projectMomentum(1000, DECELERATION.fast),
    )
  })

  it('is not the textbook v²/2a form', () => {
    // The quadratic form would make a 2× flick travel 4× as far; Apple's is linear.
    expect(projectMomentum(2000) / projectMomentum(1000)).toBeCloseTo(2, 5)
  })

  it('returns 0 for degenerate input', () => {
    expect(projectMomentum(0)).toBe(0)
    expect(projectMomentum(Number.NaN)).toBe(0)
    expect(projectMomentum(1000, 0)).toBe(0)
    expect(projectMomentum(1000, 1)).toBe(0)
  })
})

describe('rubberband', () => {
  it('resists progressively — never exceeding the overshoot', () => {
    const a = rubberband(50, 400)
    const b = rubberband(200, 400)
    expect(a).toBeLessThan(50)
    expect(b).toBeLessThan(200)
    expect(b).toBeGreaterThan(a)
    // Doubling the drag adds less than double the movement.
    expect(rubberband(100, 400) / a).toBeLessThan(2)
  })

  it('is symmetric about zero', () => {
    expect(rubberband(-80, 400)).toBeCloseTo(-rubberband(80, 400), 10)
  })

  it('is 0 at the boundary and for a zero-size surface', () => {
    expect(rubberband(0, 400)).toBe(0)
    expect(rubberband(80, 0)).toBe(0)
  })
})

describe('VelocityTracker', () => {
  it('needs two samples before it reports anything', () => {
    const t = new VelocityTracker()
    expect(t.velocity()).toBe(0)
    t.add(0, 0)
    expect(t.velocity()).toBe(0)
  })

  it('estimates units per second', () => {
    const t = new VelocityTracker()
    t.add(0, 0)
    t.add(50, 50) // 50 units in 50ms → 1000/s
    expect(t.velocity()).toBeCloseTo(1000, 5)
  })

  it('ignores samples outside the window, so a stall does not fake a flick', () => {
    const t = new VelocityTracker(100)
    t.add(0, 0)
    t.add(500, 1000) // ancient
    t.add(510, 1050)
    t.add(520, 1100)
    // Only the recent, slow samples should count — not the huge stale jump.
    expect(t.velocity()).toBeCloseTo(200, 5)
  })

  it('keeps a pair of samples even when both are stale', () => {
    const t = new VelocityTracker(100)
    t.add(0, 0)
    t.add(10, 10)
    t.add(20, 9999)
    expect(Number.isFinite(t.velocity())).toBe(true)
  })

  it('reports 0 when time does not advance', () => {
    const t = new VelocityTracker()
    t.add(0, 5)
    t.add(100, 5)
    expect(t.velocity()).toBe(0)
  })

  it('resets', () => {
    const t = new VelocityTracker()
    t.add(0, 0)
    t.add(50, 50)
    t.reset()
    expect(t.velocity()).toBe(0)
  })
})
