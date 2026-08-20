import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { render } from '@/test/test-utils'
import { PROJECTS } from '@/lib/projects'
import { GridView } from './GridView'
import { ListView } from './ListView'
import { Card } from './Card'

/**
 * Every view must let a click anywhere on an entry open the app.
 *
 * This was reported as a bug, and the cause was never a missing link: it was another
 * element sitting on top of one. The list's cover was painted above the row's stretched
 * link and swallowed every click that landed on it, and a card had links only on its title
 * and its image, so the whole caption below was dead.
 *
 * Hit testing needs real layout, which jsdom does not do. What it can check is the
 * contract that makes the hit testing come out right: the entry carries a link to the app,
 * and anything drawn over that link is transparent to the pointer while the controls
 * inside it are not.
 */
const project = PROJECTS.find((p) => !p.disabled)!
const deployed = new Map()

const transparent = (el: Element | null) =>
  el ? getComputedStyle(el).pointerEvents === 'none' : false

describe('clicking an entry opens the app', () => {
  it('gives every list row a link to its app', () => {
    render(<ListView projects={PROJECTS.filter((p) => !p.disabled)} deployed={deployed} />)
    for (const p of PROJECTS.filter((p) => !p.disabled)) {
      expect(screen.getByRole('link', { name: p.title })).toHaveAttribute('href', p.path)
    }
  })

  it("does not let a list row's cover take the click", () => {
    const { container } = render(<ListView projects={[project]} deployed={deployed} />)
    // The cover is painted above the stretched link, so it has to pass the pointer through.
    expect(transparent(container.querySelector('img'))).toBe(true)
  })

  it('stretches a link across the whole card, under its controls', () => {
    const { container } = render(
      <Card
        title={project.title}
        type={project.type}
        imageSrc={project.imageSrc}
        description={project.description}
        tags={project.tags ?? []}
        href={project.path}
        date={project.creationDate}
      />,
    )
    const links = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(links).toContain(project.path)

    // The caption is drawn over that link: its text must fall through, its buttons must not.
    const caption = container.querySelector('p')?.closest('div')
    expect(caption && getComputedStyle(caption).pointerEvents).not.toBe('auto')

    const tag = within(container as HTMLElement).getAllByRole('button', { name: /Filter by/ })[0]
    expect(getComputedStyle(tag!).pointerEvents).toBe('auto')
  })

  it('gives every grid tile a link to its app', () => {
    render(<GridView projects={PROJECTS.filter((p) => !p.disabled)} deployed={deployed} />)
    for (const p of PROJECTS.filter((p) => !p.disabled)) {
      expect(screen.getByRole('link', { name: p.title })).toHaveAttribute('href', p.path)
    }
  })

  it('opens the app in a new tab from every view', () => {
    render(<GridView projects={[project]} deployed={deployed} />)
    const link = screen.getByRole('link', { name: project.title })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })
})
