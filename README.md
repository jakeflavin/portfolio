# Portfolio Site

My personal portfolio: a public **directory** of small, standalone web apps, and the
**single deployment pipeline** that publishes all of them.

Live at <https://portfolio-4b9fe.web.app>.

## Docs

- [STANDARDS.md](docs/STANDARDS.md) — how code is written across every repo in this set
- [LAYOUT.md](docs/LAYOUT.md) — where code goes inside `src/`
- [BUILD.md](docs/BUILD.md) — how the apps are built, released and deployed

Each project lives in its own repository and is served from a sub-path of this one site —
`/countdown/`, `/hat/`, and so on.

---

## How it fits together

Firebase Hosting releases are atomic whole-site replacements, and rewrites cannot target
another Hosting site. So one job assembles the complete `dist` tree:

1. Each app repo builds on merge to `main` and publishes its `dist` as a **release
   artifact** (`dist.tar.gz`). That is *not* a deploy — nothing goes live from it.
2. This repo's deploy workflow builds the directory, then `scripts/fetchApps.mjs`
   downloads each app's artifact and extracts it into `dist/<slug>/`.
3. Firebase deploys the whole tree in one release.

Deploys are therefore always deliberate. Pushing to an app repo never publishes to
production on its own.

`apps.json` is the single source of truth for both the directory cards and the deploy.
`dist/deploy-manifest.json` records which release tag each slug resolved to, so any live
deploy is auditable.

### Why sub-paths and not subdomains

Firebase Hosting has no wildcard custom-domain support, so every subdomain would need its
own DNS records — a per-project cost. Sub-paths keep adding a project near-free, and when
a custom domain is attached later it is attached once, with no URL changes.

---

## Adding a project

```bash
node scripts/add-app.mjs ../my-app --slug my-app --title "My App" \
  --description "What it does." --tags utility
```

The script sets the Vite `base`, audits for paths that break under a sub-path, publishes
the repo as public, waits for its release artifact, updates `apps.json`, and triggers the
deploy. Every step is idempotent, so a failed run can be re-run once the cause is fixed.

Use `--dry-run` first to see the audit without writing, committing or publishing anything.

### What the audit catches

Vite rewrites bundled imports and `index.html` attributes itself. It cannot rewrite:

- **URLs built at runtime** — `` `/scenes/${id}.mp4` `` must become
  `` `${import.meta.env.BASE_URL}scenes/${id}.mp4` ``. These stop the run.
- **Files copied verbatim from `public/`** — a `.webmanifest`'s `start_url`, `scope` and
  icon `src` values are rewritten automatically to be relative, which resolves against the
  manifest's own URL without hardcoding the slug.

Note that every app now shares one origin, so **localStorage is a single namespace across
all of them**. Prefix your keys with the slug.

---

## Local development

```bash
npm install
npm run dev
```

To preview the assembled site exactly as it deploys, including every app:

```bash
npm run build && node scripts/fetchApps.mjs && npx firebase emulators:start --only hosting
```

Checks:

```bash
npm run lint && npm test
```

---

## Tech stack

- React 19 + Vite, styled-components
- Firebase Hosting (project `portfolio-4b9fe`)
- GitHub Actions for both the app release workflows and this repo's deploy
