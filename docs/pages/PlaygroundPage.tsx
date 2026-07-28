import { GlassPlayground } from '../ui/GlassPlayground'

export function PlaygroundPage() {
  return (
    <article className="doc-page">
      <header className="doc-page__head">
        <h1>Playground</h1>
        <p className="doc-page__lead">
          Every glass surface frosts the live content behind it and layers a tint, a lit bevel and a
          specular sheen on top. Drag the panel across the backdrop and move the sliders to see what
          each knob does to the material.
        </p>
      </header>

      <GlassPlayground />

      <section className="doc-example">
        <h3 className="doc-example__title">How the surface is built</h3>
        <p className="doc-example__desc">
          The optical effect is a <code>backdrop-filter</code> of{' '}
          <code>blur() saturate() brightness()</code> applied to whatever sits behind the element.{' '}
          <code>blur</code> sets the frost radius directly; <code>material</code> sets it together
          with a matching tint opacity, so <code>clear</code> reads as a thin pane and{' '}
          <code>thick</code> as a dense one. On top of the frost sit three painted layers — the
          color <code>tint</code>, a border-only bevel gradient that catches light along the rim,
          and the <code>sheen</code> highlight riding the top and bottom edges.
        </p>
        <p className="doc-example__desc">
          Earlier versions also ran an SVG displacement filter to bend the backdrop like a real
          lens. That has been removed: it only worked in Chromium, cost a GPU pass per surface, and
          never looked convincing at the sizes real components are. The <code>refraction</code>,{' '}
          <code>dispersion</code>, <code>bezel</code> and <code>glass</code> props are still
          accepted so existing code keeps compiling, but they do nothing.
        </p>
      </section>
    </article>
  )
}
