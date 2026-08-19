import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { ProfileHeader } from './ProfileHeader'
import { PROJECTS } from '@/lib/projects'

describe('ProfileHeader', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the handle as the page heading', () => {
    render(<ProfileHeader />)
    expect(screen.getByRole('heading', { level: 1, name: "Jake's Tools" })).toBeInTheDocument()
  })

  it('counts tools and tags from the manifest, and shows the ideas tally', () => {
    render(<ProfileHeader />)
    const expected = {
      tools: String(PROJECTS.length),
      tags: String(new Set(PROJECTS.flatMap((project) => project.tags ?? [])).size),
      ideas: '2,319',
    }

    // Scoped per stat, since two counts can legitimately hold the same value.
    for (const [label, value] of Object.entries(expected)) {
      const term = screen.getByText(label)
      expect(term.parentElement).toHaveTextContent(value)
    }
  })

  it('renders the bio as a typewriter', () => {
    render(<ProfileHeader />)
    expect(screen.getByText('|')).toBeInTheDocument()
  })

  it('renders a highlight for each link plus the appearance toggle', () => {
    render(<ProfileHeader />)
    for (const label of ['Threads', 'LinkedIn', 'GitHub', 'Blog']) {
      expect(screen.getByRole('button', { name: `Open ${label}` })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: 'Toggle dark mode' })).toBeInTheDocument()
  })

  it('labels the appearance highlight with the theme it switches to', () => {
    const { unmount } = render(<ProfileHeader isDarkMode={false} />)
    expect(screen.getByText('Dark')).toBeInTheDocument()
    unmount()

    render(<ProfileHeader isDarkMode />)
    expect(screen.getByText('Light')).toBeInTheDocument()
  })

  it('calls onToggleDarkMode when the appearance highlight is clicked', () => {
    const onToggleDarkMode = vi.fn()
    render(<ProfileHeader onToggleDarkMode={onToggleDarkMode} />)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle dark mode' }))
    expect(onToggleDarkMode).toHaveBeenCalledTimes(1)
  })
})
