import { useRef, useState } from 'react'
import {
  AirplaneIcon,
  ArrowUpRightIcon,
  Avatar,
  Badge,
  BellIcon,
  BluetoothIcon,
  Button,
  CameraIcon,
  Card,
  ChatIcon,
  ClockIcon,
  CodeIcon,
  CommandBar,
  cx,
  DashboardShell,
  DatabaseIcon,
  Dock,
  FlashlightIcon,
  FlowCanvas,
  FlowMinimap,
  GitBranchIcon,
  GlassIcon,
  GlobeIcon,
  GridIcon,
  HashIcon,
  IconButton,
  ImageIcon,
  LandingHero,
  layoutFlow,
  LiquidGlass,
  List,
  ListRow,
  LockIcon,
  MacWindow,
  MoonIcon,
  NavBar,
  NavigationBar,
  PhoneFrame,
  PlayIcon,
  PlugIcon,
  PlusIcon,
  PricingPage,
  SearchField,
  Select,
  SendIcon,
  SettingsIcon,
  SignalIcon,
  Slider,
  SparkleIcon,
  SunIcon,
  Switch,
  ThemeToggle,
  Toolbar,
  VideoIcon,
  VolumeIcon,
  WaitlistPage,
  WebhookIcon,
  WifiIcon,
  WorkflowIcon,
  type FlowEdgeData,
  type FlowNodeData,
  type MenuItem,
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
          <Button variant="accent" pill>
            Download
          </Button>
        </>
      }
      eyebrow="Liquid glass, natively"
      title="Build interfaces that bend light"
      subtitle="A React component library with true refraction, chromatic dispersion, and first-class light & dark themes."
      primaryAction={
        <Button size="lg" variant="accent" pill rightIcon={<ArrowUpRightIcon />}>
          Get started
        </Button>
      }
      secondaryAction={
        <Button size="lg" pill leftIcon={<PlayIcon />}>
          Watch demo
        </Button>
      }
    />
  )
}

