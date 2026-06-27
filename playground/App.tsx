import { useEffect, useState } from 'react'
import {
  ArrowUpRightIcon,
  Button,
  Card,
  ChartCard,
  ChatIcon,
  CodeIcon,
  CommandBar,
  CompassIcon,
  CubeIcon,
  Dock,
  GlassIcon,
  GlobeIcon,
  GridIcon,
  HeartIcon,
  HomeIcon,
  HashIcon,
  IconButton,
  ImageIcon,
  Input,
  LandingHero,
  LiquidGlass,
  NavBar,
  PlayIcon,
  PlusIcon,
  PricingPage,
  SearchIcon,
  SendIcon,
  SparkleIcon,
  StatTile,
  Switch,
  ThemeProvider,
  ThemeToggle,
  Toolbar,
  UploadIcon,
  UserIcon,
  VideoIcon,
  DashboardShell,
  WaitlistPage,
} from 'liquidkit'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="sec">
      <h2 className="sec__title">{title}</h2>
      <div className="sec__row">{children}</div>
    </section>
  )
}

function Gallery() {
  const [wifi, setWifi] = useState(true)
  const [nav, setNav] = useState('home')

  return (
    <div className="stage">
      <header className="stage__top">
        <h1>LiquidKit</h1>
        <ThemeToggle />
      </header>

      <Section title="Buttons">
        <Button leftIcon={<UploadIcon />} pill>Upload</Button>
        <Button variant="accent" rightIcon={<ArrowUpRightIcon />}>Get started</Button>
        <Button variant="ghost">Learn more</Button>
        <Button size="lg" glow pill leftIcon={<HomeIcon />}>Home</Button>
        <IconButton aria-label="Add"><PlusIcon /></IconButton>
        <IconButton aria-label="Home" glow><HomeIcon /></IconButton>
      </Section>

      <Section title="Switches">
        <Switch defaultChecked />
        <Switch size="sm" />
        <Switch size="lg" glow defaultChecked />
        <Switch label="Wi-Fi" checked={wifi} onChange={setWifi} />
      </Section>

      <Section title="Inputs & command bar">
        <Input placeholder="Search…" leftIcon={<SearchIcon />} pill />
        <div style={{ flexBasis: '100%', maxWidth: 560 }}>
          <CommandBar
            placeholder="Ask me anything…"
            leading={<IconButton aria-label="Add" size="sm"><PlusIcon /></IconButton>}
            trailing={<IconButton aria-label="Send" size="sm" variant="accent"><SendIcon /></IconButton>}
            footer={
              <>
                <Button size="sm" variant="ghost" leftIcon={<GlobeIcon />}>Search</Button>
                <Button size="sm" variant="ghost" leftIcon={<SparkleIcon />}>Think</Button>
              </>
            }
          />
        </div>
      </Section>

      <Section title="Navigation">
        <Dock
          orientation="vertical"
          activeId={nav}
          onSelect={setNav}
          items={[
            { id: 'home', icon: <HomeIcon />, label: 'Home' },
            { id: 'cube', icon: <CubeIcon />, label: 'Models' },
            { id: 'globe', icon: <GlobeIcon />, label: 'Network' },
          ]}
        />
        <Toolbar
          items={[
            { id: 'play', icon: <PlayIcon />, label: 'Play', primary: true },
            { id: 'hash', icon: <HashIcon />, label: 'Tag' },
            { id: 'chat', icon: <ChatIcon />, label: 'Comment', dropdown: true },
            { id: 'user', icon: <UserIcon />, label: 'Account', dropdown: true },
          ]}
        />
      </Section>

      <Section title="Glass icons">
        <GlassIcon><HeartIcon /></GlassIcon>
        <GlassIcon><ChatIcon /></GlassIcon>
        <GlassIcon pill><UserIcon /></GlassIcon>
        <GlassIcon tint="accent"><PlayIcon /></GlassIcon>
        <GlassIcon><CompassIcon /></GlassIcon>
      </Section>

      <Section title="Data">
        <ChartCard
          title="Post views"
          value="2,670 views"
          data={[12, 30, 18, 36, 22, 40, 28, 48, 38, 52]}
          labels={['8am', '10am', '12pm', '2pm', '4pm', '6pm']}
          action={<IconButton aria-label="Like" size="sm" variant="accent"><HeartIcon /></IconButton>}
        />
        <StatTile glow accent="#3b82f6" label="AMZN" value="$1.8B vol" delta="2.4%" direction="up" />
        <StatTile glow accent="#8b5cff" label="GOOG" value="$2.9B vol" delta="1.1%" direction="down" />
      </Section>

      <p className="links">
        Templates: <a href="#landing">#landing</a> · <a href="#waitlist">#waitlist</a> ·{' '}
        <a href="#pricing">#pricing</a> · <a href="#dashboard">#dashboard</a> · <a href="#lab">#lab</a>
      </p>
    </div>
  )
}

function LandingScene() {
  return (
    <LandingHero
      brand={<>✦ Nimbus</>}
      links={[
        { label: 'Home', href: '#', active: true },
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#pricing' },
      ]}
      navActions={
        <>
          <ThemeToggle size="sm" />
          <Button variant="accent" pill>Download</Button>
        </>
      }
      eyebrow="Liquid glass, natively"
      title="Build interfaces that bend light"
      subtitle="A React component library with true refraction, chromatic dispersion, and first-class light & dark themes."
      primaryAction={<Button size="lg" variant="accent" pill rightIcon={<ArrowUpRightIcon />}>Get started</Button>}
      secondaryAction={<Button size="lg" pill leftIcon={<PlayIcon />}>Watch demo</Button>}
    />
  )
}

