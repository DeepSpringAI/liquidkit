import { useState } from 'react'
import {
  Modal,
  Sheet,
  Menu,
  Popover,
  ToastProvider,
  useToast,
  Button,
  IconButton,
  EditIcon,
  UploadIcon,
  CubeIcon,
  EllipsisIcon,
  CheckIcon,
  CloseIcon,
} from 'liquidkit'
import type { ComponentDoc } from '../types'

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Liquid Glass dialog"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="accent" onClick={() => setOpen(false)}>Confirm</Button>
          </>
        }
      >
        A portal-rendered glass modal with a blurred scrim, Escape-to-close and scroll lock.
      </Modal>
    </>
  )
}

export const modalDoc: ComponentDoc = {
  slug: 'modal',
  name: 'Modal',
  category: 'Overlays',
  summary:
    'A portal-rendered dialog on a glass surface, with a blurred scrim, Escape-to-close, scroll lock and a footer slot.',
  importLine: "import { Modal } from 'liquidkit'",
  examples: [
    {
      title: 'Dialog',
      demo: <ModalDemo />,
      code: `function Confirm() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Liquid Glass dialog"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="accent" onClick={() => setOpen(false)}>Confirm</Button>
          </>
        }
      >
        A portal-rendered glass modal with a blurred scrim.
      </Modal>
    </>
  )
}`,
    },
  ],
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Whether the modal is shown.' },
    { name: 'onClose', type: '() => void', description: 'Fires on Escape, backdrop click or close button.' },
    { name: 'title', type: 'ReactNode', description: 'Header title.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Body content.' },
    { name: 'footer', type: 'ReactNode', description: 'Footer actions slot.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", description: 'Max width preset or px.' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when the scrim is clicked.' },
  ],
}

/* ----------------------------------------------------------------- Sheet */

function SheetDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Liquid Glass sheet"
        detents={['medium', 'large']}
        footer={<Button block variant="accent" onClick={() => setOpen(false)}>Done</Button>}
      >
        <p style={{ marginTop: 0 }}>
          Drag the grabber to snap between the medium and large detents, or pull down past the
          smallest detent to dismiss.
        </p>
        <p style={{ opacity: 0.7 }}>
          The sheet springs up on a glass surface with a blurred scrim, Escape-to-close and scroll
          lock.
        </p>
      </Sheet>
    </>
  )
}

export const sheetDoc: ComponentDoc = {
  slug: 'sheet',
  name: 'Sheet',
  category: 'Overlays',
  summary:
    'The iOS bottom sheet — a glass panel that springs up and snaps between detents. Drag the grabber to resize, pull down to dismiss.',
  importLine: "import { Sheet } from 'liquidkit'",
  examples: [
    {
      title: 'Detented sheet',
      demo: <SheetDemo />,
      code: `function Example() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Liquid Glass sheet"
        detents={['medium', 'large']}
        footer={<Button block variant="accent" onClick={() => setOpen(false)}>Done</Button>}
      >
        Drag the grabber to snap between detents, or pull down to dismiss.
      </Sheet>
    </>
  )
}`,
    },
  ],
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Whether the sheet is shown.' },
    { name: 'onClose', type: '() => void', description: 'Fires on Escape, scrim tap or pull-to-dismiss.' },
    { name: 'title', type: 'ReactNode', description: 'Header title beside the grabber.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Body content (scrolls).' },
    { name: 'footer', type: 'ReactNode', description: 'Pinned footer slot.' },
    { name: 'detents', type: "Array<number | 'medium' | 'large'>", default: "['medium','large']", description: 'Snap heights; ≤1 = viewport fraction, >1 = px.' },
    { name: 'defaultDetent', type: 'number', default: '0', description: 'Initial detent index.' },
    { name: 'grabber', type: 'boolean', default: 'true', description: 'Show the drag handle.' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when the scrim is tapped.' },
  ],
}

/* ------------------------------------------------------------------ Menu */

