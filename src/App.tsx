import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './styles/themes'
import { FooterBar } from '@/components/FooterBar'
import { Home } from '@/components/Home'

/** Every app shares one origin now, so storage keys are namespaced. */
const THEME_KEY = 'portfolio.theme'

/** Returns whether the user's OS preference is dark mode. */
const getPrefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

/** A stored choice wins over the OS preference; otherwise fall back to the OS. */
const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage.getItem(THEME_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return getPrefersDark()
}

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode)
  const theme = isDarkMode ? darkTheme : lightTheme

  // The stylesheet keys its ground off this, the same attribute every app uses.
  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      // Only follow the OS while the user has not made a choice of their own.
      if (window.localStorage.getItem(THEME_KEY) === null) setIsDarkMode(e.matches)
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  /**
   * Switches mode, and treats agreeing with the system as having no opinion.
   *
   * Storing a choice every time meant one click was permanent: the stored value always
   * won, the OS preference was never consulted again, and there was no way back to
   * following it. Turning the toggle to whatever the system already says clears the
   * override instead, so the page goes back to tracking it - including later, when the
   * system flips at sunset.
   */
  const toggleDarkMode = () =>
    setIsDarkMode((previous) => {
      const next = !previous
      if (next === getPrefersDark()) window.localStorage.removeItem(THEME_KEY)
      else window.localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
      return next
    })

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Content>
          <Home isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        </Content>
        <FooterBar />
      </Container>
    </ThemeProvider>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  /*
   * A single measure with gutters, rather than a percentage that changed at every
   * breakpoint. The old 95/90/80/70% ladder meant the content width moved constantly and
   * never settled anywhere deliberate.
   *
   * 760px is border-box, so the content inside the 20px gutters is 720px. That is the
   * measure of the search bar, the project views and the footer marquee. The profile
   * header keeps a narrower 452px measure (see Home's HeaderMeasure): a bio is prose
   * and reads best at that width, while a directory is a finder and wants room. Three
   * grid tiles across 720px are 238px each, up from 158px, and a feed cover stands 720px
   * tall, just under the old 780 measure whose 732px covers filled a laptop screen two
   * at a time.
   *
   * One gutter, not one that widens at a breakpoint: this element is the container every
   * layout query in the app resolves against, so its content width has to be a number
   * that only changes when the window is actually narrower than the measure.
   */
  container-type: inline-size;
  container-name: app;
  width: 100%;
  max-width: 760px;
  margin: ${({ theme }) => theme.spacing.lg} auto;
  padding: 0 20px;
`

const Content = styled.div`
  min-height: 75vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`
