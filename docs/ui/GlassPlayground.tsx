import { useCallback, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { LiquidGlass, Slider, Select, Switch, Button, cx } from '@hamidrezazargham/liquidkit'
import type { GlassMaterial, GlassTint } from '@hamidrezazargham/liquidkit'
import { CodeBlock } from './CodeBlock'

/* ============================================================================
   Live playground for the glass surface.

   A busy, high-frequency backdrop sits behind a panel you can drag around it,
   with every knob that shapes the frost on a slider. Nothing here is library
   code — it's a docs harness over the public props.
   ========================================================================== */

type BackdropKind = 'grid' | 'spectrum' | 'type' | 'rings'

interface GlassSettings {
  blur: number
  radius: number
  pill: boolean
  width: number
  height: number
  material: GlassMaterial | 'none'
  tint: GlassTint
  elevation: 0 | 1 | 2 | 3
  sheen: boolean
  backdrop: BackdropKind
}

const DEFAULTS: GlassSettings = {
  blur: 10,
  radius: 28,
  pill: false,
  width: 380,
  height: 240,
  material: 'none',
  tint: 'auto',
  elevation: 2,
  sheen: true,
  backdrop: 'grid',
}

/** Presets that jump straight to a recognisable point in the parameter space. */
const PRESETS: { label: string; patch: Partial<GlassSettings> }[] = [
  { label: 'Library defaults', patch: { blur: 8, material: 'none', tint: 'auto', elevation: 2 } },
  { label: 'Barely there', patch: { blur: 3, material: 'clear', tint: 'clear', elevation: 1 } },
  { label: 'Heavy frost', patch: { blur: 28, material: 'thick', tint: 'auto', elevation: 3 } },
  { label: 'Accent panel', patch: { blur: 14, material: 'regular', tint: 'accent', elevation: 2 } },
  { label: 'Flat pane', patch: { blur: 16, material: 'thin', tint: 'auto', elevation: 0 } },
]

const BACKDROPS: { value: BackdropKind; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'spectrum', label: 'Spectrum' },
  { value: 'type', label: 'Type' },
  { value: 'rings', label: 'Rings' },
]

const MATERIALS = ['none', 'clear', 'ultraThin', 'thin', 'regular', 'thick'] as const
const TINTS: GlassTint[] = ['auto', 'clear', 'light', 'dark', 'accent']

function Knob({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  hint,
  disabled,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  hint?: string
  disabled?: boolean
  onChange: (v: number) => void
}) {
  return (
    <div className={cx('doc-pg-knob', disabled && 'is-disabled')}>
      <div className="doc-pg-knob__head">
        <label htmlFor={`pg-${label}`}>{label}</label>
        <output>
          {value}
          {unit}
        </output>
      </div>
      <Slider
        id={`pg-${label}`}
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
      {hint && <p className="doc-pg-knob__hint">{hint}</p>}
    </div>
  )
}

