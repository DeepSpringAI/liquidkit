import { useState } from 'react'
import {
  Button,
  IconButton,
  Switch,
  ThemeToggle,
  Slider,
  Tabs,
  Select,
  ArrowRightIcon,
  PlusIcon,
  SearchIcon,
  HeartIcon,
  SettingsIcon,
  BellIcon,
  CheckIcon,
  CloseIcon,
} from 'liquidkit'
import type { ComponentDoc } from '../types'

/* ---------------------------------------------------------------- Button */

export const buttonDoc: ComponentDoc = {
  slug: 'button',
  name: 'Button',
  category: 'Actions',
  summary: 'Glass, accent and ghost buttons with optional chromatic glow ring, icons and sizes.',
  importLine: "import { Button } from 'liquidkit'",
  examples: [
    {
      title: 'Variants',
      demo: (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="glass">Glass</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      ),
      code: `<Button variant="glass">Glass</Button>
<Button variant="accent">Accent</Button>
<Button variant="ghost">Ghost</Button>`,
    },
    {
      title: 'Sizes & pill',
      demo: (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button pill variant="accent">
            Pill
          </Button>
        </div>
      ),
      code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button pill variant="accent">Pill</Button>`,
    },
    {
      title: 'Icons & glow',
      description: 'glow paints a chromatic ring behind the button — the "Liquid Home" look.',
      demo: (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button leftIcon={<PlusIcon size={18} />}>New</Button>
          <Button rightIcon={<ArrowRightIcon size={18} />} variant="accent">
            Continue
          </Button>
          <Button glow variant="accent" leftIcon={<HeartIcon size={18} />}>
            Glow
          </Button>
        </div>
      ),
      code: `<Button leftIcon={<PlusIcon />}>New</Button>
<Button rightIcon={<ArrowRightIcon />} variant="accent">Continue</Button>
<Button glow variant="accent" leftIcon={<HeartIcon />}>Glow</Button>`,
    },
  ],
  props: [
    {
      name: 'as',
      type: 'ElementType',
      default: "'button'",
      description: "Element to render as, e.g. 'a' for a link button.",
    },
    {
      name: 'variant',
      type: "'glass' | 'accent' | 'ghost'",
      default: "'glass'",
      description: 'Visual style.',
    },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control size.' },
    { name: 'pill', type: 'boolean', default: 'false', description: 'Fully rounded pill.' },
    {
      name: 'iconOnly',
      type: 'boolean',
      default: 'false',
      description: 'Square / circular icon-only button.',
    },
    {
      name: 'glow',
      type: 'boolean',
      default: 'false',
      description: 'Chromatic glow ring behind the button.',
    },
    {
      name: 'block',
      type: 'boolean',
      default: 'false',
      description: 'Stretch to fill the container width.',
    },
    { name: 'leftIcon', type: 'ReactNode', description: 'Icon before the label.' },
    { name: 'rightIcon', type: 'ReactNode', description: 'Icon after the label.' },
    { name: 'refraction', type: 'number', description: 'Refraction strength override.' },
    { name: 'dispersion', type: 'number', description: 'Chromatic dispersion override.' },
    {
      name: '...button',
      type: 'ButtonHTMLAttributes',
      description: 'All native <button> attributes (onClick, disabled, …).',
    },
  ],
}

/* ------------------------------------------------------------ IconButton */

export const iconButtonDoc: ComponentDoc = {
  slug: 'icon-button',
  name: 'IconButton',
  category: 'Actions',
  summary: 'A circular, icon-only button. Requires an aria-label for accessibility.',
  importLine: "import { IconButton } from 'liquidkit'",
  examples: [
    {
      title: 'Icon buttons',
      demo: (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>
          <IconButton aria-label="Notifications">
            <BellIcon />
          </IconButton>
          <IconButton aria-label="Like" variant="accent" glow>
            <HeartIcon />
          </IconButton>
          <IconButton aria-label="Settings" size="lg">
            <SettingsIcon />
          </IconButton>
        </div>
      ),
      code: `<IconButton aria-label="Search"><SearchIcon /></IconButton>
<IconButton aria-label="Like" variant="accent" glow><HeartIcon /></IconButton>
<IconButton aria-label="Settings" size="lg"><SettingsIcon /></IconButton>`,
    },
  ],
  props: [
    {
      name: 'aria-label',
      type: 'string',
      required: true,
      description: 'Names the action for screen readers.',
    },
    { name: 'children', type: 'ReactNode', required: true, description: 'The icon to render.' },
    { name: 'pill', type: 'boolean', default: 'true', description: 'Circular shape.' },
    {
      name: '...Button',
      type: '—',
      description: 'All Button props except iconOnly / leftIcon / rightIcon.',
    },
  ],
}

/* ---------------------------------------------------------------- Switch */

function SwitchDemo() {
  const [wifi, setWifi] = useState(true)
  const [bt, setBt] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch checked={wifi} onChange={setWifi} label="Wi-Fi" />
      <Switch checked={bt} onChange={setBt} label="Bluetooth" />
      <Switch
        defaultChecked
        glow
        iconOn={<CheckIcon size={12} />}
        iconOff={<CloseIcon size={12} />}
        label="With glow + icons"
      />
      <Switch disabled label="Disabled" />
    </div>
  )
}

export const switchDoc: ComponentDoc = {
  slug: 'switch',
  name: 'Switch',
  category: 'Actions',
  summary: 'A glass toggle with a sliding thumb, optional thumb icons and an accent glow.',
  importLine: "import { Switch } from 'liquidkit'",
  examples: [
    {
      title: 'Toggles',
      demo: <SwitchDemo />,
      code: `function Settings() {
  const [wifi, setWifi] = useState(true)
  return (
    <>
      <Switch checked={wifi} onChange={setWifi} label="Wi-Fi" />
      <Switch defaultChecked glow label="With glow" />
      <Switch disabled label="Disabled" />
    </>
  )
}`,
    },
    {
      title: 'Sizes',
      demo: (
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <Switch size="sm" defaultChecked />
          <Switch size="md" defaultChecked />
          <Switch size="lg" defaultChecked />
        </div>
      ),
      code: `<Switch size="sm" defaultChecked />
<Switch size="md" defaultChecked />
<Switch size="lg" defaultChecked />`,
    },
  ],
  props: [
    { name: 'checked', type: 'boolean', description: 'Controlled value.' },
    { name: 'defaultChecked', type: 'boolean', description: 'Uncontrolled initial value.' },
    { name: 'onChange', type: '(checked: boolean) => void', description: 'Fires on toggle.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control size.' },
    { name: 'label', type: 'ReactNode', description: 'Text rendered next to the control.' },
    { name: 'iconOn', type: 'ReactNode', description: 'Icon inside the thumb when on.' },
    { name: 'iconOff', type: 'ReactNode', description: 'Icon inside the thumb when off.' },
    {
      name: 'glow',
      type: 'boolean',
      default: 'false',
      description: 'Accent glow around the thumb when on.',
    },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
  ],
}

/* ----------------------------------------------------------- ThemeToggle */

export const themeToggleDoc: ComponentDoc = {
  slug: 'theme-toggle',
  name: 'ThemeToggle',
  category: 'Actions',
  summary: 'A pre-wired sun / moon switch that flips the theme. Must live inside a ThemeProvider.',
  importLine: "import { ThemeToggle } from 'liquidkit'",
  examples: [
    {
      title: 'Toggle the theme',
      description: 'This very toggle controls the whole docs site — try it.',
      demo: <ThemeToggle />,
      code: `import { ThemeProvider, ThemeToggle } from 'liquidkit'

<ThemeProvider defaultMode="system">
  <ThemeToggle />
</ThemeProvider>`,
    },
  ],
  props: [
    {
      name: 'glow',
      type: 'boolean',
      default: 'true',
      description: 'Accent glow around the thumb.',
    },
    {
      name: '...Switch',
      type: '—',
      description: 'All Switch props except checked / onChange / iconOn / iconOff.',
    },
  ],
}

/* ---------------------------------------------------------------- Slider */

function SliderDemo() {
  const [v, setV] = useState(60)
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Slider value={v} onChange={setV} aria-label="Volume" />
      <span style={{ opacity: 0.7, fontSize: 14 }}>Value: {v}</span>
    </div>
  )
}

export const sliderDoc: ComponentDoc = {
  slug: 'slider',
  name: 'Slider',
  category: 'Actions',
  summary: 'A range input with a gradient fill and a glass thumb.',
  importLine: "import { Slider } from 'liquidkit'",
  examples: [
    {
      title: 'Controlled slider',
      demo: <SliderDemo />,
      code: `function Volume() {
  const [v, setV] = useState(60)
  return <Slider value={v} onChange={setV} aria-label="Volume" />
}`,
    },
    {
      title: 'Min, max & step',
      demo: (
        <div style={{ width: 280 }}>
          <Slider defaultValue={4} min={0} max={10} step={2} aria-label="Steps" />
        </div>
      ),
      code: `<Slider defaultValue={4} min={0} max={10} step={2} />`,
    },
  ],
  props: [
    { name: 'value', type: 'number', description: 'Controlled value.' },
    { name: 'defaultValue', type: 'number', description: 'Uncontrolled initial value.' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'step', type: 'number', default: '1', description: 'Step increment.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Fires while dragging.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
  ],
}

/* ------------------------------------------------------------------ Tabs */

function TabsDemo() {
  const [tab, setTab] = useState('overview')
  return (
    <Tabs
      value={tab}
      onChange={setTab}
      items={[
        { id: 'overview', label: 'Overview' },
        { id: 'activity', label: 'Activity', icon: <BellIcon size={16} /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon size={16} /> },
      ]}
    />
  )
}

export const tabsDoc: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  category: 'Actions',
  summary: 'A segmented control with a sliding glass indicator.',
  importLine: "import { Tabs } from 'liquidkit'",
  examples: [
    {
      title: 'Segmented tabs',
      demo: <TabsDemo />,
      code: `function View() {
  const [tab, setTab] = useState('overview')
  return (
    <Tabs
      value={tab}
      onChange={setTab}
      items={[
        { id: 'overview', label: 'Overview' },
        { id: 'activity', label: 'Activity', icon: <BellIcon /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
      ]}
    />
  )
}`,
    },
  ],
  props: [
    {
      name: 'items',
      type: 'TabItem[]',
      required: true,
      description: 'Tabs: { id, label, icon? }.',
    },
    { name: 'value', type: 'string', description: 'Controlled active id.' },
    { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial id.' },
    { name: 'onChange', type: '(id: string) => void', description: 'Fires on tab change.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control size.' },
  ],
}

/* ---------------------------------------------------------------- Select */

function SelectDemo() {
  const [v, setV] = useState('apple')
  return (
    <Select
      value={v}
      onChange={setV}
      options={[
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'date', label: 'Date' },
      ]}
    />
  )
}

export const selectDoc: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  category: 'Actions',
  summary: 'A dropdown with a glass popover menu. Closes on outside-click or Escape.',
  importLine: "import { Select } from 'liquidkit'",
  examples: [
    {
      title: 'Select an option',
      demo: <SelectDemo />,
      code: `function Picker() {
  const [v, setV] = useState('apple')
  return (
    <Select
      value={v}
      onChange={setV}
      options={[
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
      ]}
    />
  )
}`,
    },
  ],
  props: [
    {
      name: 'options',
      type: 'SelectOption[]',
      required: true,
      description: 'Options: { value, label }.',
    },
    { name: 'value', type: 'string', description: 'Controlled value.' },
    { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Fires on selection.' },
    {
      name: 'placeholder',
      type: 'ReactNode',
      default: "'Select…'",
      description: 'Shown when nothing is selected.',
    },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the trigger.' },
  ],
}
