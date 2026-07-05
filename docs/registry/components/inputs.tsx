import { useState } from 'react'
import {
  Input,
  CommandBar,
  SearchField,
  Stepper,
  Button,
  IconButton,
  SearchIcon,
  MicIcon,
  PlusIcon,
  SendIcon,
  ImageIcon,
  SparkleIcon,
} from '@hamidrezazargham/liquidkit'
import type { ComponentDoc } from '../types'

/* ----------------------------------------------------------------- Input */

export const inputDoc: ComponentDoc = {
  slug: 'input',
  name: 'Input',
  category: 'Inputs',
  summary: 'A text field on a glass surface, with optional leading / trailing icons.',
  importLine: "import { Input } from '@hamidrezazargham/liquidkit'",
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
    {
      name: 'inputSize',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Control size.',
    },
    { name: 'pill', type: 'boolean', default: 'false', description: 'Fully rounded.' },
    {
      name: '...input',
      type: 'InputHTMLAttributes',
      description: 'All native <input> attributes except size.',
    },
  ],
}

/* ----------------------------------------------------------- SearchField */

function SearchFieldDemo() {
  const [q, setQ] = useState('')
  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
      <SearchField value={q} onChange={setQ} cancelable placeholder="Search" />
    </div>
  )
}

export const searchFieldDoc: ComponentDoc = {
  slug: 'search-field',
  name: 'SearchField',
  category: 'Inputs',
  summary:
    'The iOS search bar — a rounded fill with a leading magnifier and an in-field clear (×) button that can double as a cancel action.',
  importLine: "import { SearchField } from '@hamidrezazargham/liquidkit'",
  examples: [
    {
      title: 'Search bar',
      wide: true,
      demo: <SearchFieldDemo />,
      code: `function Bar() {
  const [q, setQ] = useState('')
  return <SearchField value={q} onChange={setQ} cancelable />
}`,
    },
    {
      title: 'Sizes',
      wide: true,
      demo: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: 320,
            margin: '0 auto',
          }}
        >
          <SearchField size="sm" placeholder="Small" />
          <SearchField size="md" placeholder="Medium" />
          <SearchField size="lg" placeholder="Large" />
        </div>
      ),
      code: `<SearchField size="sm" />
<SearchField size="md" />
<SearchField size="lg" />`,
    },
  ],
  props: [
    {
      name: 'value / defaultValue',
      type: 'string',
      description: 'Controlled / uncontrolled text.',
    },
    { name: 'onChange', type: '(value: string) => void', description: 'Fires on every keystroke.' },
    { name: 'onClear', type: '() => void', description: 'Fires when the clear button is pressed.' },
    {
      name: 'cancelable',
      type: 'boolean',
      default: 'false',
      description: 'Make the in-field × also dismiss the keyboard (blur) as a cancel.',
    },
    {
      name: 'onCancel',
      type: '() => void',
      description: 'Fires when the × is pressed (cancelable).',
    },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control size.' },
    {
      name: '...input',
      type: 'InputHTMLAttributes',
      description: 'All native <input> attributes except size/value.',
    },
  ],
}

/* --------------------------------------------------------------- Stepper */

function StepperDemo() {
  const [qty, setQty] = useState(2)
  return <Stepper value={qty} onChange={setQty} min={1} max={9} showValue aria-label="Quantity" />
}

export const stepperDoc: ComponentDoc = {
  slug: 'stepper',
  name: 'Stepper',
  category: 'Inputs',
  summary:
    'The iOS −/+ stepper, optionally showing the current value. Clamps to min / max and steps by step.',
  importLine: "import { Stepper } from '@hamidrezazargham/liquidkit'",
  examples: [
    {
      title: 'With value',
      demo: <StepperDemo />,
      code: `function Qty() {
  const [qty, setQty] = useState(2)
  return <Stepper value={qty} onChange={setQty} min={1} max={9} showValue />
}`,
    },
    {
      title: 'Compact',
      description: 'Without showValue it is the classic UIStepper — just the two buttons.',
      demo: <Stepper defaultValue={3} min={0} max={10} aria-label="Count" />,
      code: `<Stepper defaultValue={3} min={0} max={10} />`,
    },
  ],
  props: [
    {
      name: 'value / defaultValue',
      type: 'number',
      description: 'Controlled / uncontrolled value.',
    },
    {
      name: 'onChange',
      type: '(value: number) => void',
      description: 'Fires when the value changes.',
    },
    { name: 'min', type: 'number', default: '0', description: 'Lower bound.' },
    { name: 'max', type: 'number', default: 'Infinity', description: 'Upper bound.' },
    { name: 'step', type: 'number', default: '1', description: 'Increment.' },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Show the current value between the buttons.',
    },
    {
      name: 'formatValue',
      type: '(v: number) => ReactNode',
      description: 'Format the displayed value.',
    },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control size.' },
  ],
}

/* ------------------------------------------------------------- CommandBar */

function CommandBarDemo() {
  const [sent, setSent] = useState<string | null>(null)
  return (
    <div
      style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <CommandBar
        placeholder="Ask me anything…"
        onSubmit={(v) => v && setSent(v)}
        leading={
          <IconButton aria-label="Add" size="sm">
            <PlusIcon size={18} />
          </IconButton>
        }
        trailing={
          <IconButton aria-label="Send" size="sm" variant="accent">
            <SendIcon size={18} />
          </IconButton>
        }
        footer={
          <>
            <Button size="sm" variant="ghost" leftIcon={<ImageIcon size={16} />}>
              Image
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<SparkleIcon size={16} />}>
              Enhance
            </Button>
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
  importLine: "import { CommandBar } from '@hamidrezazargham/liquidkit'",
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
    {
      name: 'placeholder',
      type: 'string',
      default: "'Ask me anything…'",
      description: 'Field placeholder.',
    },
    { name: 'value', type: 'string', description: 'Controlled value.' },
    { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Fires on every keystroke.',
    },
    {
      name: 'onSubmit',
      type: '(value: string) => void',
      description: 'Fires on Enter (without Shift).',
    },
    { name: 'leading', type: 'ReactNode', description: 'Controls on the left of the field.' },
    { name: 'trailing', type: 'ReactNode', description: 'Controls on the right of the field.' },
    { name: 'footer', type: 'ReactNode', description: 'A row of controls beneath the field.' },
    { name: 'rows', type: 'number', default: '1', description: 'Initial row count.' },
    { name: 'radius', type: 'number', default: '24', description: 'Corner radius in px.' },
    { name: 'elevation', type: '0 | 1 | 2 | 3', default: '2', description: 'Drop-shadow depth.' },
  ],
}
