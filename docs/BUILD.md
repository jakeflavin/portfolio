# How this gets built and deployed

The portfolio is a **directory** of standalone apps and the **pipeline that publishes
them**. It holds no application code of its own beyond the directory page.

Every app is its own repository, with its own tests, its own release cycle and no knowledge
of this one. They meet exactly once: at deploy time, when this repo pulls each app's latest
build artifact and ships them all as a single site.

---

## Why it is shaped like this

Two constraints did most of the design work.

**Firebase Hosting releases are atomic and whole-site.** There is no way to deploy only
`/weather/`, and a rewrite cannot point at a different Hosting site. Something has to
assemble the complete tree before any deploy — so one job does, and it lives here.

**Firebase Hosting has no wildcard custom domains.** Subdomains (`weather.example.com`)
would mean a DNS record per app. Since adding an app has to stay near-zero effort, apps
live on paths instead: `/weather/`, `/hush/`, `/fibo/`. When a custom domain is attached
later, it is attached once and no URL changes.

A third rule is a preference rather than a constraint: **pushing to an app never deploys
the site.** An app's CI publishes an artifact and stops. Nothing goes live until a deploy is
triggered here. That keeps a change to one app from silently republishing seven others.

---

## The pieces

```
apps.json              the single source of truth: what exists, and where it came from
scripts/fetchApps.mjs  downloads each app's release artifact into dist/<slug>/
scripts/add-app.mjs    takes a repo on disk to live in the directory
scripts/capture-cover.mjs  screenshots an app by driving the real thing
templates/release.yml  the workflow installed into each app repo
```

### `apps.json`

Drives both the cards and the deploy, so the directory cannot show something the deploy
does not ship.

```json
{
  "slug": "weather",
  "title": "Weather",
  "description": "A dense, chart-first weather dashboard.",
  "tags": ["weather", "forecast", "charts"],
  "cover": "/images/weather-cover.jpg",
  "creationDate": "2026-08-18",
  "disabled": false,
  "repo": "jakeflavin/weather"
}
```

An optional `"ref": "build-41"` pins an app to a specific release. Absent, the deploy takes
whatever is latest at that moment. An optional `shot` object records how to screenshot the
app — see *Covers* below.

### Release artifacts, not deploys

Each app repo runs `templates/release.yml`: install, lint, typecheck, test, build, then
`tar` its `dist` and publish it as a GitHub release asset named `dist.tar.gz`.

This is the whole reason the app repos need no Firebase credentials. Only this repo holds
any.

### The aggregating deploy

```
npm ci → lint → test → build            the directory itself
       → generateSocialMeta.js          rewrites dist/index.html
       → fetchApps.mjs                  unpacks each app into dist/<slug>/
       → firebase deploy                one atomic release
```

`fetchApps.mjs` downloads

```
https://github.com/<repo>/releases/latest/download/dist.tar.gz
```

which public repos serve **unauthenticated** — that is why every app repo is public, and
why no cross-repo token exists anywhere.

Order matters: `fetchApps.mjs` must run *after* `generateSocialMeta.js`, which writes
`dist/index.html`. Reversed, an app's `index.html` would be overwritten.

It also writes `dist/deploy-manifest.json`, recording the tag each slug actually resolved
to. The directory fetches that at runtime to show each card's build, which makes a live
deploy auditable from the page itself. Rolling an app back is adding a `ref` and
redeploying.

### No per-app rewrite is needed

Hosting serves static files *before* applying rewrites, and none of the static apps use
client-side routing, so `/weather/` resolves as a file and never reaches the `**`
catch-all.

fibo is the exception, and its two rules show what the general case looks like:

```json
"rewrites": [
  { "source": "/fibo/mcp", "function": { "functionId": "mcp", "region": "us-central1" } },
  { "source": "/fibo/**", "destination": "/fibo/index.html" },
  { "source": "**", "destination": "/index.html" }
]
```

The order is load-bearing. `/fibo/mcp` has to reach the function before `/fibo/**` hands it
to the app's router, and both have to precede the catch-all.

