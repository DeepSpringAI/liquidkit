import { useState } from 'react'
import {
  ArrowUpRightIcon,
  Button,
  Card,
  ChatIcon,
  CodeIcon,
  CommandBar,
  DashboardShell,
  Dock,
  GlassIcon,
  GlobeIcon,
  GridIcon,
  HashIcon,
  IconButton,
  ImageIcon,
  LandingHero,
  LiquidGlass,
  NavBar,
  PlayIcon,
  PlusIcon,
  PricingPage,
  SendIcon,
  SparkleIcon,
  ThemeToggle,
  VideoIcon,
  WaitlistPage,
} from 'liquidkit'

export function LandingScene() {
  return (
    <LandingHero
      brand={<>✦ Nimbus</>}
      links={[
        { label: 'Home', href: '#', active: true },
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#/preview/pricing' },
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

export function WaitlistScene() {
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

export function PricingScene() {
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

export function DashboardScene() {
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

export interface SceneMeta {
  slug: string
  name: string
  description: string
  Component: () => JSX.Element
}

export const scenes: SceneMeta[] = [
  { slug: 'landing', name: 'Landing Hero', description: 'A full landing hero with nav, eyebrow, headline and dual CTAs over a refractive background.', Component: LandingScene },
  { slug: 'waitlist', name: 'Waitlist Page', description: 'A centered waitlist capture with a glass card, email field, socials and a watermark.', Component: WaitlistScene },
  { slug: 'pricing', name: 'Pricing Page', description: 'A three-tier pricing layout with a billing toggle and a highlighted popular plan.', Component: PricingScene },
  { slug: 'dashboard', name: 'Dashboard Shell', description: 'An app shell with a glass sidebar, top nav, command bar and feature cards.', Component: DashboardScene },
]

export const sceneMap = Object.fromEntries(scenes.map((s) => [s.slug, s]))
