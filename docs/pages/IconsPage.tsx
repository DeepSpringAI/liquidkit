import { useState } from 'react'
import {
  LiquidGlass,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  GridIcon,
  CompassIcon,
  ClockIcon,
  BellIcon,
  GlobeIcon,
  LockIcon,
  CubeIcon,
  PlusIcon,
  CheckIcon,
  UploadIcon,
  EditIcon,
  SendIcon,
  MicIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  PlayIcon,
  ImageIcon,
  VideoIcon,
  CodeIcon,
  SparkleIcon,
  HashIcon,
  WalletIcon,
  UserIcon,
  HeartIcon,
  ChatIcon,
  FolderIcon,
  SunIcon,
  MoonIcon,
} from 'liquidkit'

const ICONS: [string, typeof HomeIcon][] = [
  ['ArrowRightIcon', ArrowRightIcon],
  ['ArrowUpRightIcon', ArrowUpRightIcon],
  ['BellIcon', BellIcon],
  ['ChatIcon', ChatIcon],
  ['CheckIcon', CheckIcon],
  ['ChevronDownIcon', ChevronDownIcon],
  ['ChevronRightIcon', ChevronRightIcon],
  ['ClockIcon', ClockIcon],
  ['CloseIcon', CloseIcon],
  ['CodeIcon', CodeIcon],
  ['CompassIcon', CompassIcon],
  ['CubeIcon', CubeIcon],
  ['EditIcon', EditIcon],
  ['FolderIcon', FolderIcon],
  ['GlobeIcon', GlobeIcon],
  ['GridIcon', GridIcon],
  ['HashIcon', HashIcon],
  ['HeartIcon', HeartIcon],
  ['HomeIcon', HomeIcon],
  ['ImageIcon', ImageIcon],
  ['LockIcon', LockIcon],
  ['MicIcon', MicIcon],
  ['MoonIcon', MoonIcon],
  ['PlayIcon', PlayIcon],
  ['PlusIcon', PlusIcon],
  ['SearchIcon', SearchIcon],
  ['SendIcon', SendIcon],
  ['SettingsIcon', SettingsIcon],
  ['SparkleIcon', SparkleIcon],
  ['SunIcon', SunIcon],
  ['UploadIcon', UploadIcon],
  ['UserIcon', UserIcon],
  ['VideoIcon', VideoIcon],
  ['WalletIcon', WalletIcon],
]

export function IconsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(`<${name} />`)
      setCopied(name)
      window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <article className="doc-page">
      <header className="doc-page__head">
        <span className="doc-page__eyebrow">Resources</span>
        <h1>Icons</h1>
        <p className="doc-page__lead">
          {ICONS.length} stroke icons, sized on a 24&times;24 grid. They inherit{' '}
          <code>currentColor</code> and accept a <code>size</code> prop. Click any tile to copy its
          tag.
        </p>
      </header>

      <LiquidGlass radius={20} style={{ padding: 12, width: '100%' }}>
        <div className="doc-icons">
          {ICONS.map(([name, Icon]) => (
            <button
              key={name}
              type="button"
              className="doc-icons__cell"
              onClick={() => copy(name)}
              title={`Copy <${name} />`}
            >
              <Icon size={24} />
              <span className="doc-icons__name">
                {copied === name ? 'Copied!' : name.replace(/Icon$/, '')}
              </span>
            </button>
          ))}
        </div>
      </LiquidGlass>
    </article>
  )
}
