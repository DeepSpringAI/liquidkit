import {
  Badge,
  Avatar,
  AvatarGroup,
  Progress,
  Tooltip,
  ChartCard,
  StatTile,
  PricingCard,
  Button,
  IconButton,
  HeartIcon,
} from 'liquidkit'
import type { ComponentDoc } from '../types'

/* ----------------------------------------------------------------- Badge */

export const badgeDoc: ComponentDoc = {
  slug: 'badge',
  name: 'Badge',
  category: 'Data Display',
  summary: 'Small status pills in glass and semantic colors, with an optional leading dot.',
  importLine: "import { Badge } from 'liquidkit'",
  examples: [
    {
      title: 'Variants',
      demo: (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge dot variant="accent">Live</Badge>
          <Badge dot variant="success">Active</Badge>
          <Badge variant="warning">Beta</Badge>
          <Badge dot variant="danger">Down</Badge>
          <Badge variant="neutral">v0.2</Badge>
          <Badge variant="glass">Glass</Badge>
        </div>
      ),
      code: `<Badge dot variant="accent">Live</Badge>
<Badge dot variant="success">Active</Badge>
<Badge variant="warning">Beta</Badge>
<Badge dot variant="danger">Down</Badge>
<Badge variant="neutral">v0.2</Badge>`,
    },
  ],
  props: [
    { name: 'variant', type: "'glass' | 'neutral' | 'accent' | 'success' | 'warning' | 'danger'", default: "'glass'", description: 'Color.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Pill size.' },
    { name: 'dot', type: 'boolean', default: 'false', description: 'Leading status dot.' },
  ],
}

/* ---------------------------------------------------------------- Avatar */

export const avatarDoc: ComponentDoc = {
  slug: 'avatar',
  name: 'Avatar',
  category: 'Data Display',
  summary: 'A user image with initials fallback, status dot, glass ring — and an AvatarGroup for stacks.',
  importLine: "import { Avatar, AvatarGroup } from 'liquidkit'",
  examples: [
    {
      title: 'Single avatars',
      demo: (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Avatar name="Hamidreza Zargham" status="online" />
          <Avatar name="Ada Lovelace" status="busy" ring />
          <Avatar name="Grace Hopper" size={56} status="away" />
        </div>
      ),
      code: `<Avatar name="Hamidreza Zargham" status="online" />
<Avatar name="Ada Lovelace" status="busy" ring />
<Avatar name="Grace Hopper" size={56} status="away" />`,
    },
    {
      title: 'Avatar group',
      description: 'Stacks avatars and collapses the overflow into a +N chip.',
      demo: (
        <AvatarGroup max={3}>
          <Avatar name="Ada Byron" />
          <Avatar name="Carl Sagan" />
          <Avatar name="Edsger Dijkstra" />
          <Avatar name="Grace Hopper" />
          <Avatar name="Alan Turing" />
        </AvatarGroup>
      ),
      code: `<AvatarGroup max={3}>
  <Avatar name="Ada Byron" />
  <Avatar name="Carl Sagan" />
  <Avatar name="Edsger Dijkstra" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Alan Turing" />
</AvatarGroup>`,
    },
  ],
  props: [
    { name: 'src', type: 'string', description: 'Image URL.' },
    { name: 'name', type: 'string', description: 'Used for initials fallback when there is no image.' },
    { name: 'alt', type: 'string', description: 'Image alt text.' },
    { name: 'size', type: 'number', default: '44', description: 'Diameter in px.' },
    { name: 'status', type: "'online' | 'offline' | 'busy' | 'away'", description: 'Status dot.' },
    { name: 'ring', type: 'boolean', default: 'false', description: 'Glass ring around the avatar.' },
  ],
  extraProps: [
    {
      title: 'AvatarGroup',
      props: [
        { name: 'max', type: 'number', description: 'Max avatars to show before a +N chip.' },
        { name: 'size', type: 'number', default: '44', description: 'Diameter applied to the overflow chip.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Avatar elements.' },
      ],
    },
  ],
}

