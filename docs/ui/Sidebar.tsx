import { useState } from 'react'
import { Input, SearchIcon } from 'liquidkit'
import { cx } from 'liquidkit'
import { buildNav } from '../registry'

const NAV = buildNav()

export function Sidebar({ route, onNavigate }: { route: string; onNavigate?: () => void }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const sections = NAV.map((s) => ({
    ...s,
    items: query ? s.items.filter((i) => i.label.toLowerCase().includes(query)) : s.items,
  })).filter((s) => s.items.length)

  return (
    <nav className="doc-sidebar" aria-label="Documentation">
      <div className="doc-sidebar__search">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter…"
          leftIcon={<SearchIcon size={16} />}
          inputSize="sm"
        />
      </div>
      <div className="doc-sidebar__scroll">
        {sections.map((section) => (
          <div key={section.title} className="doc-nav-group">
            <p className="doc-nav-group__title">{section.title}</p>
            <ul>
              {section.items.map((item) => (
                <li key={item.route}>
                  <a
                    href={`#/${item.route}`}
                    onClick={onNavigate}
                    className={cx('doc-nav-link', route === item.route && 'is-active')}
                    aria-current={route === item.route ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!sections.length && <p className="doc-nav-empty">No matches.</p>}
      </div>
    </nav>
  )
}
