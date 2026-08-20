import { describe, expect, it, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { App } from './App'

/**
 * The page has to open in whatever the system is set to.
 *
 * It did, right up until the toggle was touched once: every click wrote a stored choice,
 * a stored choice always won, and nothing ever cleared it. So a single click was a
 * permanent decision and there was no way back to following the system.
 */
const THEME_KEY = 'portfolio.theme'

const systemPrefers = (scheme: 'dark' | 'light') => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('dark') ? scheme === 'dark' : scheme === 'light',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}

const rendered = () => document.documentElement.dataset.theme

describe('theme on first load', () => {
  beforeEach(() => {
    window.localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('follows a dark system when nothing is stored', () => {
    systemPrefers('dark')
    render(<App />)
    expect(rendered()).toBe('dark')
  })

  it('follows a light system when nothing is stored', () => {
    systemPrefers('light')
    render(<App />)
    expect(rendered()).toBe('light')
  })

  it('keeps an explicit choice that disagrees with the system', () => {
    systemPrefers('dark')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle dark mode' }))
    expect(rendered()).toBe('light')
    expect(window.localStorage.getItem(THEME_KEY)).toBe('light')
  })

  it('goes back to following the system when the choice agrees with it again', () => {
    systemPrefers('dark')
    render(<App />)
    const toggle = screen.getByRole('button', { name: 'Toggle dark mode' })

    fireEvent.click(toggle) // away from the system: an override worth storing
    expect(window.localStorage.getItem(THEME_KEY)).toBe('light')

    fireEvent.click(toggle) // back to what the system already says: no opinion to store
    expect(rendered()).toBe('dark')
    expect(window.localStorage.getItem(THEME_KEY)).toBeNull()
  })
})
