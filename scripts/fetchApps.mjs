/**
 * Pulls each app's prebuilt `dist` out of its GitHub release and lays it down under
 * `dist/<slug>/`, so one Firebase Hosting release contains the directory plus every app.
 *
 * Hosting releases are atomic whole-site replacements, so a single job has to assemble the
 * complete tree — apps cannot deploy themselves into a sub-path.
 *
 * Must run AFTER `vite build` and `generateSocialMeta.js`, both of which write dist/index.html.
 *
 * Usage: node scripts/fetchApps.mjs [--only <slug>]
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const MANIFEST_PATH = path.join(ROOT, "apps.json");
const ASSET_NAME = "dist.tar.gz";

const onlyIndex = process.argv.indexOf("--only");
const onlySlug = onlyIndex === -1 ? null : process.argv[onlyIndex + 1];

/** GitHub API requests are unauthenticated by default; a token only raises the rate limit. */
function apiHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-fetch-apps"
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/** Resolves the tag an app will actually deploy, so a live release is auditable. */
async function resolveTag(app) {
  if (app.ref) return app.ref;

  const res = await fetch(`https://api.github.com/repos/${app.repo}/releases/latest`, {
    headers: apiHeaders()
  });

  if (!res.ok) {
    throw new Error(
      `Could not resolve the latest release for ${app.repo} (HTTP ${res.status}). ` +
        `The repo must be public and have at least one release with a ${ASSET_NAME} asset.`
    );
  }

  const release = await res.json();
  return release.tag_name;
}

async function download(url, destination) {
  const res = await fetch(url, { redirect: "follow", headers: apiHeaders() });
  if (!res.ok) {
    throw new Error(`Download failed: ${url} (HTTP ${res.status})`);
  }
  fs.writeFileSync(destination, Buffer.from(await res.arrayBuffer()));
}

async function fetchApp(app) {
  const tag = await resolveTag(app);
  const target = path.join(DIST_DIR, app.slug);
  const url = `https://github.com/${app.repo}/releases/download/${tag}/${ASSET_NAME}`;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `app-${app.slug}-`));
  const tarball = path.join(tmpDir, ASSET_NAME);

  try {
    await download(url, tarball);

    fs.rmSync(target, { recursive: true, force: true });
    fs.mkdirSync(target, { recursive: true });
    execFileSync("tar", ["-xzf", tarball, "-C", target]);

    if (!fs.existsSync(path.join(target, "index.html"))) {
      throw new Error(
        `${app.slug}: the artifact extracted without an index.html at its root. ` +
          `It should be built with \`tar -czf ${ASSET_NAME} -C dist .\`.`
      );
    }

    const bytes = fs.statSync(tarball).size;
    console.log(
      `  ${app.slug.padEnd(14)} ${tag.padEnd(16)} ${(bytes / 1024 / 1024).toFixed(1)} MB`
    );

    return { slug: app.slug, repo: app.repo, tag, pinned: Boolean(app.ref) };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

if (!fs.existsSync(DIST_DIR)) {
  throw new Error("dist/ does not exist. Run `npm run build` first.");
}

const { apps } = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const selected = onlySlug ? apps.filter((a) => a.slug === onlySlug) : apps;

if (onlySlug && selected.length === 0) {
  throw new Error(`No app with slug "${onlySlug}" in apps.json.`);
}

console.log(`Fetching ${selected.length} app artifact(s):`);

const resolved = [];
for (const app of selected) {
  resolved.push(await fetchApp(app));
}

fs.writeFileSync(
  path.join(DIST_DIR, "deploy-manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), apps: resolved }, null, 2) + "\n"
);

console.log(`Wrote dist/deploy-manifest.json`);
