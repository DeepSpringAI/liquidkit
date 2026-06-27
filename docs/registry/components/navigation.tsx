import { useState } from 'react'
import {
  Dock,
  Toolbar,
  NavBar,
  Button,
  HomeIcon,
  SearchIcon,
  CompassIcon,
  BellIcon,
  UserIcon,
  PlusIcon,
  EditIcon,
  ImageIcon,
  SparkleIcon,
} from 'liquidkit'
import type { ComponentDoc } from '../types'

/* ------------------------------------------------------------------ Dock */

function DockDemo() {
  const [active, setActive] = useState('home')
  return (
    <Dock
      orientation="horizontal"
      activeId={active}
      onSelect={setActive}
      items={[
        { id: 'home', icon: <HomeIcon />, label: 'Home' },
        { id: 'search', icon: <SearchIcon />, label: 'Search' },
        { id: 'explore', icon: <CompassIcon />, label: 'Explore' },
        { id: 'alerts', icon: <BellIcon />, label: 'Alerts' },
        { id: 'me', icon: <UserIcon />, label: 'Profile' },
      ]}
    />
  )
}

export const dockDoc: ComponentDoc = {
  slug: 'dock',
  name: 'Dock',
  category: 'Navigation',
  summary: 'A floating icon dock / tab bar. Horizontal or vertical, with an active highlight.',
  importLine: "import { Dock } from 'liquidkit'",
  examples: [
    {
      title: 'Horizontal dock',
      demo: <DockDemo />,
      code: `function Nav() {
  const [active, setActive] = useState('home')
  return (
    <Dock
      orientation="horizontal"
      activeId={active}
      onSelect={setActive}
      items={[
        { id: 'home', icon: <HomeIcon />, label: 'Home' },
        { id: 'search', icon: <SearchIcon />, label: 'Search' },
        { id: 'explore', icon: <CompassIcon />, label: 'Explore' },
        { id: 'me', icon: <UserIcon />, label: 'Profile' },
      ]}
    />
  )
}`,
    },
    {
      title: 'Bare mode',
      description:
        'Set glass={false} when nesting the dock inside another glass surface to avoid stacking refraction filters.',
      demo: (
        <Dock
          glass={false}
          orientation="horizontal"
          activeId="home"
          items={[
            { id: 'home', icon: <HomeIcon /> },
            { id: 'search', icon: <SearchIcon /> },
            { id: 'me', icon: <UserIcon /> },
          ]}
        />
      ),
      code: `<Dock glass={false} items={items} activeId="home" />`,
    },
  ],
  props: [
    { name: 'items', type: 'DockItem[]', required: true, description: 'Items: { id, icon, label?, href?, onClick? }.' },
    { name: 'activeId', type: 'string', description: 'Currently active item id.' },
    { name: 'onSelect', type: '(id: string) => void', description: 'Fires when an item is chosen.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Icon size.' },
    { name: 'tint', type: 'GlassTint', default: "'auto'", description: 'Surface tint.' },
    { name: 'elevation', type: '0 | 1 | 2 | 3', default: '2', description: 'Drop-shadow depth.' },
    { name: 'glass', type: 'boolean', default: 'true', description: 'Render the glass container. Set false when embedding.' },
  ],
}

/* --------------------------------------------------------------- Toolbar */

export const toolbarDoc: ComponentDoc = {
  slug: 'toolbar',
  name: 'Toolbar',
  category: 'Navigation',
  summary: 'A horizontal action bar with icon buttons and prominent primary (accent) actions.',
  importLine: "import { Toolbar } from 'liquidkit'",
  examples: [
    {
      title: 'Editor toolbar',
      demo: (
        <Toolbar
          items={[
            { id: 'new', icon: <PlusIcon />, label: 'New', primary: true },
            { id: 'edit', icon: <EditIcon />, label: 'Edit' },
            { id: 'image', icon: <ImageIcon />, label: 'Image' },
            { id: 'enhance', icon: <SparkleIcon />, label: 'Enhance', dropdown: true },
          ]}
        />
      ),
      code: `<Toolbar
  items={[
    { id: 'new', icon: <PlusIcon />, label: 'New', primary: true },
    { id: 'edit', icon: <EditIcon />, label: 'Edit' },
    { id: 'image', icon: <ImageIcon />, label: 'Image' },
    { id: 'enhance', icon: <SparkleIcon />, label: 'Enhance', dropdown: true },
  ]}
/>`,
    },
  ],
  props: [
    { name: 'items', type: 'ToolbarItem[]', required: true, description: 'Items: { id, icon, label?, primary?, dropdown?, active?, onClick? }.' },
    { name: 'glow', type: 'boolean', default: 'true', description: 'Glow ring on primary items.' },
    { name: 'tint', type: 'GlassTint', default: "'auto'", description: 'Surface tint.' },
    { name: 'elevation', type: '0 | 1 | 2 | 3', default: '2', description: 'Drop-shadow depth.' },
    { name: 'glass', type: 'boolean', default: 'true', description: 'Render the glass container. Set false when embedding.' },
  ],
}

/* ---------------------------------------------------------------- NavBar */

export const navBarDoc: ComponentDoc = {
  slug: 'navbar',
  name: 'NavBar',
  category: 'Navigation',
  summary: 'A floating top navigation bar with a brand, links and an actions slot.',
  importLine: "import { NavBar } from 'liquidkit'",
  examples: [
    {
      title: 'App nav',
      wide: true,
      demo: (
        <NavBar
          brand={<strong>◇ LiquidKit</strong>}
          links={[
            { label: 'Home', active: true },
            { label: 'Docs' },
            { label: 'Components' },
            { label: 'Pricing' },
          ]}
          actions={<Button size="sm" variant="accent">Sign in</Button>}
        />
      ),
      code: `<NavBar
  brand={<strong>◇ LiquidKit</strong>}
  links={[
    { label: 'Home', active: true },
    { label: 'Docs' },
    { label: 'Components' },
  ]}
  actions={<Button size="sm" variant="accent">Sign in</Button>}
/>`,
    },
  ],
  props: [
    { name: 'brand', type: 'ReactNode', description: 'Left-aligned brand / logo.' },
    { name: 'links', type: 'NavLink[]', description: 'Links: { label, href?, active?, onClick? }.' },
    { name: 'actions', type: 'ReactNode', description: 'Right-aligned actions slot.' },
    { name: 'pill', type: 'boolean', default: 'true', description: 'Pill shape.' },
  ],
}
