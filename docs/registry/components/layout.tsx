import { useState } from 'react'
import {
  AppFrame,
  Button,
  ChatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  IconButton,
  EllipsisIcon,
  SearchField,
  Section,
  SectionBody,
  SectionFooter,
  SectionHeader,
  SectionToolbar,
  Sidebar,
  SettingsIcon,
} from '@hamidrezazargham/liquidkit'
import type { ComponentDoc } from '../types'

const SECTIONS = [
  {
    items: [
      { id: 'chat', icon: <ChatIcon />, label: 'Chat' },
      { id: 'files', icon: <FolderIcon />, label: 'Files' },
      { id: 'settings', icon: <SettingsIcon />, label: 'Settings' },
    ],
  },
]

function FrameDemo() {
  const [active, setActive] = useState('files')
  const [collapsed, setCollapsed] = useState(false)
  return (
    <AppFrame
      // Embedded in a page that scrolls, so it borrows the viewport's rules
      // rather than taking them over.
      lockDocument={false}
      height="380px"
      minWidth={0}
      sidebar={
        <Sidebar
          density="comfortable"
          sections={SECTIONS}
          activeId={active}
          onSelect={setActive}
          collapsed={collapsed}
          collapsedWidth={68}
          width={240}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          header={<strong>◇ Machine</strong>}
        />
      }
    >
      <Section>
        <SectionHeader title="Files" subtitle="Everything the team shares" eyebrow="Storage" />
        <SectionBody>
          <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 2 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <li key={i}>Document {i + 1}</li>
            ))}
          </ul>
        </SectionBody>
        <SectionFooter>
          <Button size="sm" variant="accent">
            Upload
          </Button>
        </SectionFooter>
      </Section>
    </AppFrame>
  )
}

export const appFrameDoc: ComponentDoc = {
  slug: 'app-frame',
  name: 'AppFrame',
  category: 'Layout',
  summary:
    'The viewport-locked application frame: a fixed column of furniture beside a work area, on a golden-ratio spacing ladder, with an honest answer below its minimum width.',
  importLine: "import { AppFrame } from '@hamidrezazargham/liquidkit'",
  examples: [
    {
      title: 'Frame, sidebar and section',
      description:
        'Drag the sidebar’s right edge to resize it; click it without travelling to collapse it to a rail. Only the section body scrolls.',
      demo: <FrameDemo />,
      stage: false,
      wide: true,
      code: `<AppFrame sidebar={<Sidebar {...sidebar.props} sections={sections} />}>
  <Section>
    <SectionHeader title="Files" subtitle="Everything the team shares" />
    <SectionBody>{rows}</SectionBody>
    <SectionFooter><Button variant="accent">Upload</Button></SectionFooter>
  </Section>
</AppFrame>`,
    },
  ],
  props: [
    { name: 'sidebar', type: 'ReactNode', required: true, description: 'The fixed column.' },
    {
      name: 'gutter',
      type: 'number',
      default: '12',
      description: 'Frame padding and column gap. The work area’s inner gutter is this × φ.',
    },
    { name: 'height', type: 'string', default: "'100dvh'", description: 'Frame height.' },
    {
      name: 'lockDocument',
      type: 'boolean',
      default: 'true',
      description: 'Stop the document scrolling while the frame is mounted.',
    },
    {
      name: 'minWidth',
      type: 'number',
      default: '820',
      description: 'Below this the frame is replaced rather than squeezed.',
    },
    {
      name: 'belowMinWidth',
      type: 'ReactNode',
      description: 'What to show instead. Defaults to a built-in notice.',
    },
  ],
}