/* -------------------------------------------------------------- Progress */

export const progressDoc: ComponentDoc = {
  slug: 'progress',
  name: 'Progress',
  category: 'Data Display',
  summary: 'A bar or ring progress indicator with an optional chromatic glow.',
  importLine: "import { Progress } from 'liquidkit'",
  examples: [
    {
      title: 'Bar & ring',
      demo: (
        <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Progress value={72} aria-label="Loading" />
            <Progress value={40} glow aria-label="Loading with glow" />
          </div>
          <Progress variant="ring" value={60} showValue glow aria-label="Complete" />
        </div>
      ),
      code: `<Progress value={72} />
<Progress value={40} glow />
<Progress variant="ring" value={60} showValue glow />`,
    },
  ],
  props: [
    { name: 'value', type: 'number', required: true, description: 'Current value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'variant', type: "'bar' | 'ring'", default: "'bar'", description: 'Shape.' },
    { name: 'size', type: 'number', description: 'Bar height or ring diameter in px.' },
    { name: 'thickness', type: 'number', default: '8', description: 'Ring stroke thickness in px.' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Render the percentage (ring).' },
    { name: 'accent', type: 'string', description: 'Override the fill color.' },
    { name: 'glow', type: 'boolean', default: 'false', description: 'Chromatic glow.' },
  ],
}

/* --------------------------------------------------------------- Tooltip */

export const tooltipDoc: ComponentDoc = {
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'Data Display',
  summary: 'A frosted-glass tooltip shown on hover or focus. Wraps any single element.',
  importLine: "import { Tooltip } from 'liquidkit'",
  examples: [
    {
      title: 'Sides',
      description: 'Hover or focus the buttons.',
      demo: (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Tooltip content="Tooltip on top" side="top"><Button>Top</Button></Tooltip>
          <Tooltip content="Tooltip on bottom" side="bottom"><Button>Bottom</Button></Tooltip>
          <Tooltip content="Tooltip on the left" side="left"><Button>Left</Button></Tooltip>
          <Tooltip content="Tooltip on the right" side="right"><Button>Right</Button></Tooltip>
        </div>
      ),
      code: `<Tooltip content="Tooltip on top" side="top">
  <Button>Top</Button>
</Tooltip>`,
    },
  ],
  props: [
    { name: 'content', type: 'ReactNode', required: true, description: 'Tooltip body.' },
    { name: 'children', type: 'ReactElement', required: true, description: 'The trigger element.' },
    { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Placement.' },
  ],
}

/* ------------------------------------------------------------- ChartCard */

export const chartCardDoc: ComponentDoc = {
  slug: 'chart-card',
  name: 'ChartCard',
  category: 'Data Display',
  summary: 'A glass card with a smooth, glowing area line chart drawn from a number array.',
  importLine: "import { ChartCard } from 'liquidkit'",
  examples: [
    {
      title: 'Trend chart',
      demo: (
        <ChartCard
          title="Post views"
          value="2,670 views"
          data={[12, 18, 9, 22, 16, 28, 21, 34, 30, 42]}
          labels={['8am', '10am', '12pm', '2pm', '4pm', '6pm']}
          action={<IconButton aria-label="Like"><HeartIcon size={18} /></IconButton>}
          style={{ maxWidth: 420 }}
        />
      ),
      code: `<ChartCard
  title="Post views"
  value="2,670 views"
  data={[12, 18, 9, 22, 16, 28, 21, 34, 30, 42]}
  labels={['8am', '10am', '12pm', '2pm', '4pm', '6pm']}
  action={<IconButton aria-label="Like"><HeartIcon /></IconButton>}
/>`,
    },
  ],
  props: [
    { name: 'title', type: 'ReactNode', description: 'Small heading.' },
    { name: 'value', type: 'ReactNode', description: 'Large headline value.' },
    { name: 'data', type: 'number[]', required: true, description: 'Y values, drawn as a smooth glowing line.' },
    { name: 'labels', type: 'string[]', description: 'X-axis tick labels.' },
    { name: 'colors', type: '[string, string]', default: "['#ff9d4d', '#ff4d6d']", description: 'Line gradient [from, to].' },
    { name: 'action', type: 'ReactNode', description: 'Top-right slot.' },
    { name: 'area', type: 'boolean', default: 'true', description: 'Fill the area under the line.' },
    { name: 'height', type: 'number', default: '180', description: 'Chart height in px.' },
  ],
}

/* -------------------------------------------------------------- StatTile */

export const statTileDoc: ComponentDoc = {
  slug: 'stat-tile',
  name: 'StatTile',
  category: 'Data Display',
  summary: 'A square metric tile with a strong colored glow and a delta indicator.',
  importLine: "import { StatTile } from 'liquidkit'",
  examples: [
    {
      title: 'Metric tiles',
      demo: (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <StatTile label="AMZN" value="$1.8B vol" delta="2.4%" direction="up" glow accent="#3b82f6" size={170} />
          <StatTile label="GOOG" value="$2.9B vol" delta="1.1%" direction="down" glow accent="#a855f7" size={170} />
        </div>
      ),
      code: `<StatTile label="AMZN" value="$1.8B vol" delta="2.4%" direction="up" glow accent="#3b82f6" />
<StatTile label="GOOG" value="$2.9B vol" delta="1.1%" direction="down" glow accent="#a855f7" />`,
    },
  ],
  props: [
    { name: 'value', type: 'ReactNode', required: true, description: 'Headline value.' },
    { name: 'label', type: 'ReactNode', description: 'Caption.' },
    { name: 'delta', type: 'ReactNode', description: 'Change indicator text.' },
    { name: 'direction', type: "'up' | 'down'", default: "'up'", description: 'Delta direction / color.' },
    { name: 'glow', type: 'boolean', default: 'false', description: 'Strong colored glow.' },
    { name: 'accent', type: 'string', default: "'#3b82f6'", description: 'Glow / accent color.' },
    { name: 'size', type: 'number', default: '180', description: 'Square tile size in px.' },
  ],
}

/* ------------------------------------------------------------ PricingCard */

export const pricingCardDoc: ComponentDoc = {
  slug: 'pricing-card',
  name: 'PricingCard',
  category: 'Data Display',
  summary: 'A glass pricing tier with a feature list, optional “popular” highlight and a CTA.',
  importLine: "import { PricingCard } from 'liquidkit'",
  examples: [
    {
      title: 'Pricing tiers',
      demo: (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <PricingCard
            name="Starter"
            price="$0"
            period="/mo"
            features={['Up to 3 projects', 'Community support', '1 GB storage']}
            ctaLabel="Get started"
          />
          <PricingCard
            name="Pro"
            price="$19"
            period="/mo"
            popular
            badgeLabel="Popular"
            features={['Unlimited projects', 'Priority support', '100 GB storage', 'Custom themes']}
            ctaLabel="Upgrade"
          />
        </div>
      ),
      code: `<PricingCard
  name="Pro"
  price="$19"
  period="/mo"
  popular
  badgeLabel="Popular"
  features={['Unlimited projects', 'Priority support', '100 GB storage']}
  ctaLabel="Upgrade"
/>`,
    },
  ],
  props: [
    { name: 'name', type: 'ReactNode', required: true, description: 'Tier name.' },
    { name: 'price', type: 'ReactNode', required: true, description: 'Price.' },
    { name: 'period', type: 'ReactNode', description: 'e.g. "/mo".' },
    { name: 'description', type: 'ReactNode', description: 'Sub-line under the price.' },
    { name: 'features', type: 'Array<string | PricingFeature>', required: true, description: 'Feature list; { text, included? } to strike items.' },
    { name: 'ctaLabel', type: 'ReactNode', description: 'CTA button label.' },
    { name: 'onSelect', type: '() => void', description: 'CTA click handler.' },
    { name: 'popular', type: 'boolean', default: 'false', description: 'Highlight as the featured tier.' },
    { name: 'badgeLabel', type: 'ReactNode', description: 'Badge shown when popular.' },
  ],
}