export const menuDoc: ComponentDoc = {
  slug: 'menu',
  name: 'Menu',
  category: 'Overlays',
  summary:
    'A dropdown action menu anchored to its trigger — icons, checkmarks, dividers and destructive items, with click-outside and Escape to close.',
  importLine: "import { Menu } from 'liquidkit'",
  examples: [
    {
      title: 'Action menu',
      overflow: true,
      demo: (
        <Menu
          trigger={<IconButton aria-label="More actions"><EllipsisIcon /></IconButton>}
          items={[
            { id: 'edit', label: 'Edit', icon: <EditIcon /> },
            { id: 'dupe', label: 'Duplicate', icon: <CubeIcon /> },
            { id: 'share', label: 'Share…', icon: <UploadIcon /> },
            { divider: true },
            { id: 'pin', label: 'Show in sidebar', checked: true },
            { divider: true },
            { id: 'delete', label: 'Delete', destructive: true },
          ]}
        />
      ),
      code: `<Menu
  trigger={<IconButton aria-label="More"><EllipsisIcon /></IconButton>}
  items={[
    { id: 'edit', label: 'Edit', icon: <EditIcon /> },
    { id: 'share', label: 'Share…', icon: <UploadIcon /> },
    { divider: true },
    { id: 'pin', label: 'Show in sidebar', checked: true },
    { divider: true },
    { id: 'delete', label: 'Delete', destructive: true },
  ]}
/>`,
    },
  ],
  props: [
    { name: 'trigger', type: 'ReactNode', required: true, description: 'Element that opens the menu; its onClick is wrapped.' },
    { name: 'items', type: 'MenuItem[]', required: true, description: '{ id, label, icon?, checked?, destructive?, disabled?, onSelect? } or { divider: true }.' },
    { name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", description: 'Where the menu opens.' },
  ],
}

/* --------------------------------------------------------------- Popover */

export const popoverDoc: ComponentDoc = {
  slug: 'popover',
  name: 'Popover',
  category: 'Overlays',
  summary:
    'A floating glass panel with an arrow, anchored to its trigger. Place it on any side, open on click or hover.',
  importLine: "import { Popover } from 'liquidkit'",
  examples: [
    {
      title: 'Anchored panel',
      overflow: true,
      demo: (
        <Popover
          trigger={<Button variant="glass">Quick look</Button>}
          placement="bottom"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
            <strong>LiquidKit</strong>
            <span style={{ opacity: 0.7, fontSize: 13 }}>
              A glass popover with an arrow. Click outside or press Escape to close.
            </span>
          </div>
        </Popover>
      ),
      code: `<Popover trigger={<Button>Quick look</Button>} placement="bottom">
  <strong>LiquidKit</strong>
  <p>A glass popover with an arrow.</p>
</Popover>`,
    },
  ],
  props: [
    { name: 'trigger', type: 'ReactNode', required: true, description: 'Element that opens the popover.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Panel content.' },
    { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Side the panel opens on.' },
    { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Cross-axis alignment (top/bottom).' },
    { name: 'arrow', type: 'boolean', default: 'true', description: 'Show the arrow pointer.' },
    { name: 'openOnHover', type: 'boolean', default: 'false', description: 'Open on hover instead of click.' },
    { name: 'width', type: 'number', description: 'Fixed panel width in px.' },
  ],
}

/* ----------------------------------------------------------------- Toast */

function ToastButtons() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <Button
        variant="accent"
        onClick={() =>
          toast({ title: 'Saved', description: 'Your changes are live.', variant: 'success', icon: <CheckIcon /> })
        }
      >
        Success toast
      </Button>
      <Button
        variant="glass"
        onClick={() =>
          toast({
            title: 'Upload failed',
            description: 'Check your connection.',
            variant: 'error',
            icon: <CloseIcon />,
            action: { label: 'Retry', onClick: () => {} },
          })
        }
      >
        Error + action
      </Button>
    </div>
  )
}

function ToastDemo() {
  return (
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  )
}

export const toastDoc: ComponentDoc = {
  slug: 'toast',
  name: 'Toast',
  category: 'Overlays',
  summary:
    'Transient glass notifications. Wrap your app in ToastProvider, then call useToast().toast() — they spring in and auto-dismiss.',
  importLine: "import { ToastProvider, useToast } from 'liquidkit'",
  examples: [
    {
      title: 'Fire a toast',
      demo: <ToastDemo />,
      code: `function App() {
  return (
    <ToastProvider placement="bottom">
      <Page />
    </ToastProvider>
  )
}

function Page() {
  const { toast } = useToast()
  return (
    <Button
      onClick={() =>
        toast({ title: 'Saved', description: 'Your changes are live.', variant: 'success', icon: <CheckIcon /> })
      }
    >
      Save
    </Button>
  )
}`,
    },
  ],
  props: [
    { name: 'ToastProvider · placement', type: "'top' | 'bottom'", default: "'bottom'", description: 'Where toasts stack.' },
    { name: 'ToastProvider · max', type: 'number', default: '4', description: 'Max simultaneously visible.' },
    { name: 'toast(options)', type: '(ToastOptions) => string', description: 'Show a toast; returns its id.' },
    { name: 'options.title / description', type: 'ReactNode', description: 'Primary and secondary text.' },
    { name: 'options.icon', type: 'ReactNode', description: 'Leading icon.' },
    { name: 'options.variant', type: "'glass' | 'success' | 'error' | 'accent'", default: "'glass'", description: 'Accent color of the icon.' },
    { name: 'options.duration', type: 'number', default: '4000', description: 'ms before auto-dismiss; 0 keeps it.' },
    { name: 'options.action', type: '{ label, onClick }', description: 'Inline action button.' },
    { name: 'dismiss(id)', type: '(id: string) => void', description: 'Dismiss a toast manually.' },
  ],
}
