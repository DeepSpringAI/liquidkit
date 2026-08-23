import { useCallback, useEffect, useRef, useState } from 'react'
import type { SidebarProps } from './Sidebar'

export interface UseSidebarStateOptions {
  /** Where the width and the collapsed flag are remembered. Omit to forget. */
  storageKey?: string
  /** @default 272 */
  defaultWidth?: number
  /** @default 272 */
  minWidth?: number
  /** @default 460 */
  maxWidth?: number
  /** @default false */
  defaultCollapsed?: boolean
}

export interface SidebarState {
  width: number
  collapsed: boolean
  setWidth: (width: number) => void
  setCollapsed: (collapsed: boolean) => void
  toggle: () => void
  /** Spread onto `<Sidebar>` — the furniture half of this hook's answer. */
  props: Required<
    Pick<
      SidebarProps,
      | 'width'
      | 'minWidth'
      | 'maxWidth'
      | 'collapsed'
      | 'resizable'
      | 'onResize'
      | 'onToggleCollapsed'
    >
  >
}

interface Stored {
  width?: number
  collapsed?: boolean
}

function read(key: string): Stored | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Stored) : null
  } catch {
    // A blocked or corrupt store is not a reason to refuse to render furniture.
    return null
  }
}

/**
 * The sidebar's own state: how wide it is, whether it is a rail, and the memory
 * of both across reloads.
 *
 * It is a hook rather than internal component state because the app around the
 * sidebar has to answer to the same two facts — a brand mark that becomes an
 * expander when collapsed, a header that changes what it is for. Handing that
 * state out, and handing the wiring back as `props`, keeps both in step without
 * either side owning the other.
 */
export function useSidebarState(options: UseSidebarStateOptions = {}): SidebarState {
  const {
    storageKey,
    defaultWidth = 272,
    minWidth = 272,
    maxWidth = 460,
    defaultCollapsed = false,
  } = options

  const [width, setWidthRaw] = useState(defaultWidth)
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  // The stored answer arrives one paint late (the server cannot read it), so
  // the first write has to be skipped or it would overwrite what it just read.
  const loaded = useRef(false)

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return
    const stored = read(storageKey)
    if (stored?.width != null) {
      setWidthRaw(Math.min(maxWidth, Math.max(minWidth, stored.width)))
    }
    if (stored?.collapsed != null) setCollapsed(stored.collapsed)
    loaded.current = true
  }, [storageKey, minWidth, maxWidth])

  useEffect(() => {
    if (!storageKey || !loaded.current || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ width, collapsed }))
    } catch {
      // Remembering is a courtesy; failing to is not worth an exception.
    }
  }, [storageKey, width, collapsed])

  const setWidth = useCallback(
    (next: number) => setWidthRaw(Math.min(maxWidth, Math.max(minWidth, Math.round(next)))),
    [minWidth, maxWidth],
  )
  const toggle = useCallback(() => setCollapsed((current) => !current), [])

  return {
    width,
    collapsed,
    setWidth,
    setCollapsed,
    toggle,
    props: {
      width,
      minWidth,
      maxWidth,
      collapsed,
      resizable: true,
      onResize: setWidth,
      onToggleCollapsed: toggle,
    },
  }
}
