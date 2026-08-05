/**
 * Gesture momentum primitives, ported from Apple's *Designing Fluid
 * Interfaces* (WWDC 2018) sample code.
 *
 * The point of all of this: when a gesture ends, the interface should settle
 * where the gesture was *going*, not where the finger happened to lift. A flick
 * that releases just below a snap point should still land above it.
 */

/** UIScrollView's two documented deceleration rates. */
export const DECELERATION = {
  /** `UIScrollView.DecelerationRate.normal` — standard scroll feel. */
  normal: 0.998,
  /** `UIScrollView.DecelerationRate.fast` — snappier, settles sooner. */
  fast: 0.99,
} as const

/**
 * Distance a value will still travel after release, given its velocity.
 *
 * This is the exponential-decay form Apple actually ships — deliberately *not*
 * the physics-textbook `v² / (2·a)`, which decelerates far too aggressively and
 * makes flicks feel short.
 *
 * @param velocity Release velocity, in units per second.
 * @param decelerationRate Between 0 and 1, exclusive. Higher coasts further.
 * @returns Signed distance still to travel, in the same units as `velocity`.
 */
export function projectMomentum(
  velocity: number,
  decelerationRate: number = DECELERATION.normal,
): number {
  if (!Number.isFinite(velocity) || velocity === 0) return 0
  if (!(decelerationRate > 0 && decelerationRate < 1)) return 0
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

/**
 * Progressive resistance past a boundary — the further you drag, the less the
 * surface follows, so an edge reads as "responsive, but there's nothing more
 * here" rather than as a frozen UI.
 *
 * @param overshoot How far past the boundary the pointer has travelled.
 * @param dimension The size of the dragged surface along that axis.
 * @param constant iOS uses 0.55.
 * @returns The damped offset to actually apply.
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  if (dimension <= 0) return 0
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}

/** A single sample of a tracked value. */
interface Sample {
  value: number
  time: number
}

/**
 * Rolling velocity estimate over a short window of samples.
 *
 * A single-frame delta is far too noisy to steer a decision with — one stalled
 * frame at release reads as "velocity zero" and the flick dies. Averaging over
 * the last few samples is what makes the handoff feel like one continuous
 * motion instead of two separate ones.
 */
export class VelocityTracker {
  private samples: Sample[] = []

  /** Samples older than this (ms) are dropped before estimating. */
  constructor(private readonly window = 100) {}

  /** Record the tracked value. `time` is injectable so tests stay deterministic. */
  add(value: number, time: number = performance.now()): void {
    this.samples.push({ value, time })
    const cutoff = time - this.window
    while (this.samples.length > 2 && this.samples[0].time < cutoff) this.samples.shift()
  }

  /** @returns Velocity in units per second — 0 until there's enough signal. */
  velocity(): number {
    if (this.samples.length < 2) return 0
    const first = this.samples[0]
    const last = this.samples[this.samples.length - 1]
    const dt = last.time - first.time
    if (dt <= 0) return 0
    return ((last.value - first.value) / dt) * 1000
  }

  reset(): void {
    this.samples = []
  }
}
