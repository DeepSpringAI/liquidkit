import {
  FlowCanvas,
  FlowNode,
  FlowEdge,
  FlowControls,
  FlowMinimap,
  Badge,
  SparkleIcon,
  GitBranchIcon,
  DatabaseIcon,
  SendIcon,
  CodeIcon,
  type FlowNodeData,
  type FlowEdgeData,
  type MenuItem,
} from 'liquidkit'
import type { ReactNode } from 'react'
import type { ComponentDoc } from '../types'

/* ---------------------------------------------------------------- shared demo data */

const flowNodes: FlowNodeData[] = [
  {
    id: 'trigger',
    x: 0,
    y: 130,
    variant: 'hub',
    title: 'Trigger',
    icon: <SparkleIcon />,
    accent: '#5b8cff',
    status: 'done',
  },
  {
    id: 'condition',
    x: 280,
    y: 20,
    title: 'Condition',
    subtitle: 'If new message',
    icon: <GitBranchIcon />,
    badge: (
      <Badge size="sm" variant="accent">
        Logic
      </Badge>
    ),
    status: 'done',
  },
  {
    id: 'enrich',
    x: 280,
    y: 220,
    title: 'Enrich data',
    subtitle: 'Lookup contact',
    icon: <DatabaseIcon />,
  },
  {
    id: 'send',
    x: 600,
    y: 130,
    title: 'Send message',
    subtitle: 'WhatsApp',
    icon: <SendIcon />,
    accent: '#37d0d6',
    status: 'running',
  },
]

const flowEdges: FlowEdgeData[] = [
  { id: 'e1', source: 'trigger', target: 'condition', label: 'Condition', animated: true },
  { id: 'e2', source: 'trigger', target: 'enrich' },
  { id: 'e3', source: 'condition', target: 'send' },
  { id: 'e4', source: 'enrich', target: 'send' },
]

const nodeMenu = (): MenuItem[] => [
  { id: 'data', label: 'Example data', shortcut: '⌘D' },
  { id: 'copy', label: 'Copy link', icon: <CodeIcon />, shortcut: '⌘C' },
  { id: 'branch', label: 'Create new branch', shortcut: '⌘B' },
  { divider: true },
  { id: 'remove', label: 'Remove', destructive: true, shortcut: '⌫' },
]

const CanvasFrame = ({ children }: { children?: ReactNode }) => (
  <div style={{ width: '100%', height: 380, borderRadius: 18, overflow: 'hidden' }}>{children}</div>
)

/* ------------------------------------------------------------------------- FlowCanvas */

