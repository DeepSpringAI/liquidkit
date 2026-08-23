import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Section,
  SectionBody,
  SectionFooter,
  SectionHeader,
  SectionToolbar,
} from '@hamidrezazargham/liquidkit'

describe('Section', () => {
  it('lays out a header, one scrolling body and a docked footer', () => {
    const { container } = render(
      <Section>
        <SectionHeader title="Files" subtitle="Shared with everyone" eyebrow="Storage" />
        <SectionBody>rows</SectionBody>
        <SectionFooter>composer</SectionFooter>
      </Section>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Files' })).toBeInTheDocument()
    expect(screen.getByText('Shared with everyone')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(container.querySelector('.lk-section__body')).not.toHaveClass('lk-section__body--clip')
    expect(screen.getByText('composer')).toBeInTheDocument()
  })

  it('clips instead of scrolling when the section owns its own scroller', () => {
    const { container } = render(
      <Section>
        <SectionBody scroll={false}>transcript</SectionBody>
      </Section>,
    )
    expect(container.querySelector('.lk-section__body')).toHaveClass('lk-section__body--clip')
  })

  it('lets a header replace its title outright — a wordmark is still a header', () => {
    render(
      <Section>
        <SectionHeader title="ignored">
          <svg aria-label="TheMachine" />
        </SectionHeader>
      </Section>,
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByLabelText('TheMachine')).toBeInTheDocument()
  })

  it('says where you are without announcing it as a heading', () => {
    const { container } = render(
      <Section>
        <SectionToolbar leading={<button>Back</button>} actions={<button>More</button>}>
          Files / Contracts
        </SectionToolbar>
        <SectionBody>rows</SectionBody>
      </Section>,
    )

    // The location is text, not an <h1>: the folder already names itself.
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(container.querySelector('.lk-section__where')).toHaveTextContent('Files / Contracts')
    expect(container.querySelector('.lk-section__leading')).toHaveTextContent('Back')
    expect(container.querySelector('.lk-section__actions')).toHaveTextContent('More')
  })

  it('keeps the actions at the trailing edge with no location between them', () => {
    const { container } = render(
      <Section>
        <SectionToolbar actions={<button>More</button>} />
      </Section>,
    )
    expect(container.querySelector('.lk-section__where')).toBeNull()
    expect(container.querySelector('.lk-section__actions')).toBeInTheDocument()
  })
})
