/**
 * Round a pixel dimension UP to the nearest `bucket` multiple (min one bucket).
 *
 * The glass filter is cached in `glassFilterRegistry` keyed by exact pixel size,
 * so two surfaces one pixel apart mint two separate `<filter>` nodes. Bucketing
 * the size collapses many near-identical surfaces onto one shared filter — far
 * fewer nodes, far less DOMParser churn, and no re-acquire on sub-bucket resizes.
 *
 * Rounding must be **up** (ceil), never down: the displacement map is drawn at
 * this size and stretched over the element with `preserveAspectRatio="none"`. A
 * map smaller than the element would leave an un-mapped strip at the right/bottom
 * edge whose zero R/G channel yanks the backdrop inward — a visible seam. Ceiling
 * guarantees the map covers the element; the surplus falls in the region that
 * `backdrop-filter` clips to the border box, so it is simply discarded.
 */
export const GLASS_SIZE_BUCKET = 8

export function quantizeSize(n: number, bucket: number = GLASS_SIZE_BUCKET): number {
  if (!Number.isFinite(n) || n <= 0) return bucket
  return Math.max(bucket, Math.ceil(n / bucket) * bucket)
}
