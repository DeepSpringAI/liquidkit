import { useState } from 'react'
import { ThemeProvider, ThemeToggle, Button, LiquidGlass, cx, ArrowRightIcon } from 'liquidkit'
import { useHashRoute, navigate } from './router'
import { Sidebar } from './ui/Sidebar'
import { Home } from './pages/Home'
import { GuidePage } from './pages/GuidePage'
import { ComponentPage } from './pages/ComponentPage'
import { IconsPage } from './pages/IconsPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { ThemesPage } from './pages/ThemesPage'
import { componentMap } from './registry'
import { guideMap } from './registry/guides'
import { sceneMap } from './scenes'

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.9c-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.49-1.11-1.49-.9-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.85c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
)

function PreviewFrame({ slug }: { slug: string }) {
  const scene = sceneMap[slug]
  if (!scene) return <NotFound />
  const Scene = scene.Component
  return (
    <div className="doc-preview">
      <Scene />
      <div className="doc-preview__bar">
        <LiquidGlass
          pill
          elevation={3}
          style={{ padding: '6px 6px 6px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <span style={{ fontSize: 14, fontWeight: 600 }}>{scene.name}</span>
          <Button size="sm" pill variant="accent" onClick={() => navigate('templates')}>
            ← Back to docs
          </Button>
        </LiquidGlass>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <article className="doc-page">
      <header className="doc-page__head">
        <h1>Not found</h1>
        <p className="doc-page__lead">That page doesn't exist.</p>
      </header>
      <Button as="a" href="#/" variant="accent" pill rightIcon={<ArrowRightIcon />}>
        Go home
      </Button>
    </article>
  )
}

function Content({ route }: { route: string }) {
  if (route === '' || route === 'home') return <Home />
  if (route === 'icons') return <IconsPage />
  if (route === 'templates') return <TemplatesPage />
  if (route === 'themes') return <ThemesPage />

  const [kind, slug] = route.split('/')
  if (kind === 'guide' && guideMap[slug]) return <GuidePage guide={guideMap[slug]} />
  if (kind === 'components' && componentMap[slug]) return <ComponentPage doc={componentMap[slug]} />
  return <NotFound />
}

function Shell() {
  const route = useHashRoute()
  const [menuOpen, setMenuOpen] = useState(false)

  if (route.startsWith('preview/')) {
    return <PreviewFrame slug={route.slice('preview/'.length)} />
  }

  const isHome = route === '' || route === 'home'

  return (
    <div className={cx('doc-shell', menuOpen && 'is-menu-open')}>
      <header className="doc-topbar">
        <button
          type="button"
          className="doc-topbar__menu"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <a href="#/" className="doc-brand" onClick={() => setMenuOpen(false)}>
          <span className="doc-brand__mark">◇</span> LiquidKit
        </a>
        <div className="doc-topbar__spacer" />
        <a
          className="doc-topbar__gh"
          href="https://github.com/hamidrezazargham/liquidkit"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
        >
          <GitHubIcon />
        </a>
        <ThemeToggle />
      </header>

      <div className="doc-body">
        <aside className="doc-aside">
          <Sidebar route={route} onNavigate={() => setMenuOpen(false)} />
        </aside>
        {menuOpen && (
          <div className="doc-scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />
        )}
        <main className={cx('doc-main', isHome && 'doc-main--wide')}>
          <div className="doc-bg" aria-hidden="true" />
          <Content route={route} />
          <footer className="doc-footer">
            <span>Built with LiquidKit · MIT licensed</span>
            <a
              href="https://github.com/hamidrezazargham/liquidkit"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider defaultMode="dark" storageKey="lk-docs-theme">
      <Shell />
    </ThemeProvider>
  )
}