function WaitlistScene() {
  return (
    <WaitlistPage
      badge={<LiquidGlass pill style={{ padding: '6px 14px', fontSize: 13 }}>✦ Waitlist</LiquidGlass>}
      title="Coming soon!"
      subtitle="Sign up for our newsletter to receive the latest updates and insights straight to your inbox."
      placeholder="Enter email"
      ctaLabel="Join waitlist"
      watermark="Waitlist"
      socials={
        <>
          <IconButton aria-label="X"><HashIcon /></IconButton>
          <IconButton aria-label="Chat"><ChatIcon /></IconButton>
          <IconButton aria-label="Photos"><ImageIcon /></IconButton>
        </>
      }
    />
  )
}

function PricingScene() {
  const [yearly, setYearly] = useState(true)
  return (
    <PricingPage
      brand={<>✦ Forma</>}
      links={[
        { label: 'Home', href: '#' },
        { label: 'Pricing', href: '#', active: true },
        { label: 'FAQ', href: '#' },
      ]}
      navActions={<Button variant="accent" pill>Download</Button>}
      title="Pricing"
      subtitle="Start free. Upgrade when you grow."
      billing={{ yearly, onChange: setYearly, label: 'Yearly' }}
      tiers={[
        {
          name: 'Free',
          price: '$0',
          description: 'For creators taking their first steps.',
          features: ['Up to 3 projects', 'Export up to 1080p', 'Basic editing tools', { text: 'Team collaboration', included: false }],
          ctaLabel: 'Choose plan',
        },
        {
          name: 'Standard',
          price: yearly ? '$8' : '$10',
          description: 'For freelancers and small teams.',
          features: ['Up to 50 projects', 'Export up to 4K', 'Advanced toolkit', 'Up to 5 members'],
          ctaLabel: 'Choose plan',
          popular: true,
        },
        {
          name: 'Pro',
          price: yearly ? '$16' : '$20',
          description: 'For studios and agencies.',
          features: ['Unlimited projects', 'Export 8K + animations', 'AI content tools', 'Custom branding'],
          ctaLabel: 'Choose plan',
        },
      ]}
    />
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card radius={22} style={{ flex: 1, minWidth: 200 }}>
      <div className="feat">
        <span className="feat__icon">{icon}</span>
        <ArrowUpRightIcon size={18} />
        <h4 className="feat__title">{title}</h4>
        <p className="feat__desc">{desc}</p>
      </div>
    </Card>
  )
}

function DashboardScene() {
  const [navId, setNavId] = useState('images')
  return (
    <DashboardShell
      header={
        <>
          <NavBar brand={<>✦ Syntrix</>} links={[{ label: 'Dashboard', active: true }, { label: 'Settings' }, { label: 'Help' }]} />
          <ThemeToggle />
        </>
      }
      sidebar={
        <>
          <div style={{ fontWeight: 700, fontSize: 18, padding: '4px 8px 12px' }}>✦ Syntrix</div>
          <Button block leftIcon={<PlusIcon />} variant="accent">New chat</Button>
          <div style={{ height: 12 }} />
          <Dock
            orientation="vertical"
            activeId={navId}
            onSelect={setNavId}
            glass={false}
            items={[
              { id: 'images', icon: <ImageIcon />, label: 'Images' },
              { id: 'videos', icon: <VideoIcon />, label: 'Videos' },
              { id: 'code', icon: <CodeIcon />, label: 'Codex' },
              { id: 'apps', icon: <GridIcon />, label: 'Apps' },
            ]}
          />
          <div style={{ flex: 1 }} />
          <Card radius={18} padding="sm">
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Upgrade to Pro</p>
            <Button block size="sm" variant="accent">Upgrade now</Button>
          </Card>
        </>
      }
    >
      <div className="dash-welcome">
        <GlassIcon size={72} tint="accent"><SparkleIcon /></GlassIcon>
        <h1>Welcome back</h1>
        <p>Bring your ideas to life today</p>
      </div>
      <CommandBar
        placeholder="Ask me anything…"
        leading={<IconButton aria-label="Add" size="sm"><PlusIcon /></IconButton>}
        trailing={<IconButton aria-label="Send" size="sm" variant="accent"><SendIcon /></IconButton>}
        footer={
          <>
            <Button size="sm" variant="ghost" leftIcon={<SparkleIcon />}>Tools</Button>
            <Button size="sm" variant="ghost" leftIcon={<GlobeIcon />}>Deep think</Button>
          </>
        }
      />
      <div style={{ display: 'flex', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
        <FeatureCard icon={<ImageIcon />} title="Image Generator" desc="Turn ideas into stunning visuals." />
        <FeatureCard icon={<VideoIcon />} title="Video Generator" desc="Create cinematic videos from prompts." />
        <FeatureCard icon={<CodeIcon />} title="Dev Assistant" desc="Accelerate development with AI." />
      </div>
    </DashboardShell>
  )
}

const SCENES: Record<string, () => JSX.Element> = {
  '#landing': LandingScene,
  '#waitlist': WaitlistScene,
  '#pricing': PricingScene,
  '#dashboard': DashboardScene,
}

export function App() {
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '')
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const Scene = SCENES[hash]
  return (
    <ThemeProvider defaultMode="dark" storageKey="lk-playground-theme">
      {Scene ? <Scene /> : <Gallery />}
    </ThemeProvider>
  )
}
