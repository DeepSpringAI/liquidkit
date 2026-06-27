import type { Ref, MutableRefObject } from 'react'

/** Merge multiple refs into a single callback ref. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): (node: T | null) => void {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') ref(node)
      else (ref as MutableRefObject<T | null>).current = node
    }
  }
}