export const flowCanvasDoc: ComponentDoc = {
  slug: 'flow-canvas',
  name: 'FlowCanvas',
  category: 'Flow',
  summary:
    'A pannable, zoomable node canvas for building n8n-style workflow diagrams — glass nodes joined by glowing connectors, with drag-to-reposition, selection and right-click menus.',
  importLine: "import { FlowCanvas, FlowControls, FlowMinimap } from 'liquidkit'",
  examples: [
    {
      title: 'Workflow diagram',
      description:
        'Pass nodes and edges as data. Drag the canvas to pan, scroll to zoom, drag a node to move it, and right-click a node for its menu.',
      demo: (
        <CanvasFrame>
          <FlowCanvas nodes={flowNodes} edges={flowEdges} nodeContextMenu={nodeMenu}>
            <FlowControls />
            <FlowMinimap />
          </FlowCanvas>
        </CanvasFrame>
      ),
      code: `const nodes = [
  { id: 'trigger', x: 0, y: 130, variant: 'hub', title: 'Trigger', icon: <SparkleIcon />, status: 'done' },
  { id: 'condition', x: 280, y: 20, title: 'Condition', subtitle: 'If new message', icon: <GitBranchIcon /> },
  { id: 'enrich', x: 280, y: 220, title: 'Enrich data', subtitle: 'Lookup contact', icon: <DatabaseIcon /> },
  { id: 'send', x: 600, y: 130, title: 'Send message', subtitle: 'WhatsApp', icon: <SendIcon />, status: 'running' },
]
const edges = [
  { id: 'e1', source: 'trigger', target: 'condition', label: 'Condition', animated: true },
  { id: 'e2', source: 'trigger', target: 'enrich' },
  { id: 'e3', source: 'condition', target: 'send' },
  { id: 'e4', source: 'enrich', target: 'send' },
]

<div style={{ height: 380 }}>
  <FlowCanvas nodes={nodes} edges={edges} nodeContextMenu={() => menuItems}>
    <FlowControls />
    <FlowMinimap />
  </FlowCanvas>
</div>`,
      stage: false,
      wide: true,
    },
  ],
  props: [
    {
      name: 'nodes',
      type: 'FlowNodeData[]',
      required: true,
      description: 'Nodes to render (world x/y positions).',
    },
    {
      name: 'edges',
      type: 'FlowEdgeData[]',
      required: true,
      description: 'Connectors between nodes.',
    },
    {
      name: 'onNodesChange',
      type: '(nodes: FlowNodeData[]) => void',
      description: 'Fires with the updated list when a node is dragged.',
    },
    {
      name: 'onNodeClick',
      type: '(node: FlowNodeData) => void',
      description: 'Fires when a node is selected.',
    },
    {
      name: 'onSelectionChange',
      type: '(ids: string[]) => void',
      description: 'Fires with the selected node ids.',
    },
    {
      name: 'nodeContextMenu',
      type: '(node) => MenuItem[] | undefined',
      description: 'Return items to enable a right-click menu.',
    },
    {
      name: 'draggableNodes',
      type: 'boolean',
      default: 'true',
      description: 'Allow dragging nodes to reposition.',
    },
    {
      name: 'background',
      type: "'dots' | 'grid' | 'none'",
      default: "'dots'",
      description: 'Canvas backdrop.',
    },
    {
      name: 'fitViewOnMount',
      type: 'boolean',
      default: 'true',
      description: 'Fit all nodes into view initially.',
    },
    { name: 'minZoom / maxZoom', type: 'number', default: '0.3 / 2.5', description: 'Zoom clamp.' },
  ],
}

/* --------------------------------------------------------------------------- FlowNode */

export const flowNodeDoc: ComponentDoc = {
  slug: 'flow-node',
  name: 'FlowNode',
  category: 'Flow',
  summary:
    'A glass workflow node — a rounded card with icon, title, subtitle and status, or a circular glowing hub for a core/trigger node.',
  importLine: "import { FlowNode } from 'liquidkit'",
  examples: [
    {
      title: 'Card & hub variants',
      demo: (
        <div style={{ position: 'relative', width: '100%', height: 150 }}>
          <FlowNode
            node={{
              id: 'a',
              x: 0,
              y: 40,
              variant: 'hub',
              title: 'AI',
              icon: <SparkleIcon />,
              accent: '#5b8cff',
              status: 'done',
            }}
          />
          <FlowNode
            node={{
              id: 'b',
              x: 150,
              y: 36,
              title: 'Send message',
              subtitle: 'WhatsApp',
              icon: <SendIcon />,
              badge: (
                <Badge size="sm" variant="success">
                  Action
                </Badge>
              ),
              status: 'running',
            }}
          />
        </div>
      ),
      code: `<FlowNode node={{ id: 'a', x: 0, y: 40, variant: 'hub', title: 'AI', icon: <SparkleIcon />, status: 'done' }} />
<FlowNode
  node={{ id: 'b', x: 150, y: 36, title: 'Send message', subtitle: 'WhatsApp', icon: <SendIcon />, status: 'running' }}
/>`,
      stage: true,
      overflow: true,
    },
  ],
  props: [
    {
      name: 'node',
      type: 'FlowNodeData',
      required: true,
      description: 'Node data (position, title, icon, variant, status…).',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'Show the accent selection ring.',
    },
    {
      name: 'draggable',
      type: 'boolean',
      default: 'false',
      description: 'Enable pointer dragging.',
    },
    {
      name: 'zoom',
      type: 'number',
      default: '1',
      description: 'Canvas zoom, so drag deltas map to world units.',
    },
    { name: 'onSelect', type: '(id: string) => void', description: 'Click callback.' },
    { name: 'onPositionChange', type: '(id, x, y) => void', description: 'Drag callback.' },
  ],
}