export const sectionDoc: ComponentDoc = {
  slug: 'section',
  name: 'Section',
  category: 'Layout',
  summary:
    'One work area, one layout: a header row that never scrolls, a body that does, and an optional footer docked to the bottom of the frame.',
  importLine:
    "import { Section, SectionHeader, SectionToolbar, SectionBody, SectionFooter } from '@hamidrezazargham/liquidkit'",
  examples: [
    {
      title: 'Header · body · footer',
      description:
        'The header and footer stay put whatever the body contains — a heading that scrolls away and a composer pushed off the bottom are the same bug, and this shape cannot express it.',
      demo: (
        <div style={{ height: 300, width: '100%' }}>
          <Section>
            <SectionHeader
              title="Conversation"
              subtitle="Read-only: the agent may read company files, not change them"
              eyebrow="Chat"
            />
            <SectionBody>
              <p style={{ margin: 0, lineHeight: 1.65 }}>
                {Array.from({ length: 12 }, (_, i) => `Paragraph ${i + 1}. `).join('')}
              </p>
            </SectionBody>
            <SectionFooter>
              <Button block>Ask something</Button>
            </SectionFooter>
          </Section>
        </div>
      ),
      stage: false,
      wide: true,
      code: `<Section>
  <SectionHeader title="Conversation" subtitle="Read-only" eyebrow="Chat" />
  <SectionBody>{transcript}</SectionBody>
  <SectionFooter>{composer}</SectionFooter>
</Section>`,
    },
    {
      title: 'Toolbar instead of a header',
      description:
        'The header row a browser wears: one slim 54 px line of chrome — where you are, how to get back, and one button holding everything you can do here. A screen whose content already names itself does not need a 22 px heading repeating that name, so the location is plain text rather than an `h1`, and the space a title and a lede would take goes to the content.',
      demo: (
        <div style={{ height: 220, width: '100%' }}>
          <Section>
            <SectionToolbar
              leading={
                <>
                  <IconButton size="sm" aria-label="Back">
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton size="sm" aria-label="Forward" disabled>
                    <ChevronRightIcon />
                  </IconButton>
                </>
              }
              actions={
                <>
                  <SearchField placeholder="Search" />
                  <IconButton size="sm" aria-label="More actions">
                    <EllipsisIcon />
                  </IconButton>
                </>
              }
            >
              Files / Contracts
            </SectionToolbar>
            <SectionBody>
              <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 2 }}>
                {Array.from({ length: 8 }, (_, i) => (
                  <li key={i}>Agreement {i + 1}.pdf</li>
                ))}
              </ul>
            </SectionBody>
          </Section>
        </div>
      ),
      stage: false,
      wide: true,
      code: `<Section>
  <SectionToolbar
    leading={<><IconButton aria-label="Back"><ChevronLeftIcon /></IconButton></>}
    actions={<IconButton aria-label="More actions"><EllipsisIcon /></IconButton>}
  >
    Files / Contracts
  </SectionToolbar>
  <SectionBody>{rows}</SectionBody>
</Section>`,
    },
  ],
  props: [
    { name: 'gap', type: 'number', default: '12', description: 'Space between the three rows.' },
  ],
  extraProps: [
    {
      title: 'SectionHeader',
      props: [
        { name: 'title', type: 'ReactNode', description: 'The work area’s h1.' },
        { name: 'subtitle', type: 'ReactNode', description: 'One quiet line under it.' },
        {
          name: 'eyebrow',
          type: 'ReactNode',
          description: 'A small tracked uppercase label above the title.',
        },
        { name: 'actions', type: 'ReactNode', description: 'Pushed to the trailing edge.' },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Replaces the title block outright — this is where a wordmark goes.',
        },
      ],
    },
    {
      title: 'SectionToolbar',
      props: [
        {
          name: 'leading',
          type: 'ReactNode',
          description: 'Controls at the leading edge — a back/forward pair, typically.',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Where the reader is, as plain text. Not a heading: nothing is named twice.',
        },
        {
          name: 'actions',
          type: 'ReactNode',
          description: 'The trailing edge: a field, then the one button everything else is behind.',
        },
      ],
    },
    {
      title: 'SectionBody',
      props: [
        {
          name: 'scroll',
          type: 'boolean',
          default: 'true',
          description:
            'Whether this is the region that scrolls. False clips instead, for a section with a more specific scroller inside it.',
        },
      ],
    },
  ],
}
