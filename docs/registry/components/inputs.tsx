import { useState } from 'react'
import {
  Input,
  CommandBar,
  Button,
  IconButton,
  SearchIcon,
  MicIcon,
  PlusIcon,
  SendIcon,
  ImageIcon,
  SparkleIcon,
} from 'liquidkit'
import type { ComponentDoc } from '../types'

/* ----------------------------------------------------------------- Input */

export const inputDoc: ComponentDoc = {
  slug: 'input',
  name: 'Input',
  category: 'Inputs',
  summary: 'A text field on a glass surface, with optional leading / trailing icons.',
  importLine: "import { Input } from 'liquidkit'",
  examples: [
    {
      title: 'With icons',
      wide: true,
      demo: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 320 }}>
          <Input placeholder="Search…" leftIcon={<SearchIcon size={18} />} />
          <Input placeholder="Say something" rightIcon={<MicIcon size={18} />} />
          <Input placeholder="Rounded" pill leftIcon={<SearchIcon size={18} />} />
        </div>
      ),
      code: `<Input placeholder="Search…" leftIcon={<SearchIcon />} />
<Input placeholder="Say something" rightIcon={<MicIcon />} />
<Input placeholder="Rounded" pill leftIcon={<SearchIcon />} />`,
    },
    {
      title: 'Sizes',
      wide: true,
      demo: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
          <Input inputSize="sm" placeholder="Small" />
          <Input inputSize="md" placeholder="Medium" />
          <Input inputSize="lg" placeholder="Large" />
        </div>
      ),
      code: `<Input inputSize="sm" placeholder="Small" />
<Input inputSize="md" placeholder="Medium" />
<Input inputSize="lg" placeholder="Large" />`,
    },
  ],
  props: [
    { name: 'leftIcon', type: 'ReactNode', description: 'Icon before the field.' },
    { name: 'rightIcon', type: 'ReactNode', description: 'Icon after the field.' },
    { name: 'inputSize', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control size.' },
    { name: 'pill', type: 'boolean', default: 'false', description: 'Fully rounded.' },
    { name: '...input', type: 'InputHTMLAttributes', description: 'All native <input> attributes except size.' },
  ],
}

/* ------------------------------------------------------------- CommandBar */

function CommandBarDemo() {
  const [sent, setSent] = useState<string | null>(null)
  return (
    <div style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CommandBar
        placeholder="Ask me anything…"
        onSubmit={(v) => v && setSent(v)}
        leading={<IconButton aria-label="Add" size="sm"><PlusIcon size={18} /></IconButton>}
        trailing={<IconButton aria-label="Send" size="sm" variant="accent"><SendIcon size={18} /></IconButton>}
        footer={
          <>
            <Button size="sm" variant="ghost" leftIcon={<ImageIcon size={16} />}>Image</Button>
            <Button size="sm" variant="ghost" leftIcon={<SparkleIcon size={16} />}>Enhance</Button>
          </>
        }
      />
      {sent && <span style={{ opacity: 0.7, fontSize: 14 }}>Submitted: “{sent}”</span>}
    </div>
  )
}

export const commandBarDoc: ComponentDoc = {
  slug: 'command-bar',
  name: 'CommandBar',
  category: 'Inputs',
  summary:
    'An auto-growing prompt field with leading, trailing and footer slots — the AI-composer surface. Enter submits, Shift+Enter adds a line.',
  importLine: "import { CommandBar } from 'liquidkit'",
  examples: [
    {
      title: 'AI composer',
      wide: true,
      demo: <CommandBarDemo />,
      code: `<CommandBar
  placeholder="Ask me anything…"
  onSubmit={(v) => send(v)}
  leading={<IconButton aria-label="Add"><PlusIcon /></IconButton>}
  trailing={<IconButton aria-label="Send" variant="accent"><SendIcon /></IconButton>}
  footer={
    <>
      <Button size="sm" variant="ghost" leftIcon={<ImageIcon />}>Image</Button>
      <Button size="sm" variant="ghost" leftIcon={<SparkleIcon />}>Enhance</Button>
    </>
  }
/>`,
    },
  ],
  props: [
    { name: 'placeholder', type: 'string', default: "'Ask me anything…'", description: 'Field placeholder.' },
    { name: 'value', type: 'string', description: 'Controlled value.' },
    { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
    { name: 'onValueChange', type: '(value: string) => void', description: 'Fires on every keystroke.' },
    { name: 'onSubmit', type: '(value: string) => void', description: 'Fires on Enter (without Shift).' },
    { name: 'leading', type: 'ReactNode', description: 'Controls on the left of the field.' },
    { name: 'trailing', type: 'ReactNode', description: 'Controls on the right of the field.' },
    { name: 'footer', type: 'ReactNode', description: 'A row of controls beneath the field.' },
    { name: 'rows', type: 'number', default: '1', description: 'Initial row count.' },
    { name: 'radius', type: 'number', default: '24', description: 'Corner radius in px.' },
    { name: 'elevation', type: '0 | 1 | 2 | 3', default: '2', description: 'Drop-shadow depth.' },
  ],
}