/* --------------------------------------------------------------------------- FlowEdge */

export const flowEdgeDoc: ComponentDoc = {
  slug: 'flow-edge',
  name: 'FlowEdge',
  category: 'Flow',
  summary:
    'A single glowing gradient bezier connector, drawn inside the canvas SVG layer, with an optional flowing dash and a centered label pill.',
  importLine: "import { FlowEdge } from 'liquidkit'",
  examples: [
    {
      title: 'Connectors',
      demo: (
        <svg width="100%" height={160} viewBox="0 0 360 160" style={{ overflow: 'visible' }}>
          <FlowEdge
            edge={{ id: 'a', source: 's', target: 't', label: 'Condition' }}
            source={{ x: 20, y: 40 }}
            target={{ x: 320, y: 40 }}
          />
          <FlowEdge
            edge={{ id: 'b', source: 's', target: 't', animated: true }}
            source={{ x: 20, y: 120 }}
            target={{ x: 320, y: 120 }}
          />
        </svg>
      ),
      code: `<svg viewBox="0 0 360 160">
  <FlowEdge edge={{ id: 'a', source: 's', target: 't', label: 'Condition' }} source={{ x: 20, y: 40 }} target={{ x: 320, y: 40 }} />
  <FlowEdge edge={{ id: 'b', source: 's', target: 't', animated: true }} source={{ x: 20, y: 120 }} target={{ x: 320, y: 120 }} />
</svg>`,
      stage: true,
    },
  ],
  props: [
    {
      name: 'edge',
      type: 'FlowEdgeData',
      required: true,
      description: 'Edge data (label, color, animated, selected).',
    },
    {
      name: 'source',
      type: '{ x, y }',
      required: true,
      description: 'Start point in world space.',
    },
    { name: 'target', type: '{ x, y }', required: true, description: 'End point in world space.' },
  ],
}

/* ----------------------------------------------------------------- Controls & Minimap */

export const flowControlsDoc: ComponentDoc = {
  slug: 'flow-controls',
  name: 'FlowControls',
  category: 'Flow',
  summary:
    'A glass pill with zoom-in, zoom-out and fit-to-view buttons for a FlowCanvas. Renders inside the canvas.',
  importLine: "import { FlowControls } from 'liquidkit'",
  examples: [
    {
      title: 'In a canvas',
      demo: (
        <CanvasFrame>
          <FlowCanvas nodes={flowNodes} edges={flowEdges}>
            <FlowControls position="bottom-left" />
          </FlowCanvas>
        </CanvasFrame>
      ),
      code: `<FlowCanvas nodes={nodes} edges={edges}>
  <FlowControls position="bottom-left" />
</FlowCanvas>`,
      stage: false,
      wide: true,
    },
  ],
  props: [
    {
      name: 'position',
      type: "'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'",
      default: "'bottom-left'",
      description: 'Corner to pin to.',
    },
    { name: 'step', type: 'number', default: '1.25', description: 'Zoom factor per click.' },
  ],
}

export const flowMinimapDoc: ComponentDoc = {
  slug: 'flow-minimap',
  name: 'FlowMinimap',
  category: 'Flow',
  summary:
    'A scaled overview of the canvas with a viewport indicator; click to recenter. Renders inside the canvas.',
  importLine: "import { FlowMinimap } from 'liquidkit'",
  examples: [
    {
      title: 'In a canvas',
      demo: (
        <CanvasFrame>
          <FlowCanvas nodes={flowNodes} edges={flowEdges}>
            <FlowMinimap position="bottom-right" />
          </FlowCanvas>
        </CanvasFrame>
      ),
      code: `<FlowCanvas nodes={nodes} edges={edges}>
  <FlowMinimap position="bottom-right" />
</FlowCanvas>`,
      stage: false,
      wide: true,
    },
  ],
  props: [
    {
      name: 'position',
      type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
      default: "'bottom-right'",
      description: 'Corner to pin to.',
    },
    { name: 'width', type: 'number', default: '200', description: 'Minimap width, px.' },
    { name: 'height', type: 'number', default: '140', description: 'Minimap height, px.' },
  ],
}
