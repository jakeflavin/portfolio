import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

/*
 * Nothing in a unit test may reach the network. `useDeployStatus` fetches
 * /deploy-manifest.json on mount, and letting jsdom attempt that made three
 * component tests time out intermittently. A 404 is the honest default: it is
 * exactly what dev and any un-fetched preview serve, so the hook takes its
 * absent-manifest path. A test that wants a manifest overrides this stub.
 */
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(new Response(null, { status: 404 }))),
  )
})

/*
 * jsdom has no media queries at all, and every app in this set reads one — the theme
 * hooks watch prefers-color-scheme, and roll asks whether there is a pointer worth
 * showing keyboard shortcuts for. Without this, rendering any of them throws.
 *
 * Nothing matches, which is the honest answer for a headless DOM with no device behind
 * it. A test that needs a query to match overrides this stub.
 */
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