export function WaitlistScene() {
  return (
    <WaitlistPage
      badge={
        <LiquidGlass pill style={{ padding: '6px 14px', fontSize: 13 }}>
          ✦ Waitlist
        </LiquidGlass>
      }
      title="Coming soon!"
      subtitle="Sign up for our newsletter to receive the latest updates and insights straight to your inbox."
      placeholder="Enter email"
      ctaLabel="Join waitlist"
      watermark="Waitlist"
      socials={
        <>
          <IconButton aria-label="X">
            <HashIcon />
          </IconButton>
          <IconButton aria-label="Chat">
            <ChatIcon />
          </IconButton>
          <IconButton aria-label="Photos">
            <ImageIcon />
          </IconButton>
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
      navActions={
        <Button variant="accent" pill>
          Download
        </Button>
      }
      title="Pricing"
      subtitle="Start free. Upgrade when you grow."
      billing={{ yearly, onChange: setYearly, label: 'Yearly' }}
      tiers={[
        {
          name: 'Free',
          price: '$0',
          description: 'For creators taking their first steps.',
          features: [
            'Up to 3 projects',
            'Export up to 1080p',
            'Basic editing tools',
            { text: 'Team collaboration', included: false },
          ],
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
          features: [
            'Unlimited projects',
            'Export 8K + animations',
            'AI content tools',
            'Custom branding',
          ],
          ctaLabel: 'Choose plan',
        },
      ]}
    />
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
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
          <NavBar
            brand={<>✦ Syntrix</>}
            links={[{ label: 'Dashboard', active: true }, { label: 'Settings' }, { label: 'Help' }]}
          />
          <ThemeToggle />
        </>
      }
      sidebar={
        <>
          <div style={{ fontWeight: 700, fontSize: 18, padding: '4px 8px 12px' }}>✦ Syntrix</div>
          <Button block leftIcon={<PlusIcon />} variant="accent">
            New chat
          </Button>
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
            <Button block size="sm" variant="accent">
              Upgrade now
            </Button>
          </Card>
        </>
      }
    >
      <div className="dash-welcome">
        <GlassIcon size={72} tint="accent">
          <SparkleIcon />
        </GlassIcon>
        <h1>Welcome back</h1>
        <p>Bring your ideas to life today</p>
      </div>
      <CommandBar
        placeholder="Ask me anything…"
        leading={
          <IconButton aria-label="Add" size="sm">
            <PlusIcon />
          </IconButton>
        }
        trailing={
          <IconButton aria-label="Send" size="sm" variant="accent">
            <SendIcon />
          </IconButton>
        }
        footer={
          <>
            <Button size="sm" variant="ghost" leftIcon={<SparkleIcon />}>
              Tools
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<GlobeIcon />}>
              Deep think
            </Button>
          </>
        }
      />
      <div style={{ display: 'flex', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
        <FeatureCard
          icon={<ImageIcon />}
          title="Image Generator"
          desc="Turn ideas into stunning visuals."
        />
        <FeatureCard
          icon={<VideoIcon />}
          title="Video Generator"
          desc="Create cinematic videos from prompts."
        />
        <FeatureCard
          icon={<CodeIcon />}
          title="Dev Assistant"
          desc="Accelerate development with AI."
        />
      </div>
    </DashboardShell>
  )
}

/* ============================================================================
   iOS 26 — Settings (grouped list inside an iPhone frame)
   ========================================================================== */
export function SettingsScene() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [airplane, setAirplane] = useState(false)
  const [wifi, setWifi] = useState(true)

  return (
    <div className="scene-ios">
      <PhoneFrame contentRef={scrollRef}>
        <NavigationBar
          title="Settings"
          scrollTarget={scrollRef}
          collapseAt={6}
          style={{ paddingTop: 44, position: 'sticky', top: 0, zIndex: 5 }}
          search={<SearchField placeholder="Search" />}
        />
        <div className="ios-settings">
          <List>
            <ListRow
              className="ios-profile"
              leading={<Avatar name="Hamid Zargham" size={58} />}
              title="Hamidreza Zargham"
              subtitle="Apple Account, iCloud, and more"
              onClick={() => {}}
            />
          </List>

          <List>
            <ListRow
              leading={<AirplaneIcon />}
              leadingFill="var(--lk-system-orange)"
              title="Airplane Mode"
              trailing={<Switch checked={airplane} onChange={setAirplane} />}
            />
            <ListRow
              leading={<WifiIcon />}
              leadingFill="var(--lk-system-blue)"
              title="Wi-Fi"
              detail={wifi ? 'Aurora' : 'Off'}
              onClick={() => setWifi((v) => !v)}
            />
            <ListRow
              leading={<BluetoothIcon />}
              leadingFill="var(--lk-system-blue)"
              title="Bluetooth"
              detail="On"
              onClick={() => {}}
            />
            <ListRow
              leading={<SignalIcon />}
              leadingFill="var(--lk-system-green)"
              title="Cellular"
              onClick={() => {}}
            />
          </List>

          <List>
            <ListRow
              leading={<BellIcon />}
              leadingFill="var(--lk-system-red)"
              title="Notifications"
              onClick={() => {}}
            />
            <ListRow
              leading={<VolumeIcon />}
              leadingFill="var(--lk-system-pink)"
              title="Sounds & Haptics"
              onClick={() => {}}
            />
            <ListRow
              leading={<MoonIcon />}
              leadingFill="var(--lk-system-indigo)"
              title="Focus"
              onClick={() => {}}
            />
            <ListRow
              leading={<ClockIcon />}
              leadingFill="var(--lk-system-indigo)"
              title="Screen Time"
              onClick={() => {}}
            />
          </List>

          <List>
            <ListRow
              leading={<SettingsIcon />}
              leadingFill="var(--lk-system-gray)"
              title="General"
              onClick={() => {}}
            />
            <ListRow
              leading={<GridIcon />}
              leadingFill="var(--lk-system-blue)"
              title="Control Center"
              onClick={() => {}}
            />
            <ListRow
              leading={<SunIcon />}
              leadingFill="var(--lk-system-blue)"
              title="Display & Brightness"
              onClick={() => {}}
            />
            <ListRow
              leading={<ImageIcon />}
              leadingFill="var(--lk-system-teal)"
              title="Wallpaper"
              onClick={() => {}}
            />
          </List>
        </div>
      </PhoneFrame>
    </div>
  )
}

