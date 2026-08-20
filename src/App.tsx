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

  const toggleDarkMode = () =>
    setIsDarkMode((previous) => {
      const next = !previous
      window.localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
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
   * 500px is border-box, so the content inside the 24px gutters is 452px. That number is
   * now the feed's own width, since the feed is a single column: a card's cover is square,
   * so the measure is also how tall every image in it stands. At the old 780 the covers
   * were 732px tall and two of them filled a laptop screen.
   *
   * It is a compromise with the grid, which wants the opposite. Three tiles across 452px
   * are 149px each, which is small enough that the hover panel has to decide what to show
   * from the tile's own width rather than the viewport's. See the Tile container query.
   */
  width: 100%;
  max-width: 550px;
  margin: ${({ theme }) => theme.spacing.lg} auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }
`

const Content = styled.div`
  min-height: 75vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`
