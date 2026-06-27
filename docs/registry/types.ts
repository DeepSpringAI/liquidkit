import type { ReactNode } from 'react'

export interface PropDef {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

export interface DocExample {
  title: string
  description?: string
  /** The live, rendered demo. */
  demo: ReactNode
  /** The copy-paste source that produces the demo. */
  code: string
  /** Place the demo on a textured backdrop so refraction is visible. @default true */
  stage?: boolean
  /** Stack the demo vertically with more room (forms, command bars). */
  wide?: boolean
}

export interface ComponentDoc {
  slug: string
  name: string
  category: string
  summary: string
  /** Import line shown at the top of the page. */
  importLine: string
  examples: DocExample[]
  props: PropDef[]
  /** Optional secondary prop tables (e.g. sub-components). */
  extraProps?: { title: string; props: PropDef[] }[]
}