/* ============================================================================
   iOS 26 — Control Center (glass modules over a wallpaper)
   ========================================================================== */
const PrevGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 6.5v11L9.5 12zM8 6h-2v12h2z" />
  </svg>
)
const PlayGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
)
const NextGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 6.5v11L14.5 12zM16 6h2v12h-2z" />
  </svg>
)

function CCToggle({
  icon,
  on,
  color,
  label,
  onClick,
}: {
  icon: React.ReactNode
  on: boolean
  color: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cx('cc-toggle', on && 'is-on')}
      style={on ? { background: color, borderColor: color } : undefined}
      aria-pressed={on}
      aria-label={label}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}

export function ControlCenterScene() {
  const [air, setAir] = useState(false)
  const [cell, setCell] = useState(true)
  const [wifi, setWifi] = useState(true)
  const [bt, setBt] = useState(true)

  return (
    <div className="scene-ios scene-ios--cc">
      <PhoneFrame statusBar="light" scroll={false} background={<div className="cc-wallpaper" />}>
        <div className="cc">
          <div className="cc-grid">
            <LiquidGlass radius={30} elevation={2} tint="dark" className="cc-conn">
              <div className="cc-conn__grid">
                <CCToggle
                  icon={<AirplaneIcon size={22} />}
                  on={air}
                  color="var(--lk-system-orange)"
                  label="Airplane Mode"
                  onClick={() => setAir((v) => !v)}
                />
                <CCToggle
                  icon={<SignalIcon size={22} />}
                  on={cell}
                  color="var(--lk-system-green)"
                  label="Cellular"
                  onClick={() => setCell((v) => !v)}
                />
                <CCToggle
                  icon={<WifiIcon size={22} />}
                  on={wifi}
                  color="var(--lk-system-blue)"
                  label="Wi-Fi"
                  onClick={() => setWifi((v) => !v)}
                />
                <CCToggle
                  icon={<BluetoothIcon size={22} />}
                  on={bt}
                  color="var(--lk-system-blue)"
                  label="Bluetooth"
                  onClick={() => setBt((v) => !v)}
                />
              </div>
            </LiquidGlass>

            <LiquidGlass radius={26} elevation={2} tint="dark" className="cc-bright">
              <span className="cc-vslider__fill" style={{ height: '76%' }} />
              <span className="cc-vslider__icon">
                <SunIcon size={22} />
              </span>
            </LiquidGlass>
            <LiquidGlass radius={26} elevation={2} tint="dark" className="cc-vol">
              <span className="cc-vslider__fill" style={{ height: '54%' }} />
              <span className="cc-vslider__icon">
                <VolumeIcon size={22} />
              </span>
            </LiquidGlass>

            <LiquidGlass radius={26} elevation={2} tint="dark" className="cc-music">
              <span className="cc-music__art" aria-hidden="true" />
              <span className="cc-music__meta">
                <span className="cc-music__title">Liquid Dreams</span>
                <span className="cc-music__artist">Aurora Waves</span>
              </span>
              <span className="cc-music__controls">
                <button type="button" className="cc-music__btn" aria-label="Previous">
                  <PrevGlyph />
                </button>
                <button type="button" className="cc-music__btn" aria-label="Play">
                  <PlayGlyph />
                </button>
                <button type="button" className="cc-music__btn" aria-label="Next">
                  <NextGlyph />
                </button>
              </span>
            </LiquidGlass>

            <LiquidGlass
              as="button"
              radius={999}
              elevation={2}
              tint="dark"
              interactive
              className="cc-round cc-t1"
              aria-label="Flashlight"
            >
              <FlashlightIcon size={24} />
            </LiquidGlass>
            <LiquidGlass
              as="button"
              radius={999}
              elevation={2}
              tint="dark"
              interactive
              className="cc-round cc-t2"
              aria-label="Focus"
            >
              <MoonIcon size={24} />
            </LiquidGlass>
            <LiquidGlass
              as="button"
              radius={999}
              elevation={2}
              tint="dark"
              interactive
              className="cc-round cc-t3"
              aria-label="Timer"
            >
              <ClockIcon size={24} />
            </LiquidGlass>
            <LiquidGlass
              as="button"
              radius={999}
              elevation={2}
              tint="dark"
              interactive
              className="cc-round cc-t4"
              aria-label="Camera"
            >
              <CameraIcon size={24} />
            </LiquidGlass>
          </div>
        </div>
      </PhoneFrame>
    </div>
  )
}

