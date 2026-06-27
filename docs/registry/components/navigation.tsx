import { useRef, useState } from 'react'
import {
  Dock,
  Toolbar,
  NavBar,
  TabBar,
  Sidebar,
  NavigationBar,
  SearchField,
  Card,
  IconButton,
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
  FolderIcon,
  HashIcon,
  ClockIcon,
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

/* --------------------------------------------------------------- Sidebar */

function SidebarDemo() {
  const [active, setActive] = useState('all')
  return (
    <Sidebar
      activeId={active}
      onSelect={setActive}
      style={{ height: 360 }}
      header={<strong style={{ fontSize: 15, padding: '0 4px' }}>◇ Mail</strong>}
      sections={[
        {
          items: [
            { id: 'all', icon: <FolderIcon />, label: 'All Inboxes', badge: '128' },
            { id: 'unread', icon: <BellIcon />, label: 'Unread', badge: '9' },
            { id: 'flagged', icon: <SparkleIcon />, label: 'Flagged' },
          ],
        },
        {
          title: 'Mailboxes',
          items: [
            { id: 'work', icon: <HashIcon />, label: 'Work' },
            { id: 'personal', icon: <HomeIcon />, label: 'Personal' },
            { id: 'later', icon: <ClockIcon />, label: 'Read Later' },
          ],
        },
      ]}
    />
  )
}

export const sidebarDoc: ComponentDoc = {
  slug: 'sidebar',
  name: 'Sidebar',
  category: 'Navigation',
  summary:
    'The macOS source-list sidebar — sectioned navigation with icons, badges, an accent selection, and header / footer slots.',
  importLine: "import { Sidebar } from 'liquidkit'",
  examples: [
    {
      title: 'Source list',
      demo: <SidebarDemo />,
      code: `function Nav() {
  const [active, setActive] = useState('all')
  return (
    <Sidebar
      activeId={active}
      onSelect={setActive}
      header={<strong>◇ Mail</strong>}
      sections={[
        { items: [
          { id: 'all', icon: <FolderIcon />, label: 'All Inboxes', badge: '128' },
          { id: 'unread', icon: <BellIcon />, label: 'Unread', badge: '9' },
        ] },
        { title: 'Mailboxes', items: [
          { id: 'work', icon: <HashIcon />, label: 'Work' },
          { id: 'personal', icon: <HomeIcon />, label: 'Personal' },
        ] },
      ]}
    />
  )
}`,
    },
  ],
  props: [
    { name: 'sections', type: 'SidebarSection[]', required: true, description: '{ title?, items: SidebarItem[] }. Items: { id, label, icon?, badge?, href?, onClick? }.' },
    { name: 'activeId', type: 'string', description: 'Currently selected item id.' },
    { name: 'onSelect', type: '(id: string) => void', description: 'Fires when an item is chosen.' },
    { name: 'header', type: 'ReactNode', description: 'Pinned above the nav.' },
    { name: 'footer', type: 'ReactNode', description: 'Pinned to the bottom.' },
    { name: 'width', type: 'number', default: '248', description: 'Sidebar width in px.' },
    { name: 'tint', type: 'GlassTint', default: "'auto'", description: 'Surface tint.' },
    { name: 'glass', type: 'boolean', default: 'true', description: 'Glass surface; false for an opaque sidebar.' },
  ],
}

/* -------------------------------------------------------- NavigationBar */

function NavigationBarDemo() {
  const scrollRef = useRef<HTMLDivElement>(null)
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        height: 380,
        margin: '0 auto',
        borderRadius: 22,
        overflow: 'hidden',
        border: '1px solid var(--lk-glass-border-soft)',
        background: 'var(--lk-bg)',
      }}
    >
      <div ref={scrollRef} style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <NavigationBar
            title="Settings"
            scrollTarget={scrollRef}
            trailing={<IconButton aria-label="Add" size="sm"><PlusIcon /></IconButton>}
            search={<SearchField placeholder="Search" />}
          />
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <Card key={i} padding="sm">Item {i + 1}</Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export const navigationBarDoc: ComponentDoc = {
  slug: 'navigation-bar',
  name: 'NavigationBar',
  category: 'Navigation',
  summary:
    'The iOS large-title navigation bar — a glass header whose large title collapses into a centered inline title as the content scrolls, with leading/trailing actions and an optional search row.',
  importLine: "import { NavigationBar } from 'liquidkit'",
  examples: [
    {
      title: 'Large title (scroll to collapse)',
      description: 'Scroll inside the frame — the large title shrinks into the inline title and a hairline appears.',
      demo: <NavigationBarDemo />,
      code: `function Screen() {
  const scrollRef = useRef(null)
  return (
    <div ref={scrollRef} style={{ overflow: 'auto', height: '100dvh' }}>
      <div style={{ position: 'sticky', top: 0 }}>
        <NavigationBar
          title="Settings"
          scrollTarget={scrollRef}
          trailing={<IconButton aria-label="Add"><PlusIcon /></IconButton>}
          search={<SearchField placeholder="Search" />}
        />
      </div>
      {/* …content… */}
    </div>
  )
}`,
    },
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'The title (shown large, then inline).' },
    { name: 'largeTitle', type: 'boolean', default: 'true', description: 'Collapsing large title; false for an inline-only bar.' },
    { name: 'leading', type: 'ReactNode', description: 'Leading content (e.g. a back button).' },
    { name: 'trailing', type: 'ReactNode', description: 'Trailing actions.' },
    { name: 'search', type: 'ReactNode', description: 'A row under the title — typically a SearchField.' },
    { name: 'collapseAt', type: 'number', default: '8', description: 'scrollY past which the large title collapses.' },
    { name: 'scrollTarget', type: 'RefObject<HTMLElement>', description: 'Scroll container to react to; defaults to the window.' },
    { name: 'tint', type: 'GlassTint', default: "'auto'", description: 'Surface tint.' },
  ],
}

