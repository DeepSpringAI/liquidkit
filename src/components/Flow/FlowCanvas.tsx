import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { Menu, type MenuItem } from '../Menu/Menu'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/mergeRefs'
import { useSize } from '../../utils/useSize'
import { FlowContext, type FlowContextValue } from './FlowContext'
import { FlowEdge } from './FlowEdge'
import { FlowNode } from './FlowNode'
import { nodePortPoint } from './geometry'
import { usePanZoom, computeFitTransform } from './usePanZoom'
import {
  nodeBounds as resolveBounds,
  type FlowEdgeData,
  type FlowNodeData,
  type NodeBounds,
} from './types'
import './FlowEdge.css'
import './FlowNode.css'
import './FlowCanvas.css'

export interface FlowCanvasProps {
  nodes: FlowNodeData[]
  edges: FlowEdgeData[]
  /** Fires with the full updated node list when a node is dragged. */
  onNodesChange?: (nodes: FlowNodeData[]) => void
  /** Fires when a node is clicked (selected). */
  onNodeClick?: (node: FlowNodeData) => void
  /** Fires with the selected node ids. */
  onSelectionChange?: (ids: string[]) => void
  /** Provide context-menu items for a node (enables right-click menu). */
  nodeContextMenu?: (node: FlowNodeData) => MenuItem[] | undefined
  /** Allow dragging nodes to reposition them. @default true */
  draggableNodes?: boolean
  /** @default 1 */
  defaultZoom?: number
  /** @default 0.3 */
  minZoom?: number
  /** @default 2.5 */
  maxZoom?: number
  /** Canvas backdrop. @default 'dots' */
  background?: 'dots' | 'grid' | 'none'
  /** Fit all nodes into view on first render. @default true */
  fitViewOnMount?: boolean
  /** Overlay slot (rendered above the canvas, e.g. FlowControls / FlowMinimap). */
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/** Bounding box that encloses every node, or null when there are none. */
function graphBounds(bounds: Record<string, NodeBounds>): NodeBounds | null {
  const list = Object.values(bounds)
  if (list.length === 0) return null
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const b of list) {
    minX = Math.min(minX, b.x)
    minY = Math.min(minY, b.y)
    maxX = Math.max(maxX, b.x + b.width)
    maxY = Math.max(maxY, b.y + b.height)
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

/**
 * A pannable / zoomable node canvas — the n8n-style workflow surface. Controlled:
 * you pass `nodes` and `edges` as data. Pan (drag empty canvas), wheel-zoom about
 * the cursor, click-to-select and drag-to-reposition are built in; connections are
 * rendered from the edge data. Drop FlowControls / FlowMinimap into `children`.
 */
export const FlowCanvas = forwardRef<HTMLDivElement, FlowCanvasProps>(function FlowCanvas(
  {
    nodes,
    edges,
    onNodesChange,
    onNodeClick,
    onSelectionChange,
    nodeContextMenu,
    draggableNodes = true,
    defaultZoom = 1,
    minZoom = 0.3,
    maxZoom = 2.5,
    background = 'dots',
    fitViewOnMount = true,
    children,
    className,
    style,
  },
  ref,
) {
  const [size, sizeRef] = useSize<HTMLDivElement>()
  const viewport = useMemo(() => size ?? { width: 0, height: 0 }, [size])
  const { transform, setTransform, zoomBy, panning, handlers } = usePanZoom({
    minZoom,
    maxZoom,
    defaultTransform: { x: 0, y: 0, zoom: defaultZoom },
  })

  // Internal position overrides let dragging work out-of-the-box even when the
  // consumer does not persist positions; controlled consumers get onNodesChange.
  const [posOverride, setPosOverride] = useState<Record<string, { x: number; y: number }>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [menu, setMenu] = useState<{ node: FlowNodeData; rect: DOMRect; items: MenuItem[] } | null>(
    null,
  )

  const effectiveNodes = useMemo(
    () => nodes.map((n) => (posOverride[n.id] ? { ...n, ...posOverride[n.id] } : n)),
    [nodes, posOverride],
  )

  const boundsMap = useMemo(() => {
    const map: Record<string, NodeBounds> = {}
    for (const n of effectiveNodes) map[n.id] = resolveBounds(n)
    return map
  }, [effectiveNodes])

  const fitView = useCallback(() => {
    if (viewport.width === 0) return
    setTransform(
      computeFitTransform(graphBounds(boundsMap), viewport, { minZoom, maxZoom, padding: 56 }),
    )
  }, [boundsMap, viewport, minZoom, maxZoom, setTransform])

  // Fit to view once, after the viewport has been measured.
  const didFit = useRef(false)
  useEffect(() => {
    if (fitViewOnMount && !didFit.current && viewport.width > 0 && effectiveNodes.length > 0) {
      didFit.current = true
      fitView()
    }
  }, [fitViewOnMount, viewport.width, effectiveNodes.length, fitView])

  const handlePositionChange = (id: string, x: number, y: number) => {
    setPosOverride((p) => ({ ...p, [id]: { x, y } }))
    if (onNodesChange) {
      onNodesChange(effectiveNodes.map((n) => (n.id === id ? { ...n, x, y } : n)))
    }
  }
  const handleSelect = (id: string) => {
    setSelectedId(id)
    const node = effectiveNodes.find((n) => n.id === id)
    if (node) onNodeClick?.(node)
    onSelectionChange?.([id])
  }
  const handleContextMenu = (node: FlowNodeData, e: ReactPointerEvent | MouseEvent) => {
    const items = nodeContextMenu?.(node)
    if (!items || items.length === 0) return
    // A zero-size rect at the pointer — DOMRect-like so it works without the
    // DOMRect constructor (e.g. in jsdom).
    const { clientX: x, clientY: y } = e
    const rect = {
      x,
      y,
      left: x,
      top: y,
      right: x,
      bottom: y,
      width: 0,
      height: 0,
      toJSON() {},
    } as DOMRect
    setMenu({ node, rect, items })
  }

  const ctx: FlowContextValue = {
    transform,
    nodeBounds: boundsMap,
    viewport,
    zoomBy: (factor) => zoomBy(factor, viewport),
    fitView,
    centerOn: (worldX, worldY) =>
      setTransform((t) => ({
        ...t,
        x: viewport.width / 2 - worldX * t.zoom,
        y: viewport.height / 2 - worldY * t.zoom,
      })),
  }

  const layerStyle: CSSProperties = {
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
    transformOrigin: '0 0',
  }

  return (
    <FlowContext.Provider value={ctx}>
      <div
        ref={mergeRefs(ref, sizeRef)}
        className={cx('lk-flow', `lk-flow--bg-${background}`, panning && 'is-panning', className)}
        style={style}
        {...handlers}
      >
        <div className="lk-flow__layer" style={layerStyle}>
          <svg className="lk-flow__edges" overflow="visible" aria-hidden="true">
            {edges.map((edge) => {
              const s = boundsMap[edge.source]
              const t = boundsMap[edge.target]
              if (!s || !t) return null
              return (
                <FlowEdge
                  key={edge.id}
                  edge={edge}
                  source={nodePortPoint(s, edge.sourceSide ?? 'right')}
                  target={nodePortPoint(t, edge.targetSide ?? 'left')}
                />
              )
            })}
          </svg>

          {effectiveNodes.map((node) => (
            <FlowNode
              key={node.id}
              node={node}
              zoom={transform.zoom}
              selected={selectedId === node.id}
              draggable={draggableNodes}
              onSelect={handleSelect}
              onPositionChange={handlePositionChange}
              onContextMenu={nodeContextMenu ? handleContextMenu : undefined}
            />
          ))}
        </div>

        {children != null && <div className="lk-flow__overlay">{children}</div>}

        {menu && (
          <Menu
            items={menu.items}
            open
            anchorRect={menu.rect}
            onOpenChange={(o) => {
              if (!o) setMenu(null)
            }}
          />
        )}
      </div>
    </FlowContext.Provider>
  )
})