/* ============================================================================
   iOS 26 — Lock Screen (clock + glass notifications over a wallpaper)
   ========================================================================== */
function LockNotif({
  icon,
  appColor,
  title,
  time,
  body,
}: {
  icon: React.ReactNode
  appColor: string
  title: string
  time: string
  body: string
}) {
  return (
    <LiquidGlass radius={22} elevation={1} tint="dark" className="lock-notif">
      <span className="lock-notif__icon" style={{ background: appColor }}>
        {icon}
      </span>
      <span className="lock-notif__main">
        <span className="lock-notif__top">
          <span className="lock-notif__title">{title}</span>
          <span className="lock-notif__time">{time}</span>
        </span>
        <span className="lock-notif__body">{body}</span>
      </span>
    </LiquidGlass>
  )
}

export function LockScreenScene() {
  return (
    <div className="scene-ios scene-ios--lock">
      <PhoneFrame statusBar="light" scroll={false} background={<div className="lock-wallpaper" />}>
        <div className="lock">
          <div className="lock__head">
            <span className="lock__lock">
              <LockIcon size={15} />
            </span>
            <span className="lock__date">Friday, June 27</span>
            <span className="lock__time">9:41</span>
          </div>

          <div className="lock__notifs">
            <LockNotif
              icon={<ChatIcon size={18} />}
              appColor="var(--lk-system-green)"
              title="Aurora"
              time="now"
              body="See you at the studio in 10 minutes!"
            />
            <LockNotif
              icon={<ClockIcon size={18} />}
              appColor="var(--lk-system-red)"
              title="Calendar · Design Review"
              time="9:30"
              body="Liquid Glass components walkthrough"
            />
          </div>

          <div className="lock__actions">
            <LiquidGlass
              as="button"
              radius={999}
              elevation={2}
              tint="dark"
              interactive
              className="lock__action"
              aria-label="Flashlight"
            >
              <FlashlightIcon size={22} />
            </LiquidGlass>
            <LiquidGlass
              as="button"
              radius={999}
              elevation={2}
              tint="dark"
              interactive
              className="lock__action"
              aria-label="Camera"
            >
              <CameraIcon size={22} />
            </LiquidGlass>
          </div>
        </div>
      </PhoneFrame>
    </div>
  )
}

/* ============================================================================
   macOS 26 — System Settings window (source list + grouped panes)
   ========================================================================== */
function MacNavRow({
  id,
  icon,
  label,
  fill,
  active,
  onSelect,
}: {
  id: string
  icon: React.ReactNode
  label: string
  fill: string
  active: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      className={cx('mac-nav', active && 'is-active')}
      onClick={() => onSelect(id)}
    >
      <span className="mac-nav__icon" style={{ background: fill }}>
        {icon}
      </span>
      <span className="mac-nav__label">{label}</span>
    </button>
  )
}

