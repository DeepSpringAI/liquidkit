import { useState } from 'react'
import { Modal, Button } from 'liquidkit'
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