/** The busy backdrop the glass frosts. Pure CSS, driven by `data-backdrop`. */
function Backdrop({ kind }: { kind: BackdropKind }) {
  return (
    <div className="doc-pg-backdrop" data-backdrop={kind} aria-hidden="true">
      {kind === 'type' && (
        <div className="doc-pg-backdrop__type">
          {Array.from({ length: 9 }, (_, i) => (
            <p key={i}>FROST · MATERIAL · LIQUID GLASS · {i + 1}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function codeFor(s: GlassSettings): string {
  const lines = [
    `blur={${s.blur}}`,
    s.pill ? 'pill' : `radius={${s.radius}}`,
    s.material !== 'none' ? `material="${s.material}"` : null,
    s.tint !== 'auto' ? `tint="${s.tint}"` : null,
    s.elevation !== 2 ? `elevation={${s.elevation}}` : null,
    s.sheen ? null : 'sheen={false}',
  ].filter(Boolean) as string[]

  return `<LiquidGlass\n  ${lines.join('\n  ')}\n  style={{ width: ${s.width}, height: ${s.height} }}\n>\n  Liquid Glass\n</LiquidGlass>`
}

export function GlassPlayground() {
  const [s, setS] = useState<GlassSettings>(DEFAULTS)
  const set = useCallback(
    <K extends keyof GlassSettings>(key: K, value: GlassSettings[K]) =>
      setS((prev) => ({ ...prev, [key]: value })),
    [],
  )

  // Panel position, as a fraction of the stage box, so it survives resizes.
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 })
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ dx: number; dy: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    const stage = stageRef.current
    if (!stage) return
    const box = stage.getBoundingClientRect()
    dragRef.current = {
      dx: e.clientX - (box.left + pos.x * box.width),
      dy: e.clientY - (box.top + pos.y * box.height),
    }
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const stage = stageRef.current
    const d = dragRef.current
    if (!stage || !d) return
    const box = stage.getBoundingClientRect()
    if (!box.width || !box.height) return
    const clamp = (n: number) => Math.min(1, Math.max(0, n))
    setPos({
      x: clamp((e.clientX - d.dx - box.left) / box.width),
      y: clamp((e.clientY - d.dy - box.top) / box.height),
    })
  }

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    dragRef.current = null
    setDragging(false)
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const code = useMemo(() => codeFor(s), [s])

  return (
    <div className="doc-pg">
      <div className="doc-pg-stage" ref={stageRef}>
        <Backdrop kind={s.backdrop} />
        <LiquidGlass
          className={cx('doc-pg-panel', dragging && 'is-dragging')}
          radius={s.radius}
          pill={s.pill}
          blur={s.blur}
          material={s.material === 'none' ? undefined : s.material}
          tint={s.tint}
          elevation={s.elevation}
          sheen={s.sheen}
          style={{
            width: s.width,
            height: s.height,
            left: `${pos.x * 100}%`,
            top: `${pos.y * 100}%`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className="doc-pg-panel__body">
            <strong>Drag me</strong>
            <span>
              blur {s.blur} · {s.material === 'none' ? 'no material' : s.material} · {s.tint}
            </span>
          </div>
        </LiquidGlass>
      </div>

      <div className="doc-pg-controls">
        <div className="doc-pg-presets">
          {PRESETS.map((p) => (
            <Button
              key={p.label}
              size="sm"
              pill
              onClick={() => setS((prev) => ({ ...prev, ...p.patch }))}
            >
              {p.label}
            </Button>
          ))}
          <Button
            size="sm"
            pill
            variant="ghost"
            onClick={() => {
              setS(DEFAULTS)
              setPos({ x: 0.5, y: 0.5 })
            }}
          >
            Reset
          </Button>
        </div>

        <div className="doc-pg-grid">
          <Knob
            label="Blur"
            value={s.blur}
            min={0}
            max={40}
            hint="Frost radius. 0 shows the backdrop untouched; material overrides this unless you set it."
            onChange={(v) => set('blur', v)}
          />
          <Knob
            label="Radius"
            value={s.radius}
            min={0}
            max={120}
            disabled={s.pill}
            hint={s.pill ? 'Overridden by pill.' : 'Corner radius of the surface.'}
            onChange={(v) => set('radius', v)}
          />
          <Knob
            label="Width"
            value={s.width}
            min={120}
            max={560}
            onChange={(v) => set('width', v)}
          />
          <Knob
            label="Height"
            value={s.height}
            min={80}
            max={340}
            onChange={(v) => set('height', v)}
          />
        </div>

        <div className="doc-pg-row">
          <div className="doc-pg-field">
            <span className="doc-pg-field__label">Backdrop</span>
            <Select
              options={BACKDROPS.map((b) => ({ value: b.value, label: b.label }))}
              value={s.backdrop}
              onChange={(v) => set('backdrop', v as BackdropKind)}
            />
          </div>
          <div className="doc-pg-field">
            <span className="doc-pg-field__label">Material</span>
            <Select
              options={MATERIALS.map((m) => ({ value: m, label: m }))}
              value={s.material}
              onChange={(v) => set('material', v as GlassSettings['material'])}
            />
          </div>
          <div className="doc-pg-field">
            <span className="doc-pg-field__label">Tint</span>
            <Select
              options={TINTS.map((t) => ({ value: t, label: t }))}
              value={s.tint}
              onChange={(v) => set('tint', v as GlassTint)}
            />
          </div>
          <div className="doc-pg-field">
            <span className="doc-pg-field__label">Elevation</span>
            <Select
              options={['0', '1', '2', '3'].map((e) => ({ value: e, label: e }))}
              value={String(s.elevation)}
              onChange={(v) => set('elevation', Number(v) as GlassSettings['elevation'])}
            />
          </div>
        </div>

        <div className="doc-pg-row doc-pg-row--switches">
          <Switch checked={s.sheen} onChange={(v) => set('sheen', v)} label="Sheen" />
          <Switch checked={s.pill} onChange={(v) => set('pill', v)} label="Pill" />
        </div>
      </div>

      <CodeBlock code={code} />
    </div>
  )
}