export function MacScene() {
  const [section, setSection] = useState('sound')
  const [volume, setVolume] = useState(72)
  const [balance, setBalance] = useState(50)
  const [mute, setMute] = useState(false)

  return (
    <div className="scene-mac">
      <MacWindow
        title="Sound"
        width={960}
        height={620}
        sidebarWidth={230}
        sidebar={
          <div className="mac-source">
            <div className="mac-source__search">
              <SearchField placeholder="Search" />
            </div>
            <MacNavRow
              id="general"
              icon={<SettingsIcon size={15} />}
              label="General"
              fill="var(--lk-system-gray)"
              active={section === 'general'}
              onSelect={setSection}
            />
            <MacNavRow
              id="appearance"
              icon={<SparkleIcon size={15} />}
              label="Appearance"
              fill="var(--lk-system-indigo)"
              active={section === 'appearance'}
              onSelect={setSection}
            />
            <MacNavRow
              id="wifi"
              icon={<WifiIcon size={15} />}
              label="Wi-Fi"
              fill="var(--lk-system-blue)"
              active={section === 'wifi'}
              onSelect={setSection}
            />
            <MacNavRow
              id="bluetooth"
              icon={<BluetoothIcon size={15} />}
              label="Bluetooth"
              fill="var(--lk-system-blue)"
              active={section === 'bluetooth'}
              onSelect={setSection}
            />
            <div className="mac-source__title">Hardware</div>
            <MacNavRow
              id="sound"
              icon={<VolumeIcon size={15} />}
              label="Sound"
              fill="var(--lk-system-pink)"
              active={section === 'sound'}
              onSelect={setSection}
            />
            <MacNavRow
              id="displays"
              icon={<SunIcon size={15} />}
              label="Displays"
              fill="var(--lk-system-blue)"
              active={section === 'displays'}
              onSelect={setSection}
            />
            <MacNavRow
              id="camera"
              icon={<CameraIcon size={15} />}
              label="Camera"
              fill="var(--lk-system-gray)"
              active={section === 'camera'}
              onSelect={setSection}
            />
          </div>
        }
      >
        <div className="mac-pane">
          <h2 className="mac-pane__title">Sound</h2>

          <List header="Output">
            <ListRow
              title="Output volume"
              trailing={
                <span className="mac-slider">
                  <VolumeIcon size={16} style={{ opacity: 0.45 }} />
                  <Slider
                    value={volume}
                    onChange={setVolume}
                    aria-label="Output volume"
                    style={{ width: 200 }}
                  />
                </span>
              }
            />
            <ListRow
              title="Balance"
              trailing={
                <Slider
                  value={balance}
                  onChange={setBalance}
                  aria-label="Balance"
                  style={{ width: 200 }}
                />
              }
            />
            <ListRow title="Mute" trailing={<Switch checked={mute} onChange={setMute} />} />
          </List>

          <List header="Sound Effects">
            <ListRow
              title="Alert sound"
              trailing={
                <Select
                  defaultValue="boop"
                  options={[
                    { value: 'boop', label: 'Boop' },
                    { value: 'sonar', label: 'Sonar' },
                    { value: 'submarine', label: 'Submarine' },
                  ]}
                />
              }
            />
            <ListRow title="Play sound on startup" trailing={<Switch defaultChecked />} />
            <ListRow
              title="Play user-interface sound effects"
              trailing={<Switch defaultChecked />}
            />
          </List>
        </div>
      </MacWindow>
    </div>
  )
}

const workflowBaseNodes: FlowNodeData[] = [
  {
    id: 'trigger',
    x: 0,
    y: 0,
    variant: 'hub',
    title: 'Markus AI',
    subtitle: 'Core action',
    icon: <SparkleIcon />,
    accent: '#5b8cff',
    status: 'done',
  },
  {
    id: 'condition',
    x: 0,
    y: 0,
    title: 'Condition',
    subtitle: 'If new lead',
    icon: <GitBranchIcon />,
    badge: (
      <Badge size="sm" variant="accent">
        Logic
      </Badge>
    ),
    status: 'done',
  },
  {
    id: 'enrich',
    x: 0,
    y: 0,
    title: 'Enrich data',
    subtitle: 'Lookup contact',
    icon: <DatabaseIcon />,
  },
  { id: 'crm', x: 0, y: 0, title: 'Update CRM', subtitle: 'HubSpot', icon: <PlugIcon /> },
  {
    id: 'notify',
    x: 0,
    y: 0,
    title: 'Send message',
    subtitle: 'WhatsApp',
    icon: <SendIcon />,
    accent: '#37d0d6',
    status: 'running',
  },
]

const workflowEdges: FlowEdgeData[] = [
  { id: 'e1', source: 'trigger', target: 'condition', label: 'On event', animated: true },
  { id: 'e2', source: 'trigger', target: 'enrich' },
  { id: 'e3', source: 'condition', target: 'crm', label: 'Match' },
  { id: 'e4', source: 'enrich', target: 'notify' },
  { id: 'e5', source: 'crm', target: 'notify' },
]