---

## Adding an app

```bash
node scripts/add-app.mjs apps/weather --slug weather --title "Weather" \
  --description "A dense, chart-first weather dashboard." --tags weather,forecast,charts
```

Every app is cloned into `apps/`, which is gitignored — the checkouts are their own
repositories and this one must never swallow them. Nothing about the pipeline depends on
that location; the scripts take a path, so a clone anywhere works.

Nine steps, each idempotent, so a re-run after fixing something resumes rather than
restarting:

1. **Validate** — a `package.json`, a `build` script, a Vite config, `dist` ignored.
2. **Set the Vite base** to `/<slug>/`.
3. **Audit for root-absolute paths** — the step that catches what `base` cannot.
4. **Strip stale Firebase config**, keeping any backend section (see below).
5. **Install `release.yml`.**
6. **Publish the repo** public, normalising the branch to `main` first.
7. **Wait** for the first release artifact.
8. **Capture the cover** and add the entry to `apps.json`.
9. **Trigger the deploy.**

`--dry-run` stops after step 3.

### What `base` does not fix

Vite rewrites bundled imports and `index.html` attributes. It does **not** touch URLs built
at runtime, or files copied verbatim out of `public/`. So the audit looks for:

- string literals in `src/` that start with `/` and look like paths
- `start_url`, `scope` and icon `src` in any webmanifest — rewritten automatically to
  relative URLs, which resolve against the manifest's own location and so need no slug
- unprefixed `localStorage` keys

That last one matters more than it looks: every app now shares one origin, and therefore
one `localStorage` namespace. **Slug-prefixed keys are a requirement, not a style
preference.**

The audit skips comments — prose naming an endpoint is not a broken path — but it still
cannot tell a fetch path from a unit label like `/mi`. Reviewed false positives get
`--accept-audit` rather than contorting the app to satisfy the script.

### Apps that keep a backend

Hosting always moves here. A backend does not.

linkit uses Firestore and fibo uses the Realtime Database and a Cloud Function. Their
`firebase.json` keeps those sections and loses only `hosting`, and their `.firebaserc`
stays, so each app still deploys **its own rules from its own repo**. Deleting the file
outright would strand the rules with no way to ship a change.

They all target the same Firebase project now, which is only safe because their data is
namespaced — Firestore collections and the RTDB `sessions` subtree do not collide.

---

## Covers

Card images are screenshots of the real apps, captured by building each one, serving its
own `dist`, and driving it in a headless browser at 1080×1080.

Serving the local build rather than the live URL is deliberate: it means a cover can be
captured *before* the app has ever been deployed, which is the order `add-app.mjs` needs.

Per-app settings live in `apps.json` under `shot`, so a re-capture in any later session
reproduces the same framing without anyone remembering the flags:

```json
"shot": {
  "hide": "header,footer,.banner",
  "previewDir": "apps/web",
  "wait": 3000,
  "actions": [
    { "selector": "input", "wait": 300 },
    { "type": "Boulder, Colorado", "wait": 2500 },
    { "click": [270, 540], "wait": 1800 }
  ]
}
```

- `hide` removes the app's own chrome, whose title would otherwise duplicate the card's.
- `previewDir` points at the package in a workspace repo, which builds from the root but
  serves from the package.
- `actions` drive an app that opens empty. runify's cover is a blank world map without
  them; fibo's is an empty form.

Coordinates are measured **with the chrome already hidden**, since hiding it shifts the
layout up.

Covers are static snapshots: they go stale when an app's UI changes until the capture is
re-run.

---

## Consequences worth knowing

- **`ref: latest` means any deploy ships whatever is newest.** Including a deploy triggered
  by an unrelated change here. Pin a `ref` to freeze an app.
- **One origin means one `localStorage`.** Prefix keys per app.
- **Covers drift.** Nothing detects it.
- **fibo's functions deploy by hand.** Its CI cannot deploy them until a service account
  for the Firebase project is added to that repo's secrets.
