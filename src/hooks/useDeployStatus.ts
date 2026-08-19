import { useEffect, useState } from 'react'

/**
 * What the deploy recorded about one app: the release tag that actually shipped, and
 * whether that tag was pinned in apps.json rather than resolved to the latest.
 */
export interface DeployedApp {
  slug: string
  repo: string
  tag: string
  pinned: boolean
}

export interface DeployManifest {
  /** When the deploy ran. Site-wide — every app in a release ships together. */
  generatedAt: string
  apps: DeployedApp[]
}

/**
 * Reads the manifest the deploy leaves behind.
 *
 * Fetched at runtime rather than imported: `fetchApps.mjs` writes it into `dist/` *after*
 * Vite has built, so it does not exist at bundle time and cannot be a module.
 *
 * It is also absent in dev and on any preview built without running the fetch step, so a
 * miss is the normal case rather than an error — the hook stays quiet and the cards simply
 * show no build.
 */
export function useDeployStatus(): DeployManifest | null {
  const [manifest, setManifest] = useState<DeployManifest | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/deploy-manifest.json', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: DeployManifest | null) => {
        if (data && Array.isArray(data.apps)) setManifest(data)
      })
      .catch(() => {
        // Absent in dev, and a failed status line is not worth surfacing.
      })

    return () => controller.abort()
  }, [])

  return manifest
}

/** Indexes the manifest by slug, so a card can look itself up in one step. */
export function bySlug(manifest: DeployManifest | null): Map<string, DeployedApp> {
  return new Map((manifest?.apps ?? []).map((app) => [app.slug, app]))
}