/* --------------------------------------------------------------- TabBar */

function TabBarDemo() {
  const [tab, setTab] = useState('home')
  return (
    <TabBar
      value={tab}
      onChange={setTab}
      items={[
        { id: 'home', icon: <HomeIcon />, label: 'Home' },
        { id: 'search', icon: <SearchIcon />, label: 'Search' },
        { id: 'explore', icon: <CompassIcon />, label: 'Explore' },
        { id: 'alerts', icon: <BellIcon />, label: 'Alerts', badge: '3' },
        { id: 'me', icon: <UserIcon />, label: 'Profile' },
      ]}
    />
  )
}

export const tabBarDoc: ComponentDoc = {
  slug: 'tab-bar',
  name: 'TabBar',
  category: 'Navigation',
  summary:
    'The iOS 26 floating tab bar — a glass capsule of icon + label tabs with badges, accent-tinted selection, and an optional scroll-reactive condense.',
  importLine: "import { TabBar } from 'liquidkit'",
  examples: [
    {
      title: 'Floating tab bar',
      demo: <TabBarDemo />,
      code: `function Bar() {
  const [tab, setTab] = useState('home')
  return (
    <TabBar
      value={tab}
      onChange={setTab}
      items={[
        { id: 'home', icon: <HomeIcon />, label: 'Home' },
        { id: 'search', icon: <SearchIcon />, label: 'Search' },
        { id: 'explore', icon: <CompassIcon />, label: 'Explore' },
        { id: 'alerts', icon: <BellIcon />, label: 'Alerts', badge: '3' },
        { id: 'me', icon: <UserIcon />, label: 'Profile' },
      ]}
    />
  )
}`,
    },
    {
      title: 'Scroll-reactive',
      description:
        'Set condense to collapse the labels and shrink the bar as the page scrolls down — it expands again when you scroll up or reach the top.',
      demo: (
        <TabBar
          defaultValue="home"
          items={[
            { id: 'home', icon: <HomeIcon />, label: 'Home' },
            { id: 'search', icon: <SearchIcon />, label: 'Search' },
            { id: 'me', icon: <UserIcon />, label: 'Profile' },
          ]}
        />
      ),
      code: `<TabBar condense items={items} value={tab} onChange={setTab} />`,
    },
  ],
  props: [
    { name: 'items', type: 'TabBarItem[]', required: true, description: 'Items: { id, icon, label?, badge? }.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled / uncontrolled active id.' },
    { name: 'onChange', type: '(id: string) => void', description: 'Fires when a tab is chosen.' },
    { name: 'condense', type: 'boolean', default: 'false', description: 'Collapse labels & shrink when scrolling down.' },
    { name: 'floating', type: 'boolean', default: 'true', description: 'Floating capsule vs. an edge-to-edge bar.' },
    { name: 'tint', type: 'GlassTint', default: "'auto'", description: 'Surface tint.' },
    { name: 'elevation', type: '0 | 1 | 2 | 3', default: '3', description: 'Drop-shadow depth.' },
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