const workflowMenu = (): MenuItem[] => [
  { id: 'data', label: 'Example data', shortcut: '⌘D' },
  { id: 'copy', label: 'Copy link', icon: <CodeIcon />, shortcut: '⌘C' },
  { id: 'branch', label: 'Create new branch', shortcut: '⌘B' },
  { id: 'custom', label: 'Custom code', icon: <CodeIcon />, shortcut: '⌘K' },
  { divider: true },
  { id: 'hide', label: 'Hide' },
  { id: 'remove', label: 'Remove', destructive: true, shortcut: '⌫' },
]

const workflowApps = [
  { id: 'web', icon: <GlobeIcon />, label: 'Webhook trigger' },
  { id: 'chat', icon: <ChatIcon />, label: 'Messaging' },
  { id: 'db', icon: <DatabaseIcon />, label: 'Database' },
  { id: 'plug', icon: <PlugIcon />, label: 'Integrations' },
  { id: 'hook', icon: <WebhookIcon />, label: 'Webhooks' },
  { id: 'ai', icon: <SparkleIcon />, label: 'AI' },
]

export function WorkflowScene() {
  const nodes = layoutFlow(workflowBaseNodes, workflowEdges, {
    direction: 'LR',
    layerGap: 150,
    nodeGap: 48,
    origin: { x: 120, y: 220 },
  })
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <FlowCanvas
        nodes={nodes}
        edges={workflowEdges}
        nodeContextMenu={workflowMenu}
        background="dots"
      >
        <FlowMinimap position="bottom-right" />
      </FlowCanvas>

      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <Toolbar
            items={[
              { id: 'grid', icon: <GridIcon />, label: 'Overview' },
              { id: 'flow', icon: <WorkflowIcon />, label: 'Workflow', active: true },
              { id: 'code', icon: <CodeIcon />, label: 'Code' },
            ]}
          />
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <Toolbar
            items={[
              { id: 'run', icon: <PlayIcon />, label: 'Run', primary: true },
              { id: 'settings', icon: <SettingsIcon />, label: 'Settings' },
            ]}
          />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
        <Dock orientation="horizontal" items={workflowApps} />
      </div>
    </div>
  )
}

export interface SceneMeta {
  slug: string
  name: string
  description: string
  Component: () => JSX.Element
}

export const scenes: SceneMeta[] = [
  {
    slug: 'landing',
    name: 'Landing Hero',
    description:
      'A full landing hero with nav, eyebrow, headline and dual CTAs over a refractive background.',
    Component: LandingScene,
  },
  {
    slug: 'waitlist',
    name: 'Waitlist Page',
    description:
      'A centered waitlist capture with a glass card, email field, socials and a watermark.',
    Component: WaitlistScene,
  },
  {
    slug: 'pricing',
    name: 'Pricing Page',
    description:
      'A three-tier pricing layout with a billing toggle and a highlighted popular plan.',
    Component: PricingScene,
  },
  {
    slug: 'dashboard',
    name: 'Dashboard Shell',
    description: 'An app shell with a glass sidebar, top nav, command bar and feature cards.',
    Component: DashboardScene,
  },
  {
    slug: 'ios-settings',
    name: 'iOS Settings',
    description:
      'A grouped iOS 26 Settings screen — large-title nav, search and inset lists — inside an iPhone frame.',
    Component: SettingsScene,
  },
  {
    slug: 'control-center',
    name: 'iOS Control Center',
    description:
      'Liquid Glass Control Center modules — connectivity, media, brightness and volume — over a wallpaper.',
    Component: ControlCenterScene,
  },
  {
    slug: 'lock-screen',
    name: 'iOS Lock Screen',
    description:
      'An iOS 26 Lock Screen with the big clock, glass notifications and flashlight / camera actions.',
    Component: LockScreenScene,
  },
  {
    slug: 'mac-settings',
    name: 'macOS Settings',
    description:
      'A macOS 26 System Settings window — translucent chrome, source list and grouped panes with live controls.',
    Component: MacScene,
  },
  {
    slug: 'workflow',
    name: 'Workflow Designer',
    description:
      'An n8n-style visual workflow builder — glass nodes on a pannable, zoomable canvas joined by glowing connectors, with a top toolbar, node context menus, an integration dock, zoom controls and a minimap.',
    Component: WorkflowScene,
  },
]

export const sceneMap = Object.fromEntries(scenes.map((s) => [s.slug, s]))
