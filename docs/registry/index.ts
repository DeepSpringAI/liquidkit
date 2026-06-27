import type { ComponentDoc } from './types'
import { liquidGlassDoc, cardDoc } from './components/primitives'
import {
  buttonDoc,
  iconButtonDoc,
  switchDoc,
  themeToggleDoc,
  sliderDoc,
  tabsDoc,
  selectDoc,
} from './components/actions'
import { inputDoc, searchFieldDoc, stepperDoc, commandBarDoc } from './components/inputs'
import {
  badgeDoc,
  avatarDoc,
  progressDoc,
  tooltipDoc,
  chartCardDoc,
  statTileDoc,
  pricingCardDoc,
  listDoc,
  tableDoc,
  tileDoc,
} from './components/data'
import {
  dockDoc,
  toolbarDoc,
  navBarDoc,
  tabBarDoc,
  sidebarDoc,
  navigationBarDoc,
} from './components/navigation'
import { modalDoc, sheetDoc, menuDoc, popoverDoc, toastDoc } from './components/overlays'
import { guides } from './guides'

export const componentDocs: ComponentDoc[] = [
  // Primitives
  liquidGlassDoc,
  cardDoc,
  // Actions
  buttonDoc,
  iconButtonDoc,
  switchDoc,
  themeToggleDoc,
  sliderDoc,
  tabsDoc,
  selectDoc,
  // Inputs
  inputDoc,
  searchFieldDoc,
  stepperDoc,
  commandBarDoc,
  // Data Display
  badgeDoc,
  avatarDoc,
  progressDoc,
  tooltipDoc,
  chartCardDoc,
  statTileDoc,
  pricingCardDoc,
  listDoc,
  tableDoc,
  tileDoc,
  // Navigation
  tabBarDoc,
  navigationBarDoc,
  sidebarDoc,
  dockDoc,
  toolbarDoc,
  navBarDoc,
  // Overlays
  modalDoc,
  sheetDoc,
  menuDoc,
  popoverDoc,
  toastDoc,
]

export const componentMap = Object.fromEntries(componentDocs.map((d) => [d.slug, d]))

/** Category order for the sidebar. */
export const CATEGORY_ORDER = [
  'Primitives',
  'Actions',
  'Inputs',
  'Data Display',
  'Navigation',
  'Overlays',
]

export interface NavSection {
  title: string
  items: { label: string; route: string }[]
}

export function buildNav(): NavSection[] {
  const guideSection: NavSection = {
    title: 'Getting Started',
    items: guides.map((g) => ({ label: g.title, route: `guide/${g.slug}` })),
  }

  const byCategory = new Map<string, { label: string; route: string }[]>()
  for (const doc of componentDocs) {
    const list = byCategory.get(doc.category) ?? []
    list.push({ label: doc.name, route: `components/${doc.slug}` })
    byCategory.set(doc.category, list)
  }

  const componentSections: NavSection[] = CATEGORY_ORDER.filter((c) => byCategory.has(c)).map(
    (c) => ({
      title: c,
      items: byCategory.get(c)!,
    }),
  )

  const resourceSection: NavSection = {
    title: 'Resources',
    items: [
      { label: 'Icons', route: 'icons' },
      { label: 'Templates', route: 'templates' },
    ],
  }

  return [guideSection, ...componentSections, resourceSection]
}
