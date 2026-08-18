/**
 * Takes a standalone app repo on disk and puts it live in the directory.
 *
 * Sets the Vite base, audits for paths that break under a sub-path, publishes the repo,
 * waits for its first release artifact, adds it to apps.json, and triggers the portfolio
 * deploy.
 *
 * Usage:
 *   node scripts/add-app.mjs <path-to-app> --slug <slug> [options]
 *
 * Options:
 *   --slug <slug>           Public path segment, e.g. `hat` -> /hat/   (required)
 *   --title <title>         Card title            (default: slug, title-cased)
 *   --description <text>    Card description      (default: the repo description)
 *   --tags a,b,c            Card tags
 *   --cover <path>          Cover image under public/  (default: /images/<slug>-project-cover.svg)
 *   --date <YYYY-MM-DD>     Creation date         (default: today)
 *   --dry-run               Do the local checks and the audit, then stop
 *   --yes                   Skip the confirmation prompt
 *   --shot-wait <ms>        Settle time before the cover screenshot  (default: 2500)
 *   --shot-theme <scheme>   Capture in `light` or `dark`             (default: light)
 *   --skip-cover            Do not capture a cover
 *
 * Every step is idempotent: re-running after fixing an audit finding picks up where it left off.
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "apps.json");
const TEMPLATE_PATH = path.join(ROOT, "templates", "release.yml");

// ---------------------------------------------------------------- arg parsing

function parseArgs(argv) {
  const positional = [];
  const flags = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (key === "dry-run" || key === "yes") {
      flags[key] = true;
    } else {
      flags[key] = argv[++i];
    }
  }

  return { positional, flags };
}

const { positional, flags } = parseArgs(process.argv.slice(2));

const appDir = positional[0] ? path.resolve(positional[0]) : null;
const slug = flags.slug;

if (!appDir || !slug) {
  console.error("Usage: node scripts/add-app.mjs <path-to-app> --slug <slug> [--dry-run]");
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  fail(`Invalid slug "${slug}". Use lowercase letters, digits and hyphens — it becomes the public URL.`);
}

// ------------------------------------------------------------------- helpers

const CHECK = "✓";

function step(message) {
  console.log(`\n${message}`);
}

function done(message) {
  console.log(`  ${CHECK} ${message}`);
}

function note(message) {
  console.log(`    ${message}`);
}

function fail(message) {
  console.error(`\nERROR: ${message}\n`);
  process.exit(1);
}

function run(cmd, args, options = {}) {
  return execFileSync(cmd, args, {
    cwd: options.cwd ?? appDir,
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : ["ignore", "pipe", "pipe"]
  });
}

/**
 * Pushes with gh's credentials rather than whatever the OS keychain holds.
 *
 * These commits add .github/workflows/release.yml, and a token without the `workflow`
 * scope gets a bare 403 on push. gh's token has it; the keychain's often does not. Passed
 * per-command so the user's global git config is left alone.
 */
function gitPush(args, options = {}) {
  return tryRun("git", ["-c", "credential.helper=!gh auth git-credential", "push", ...args], options);
}

function tryRun(cmd, args, options = {}) {
  try {
    return { ok: true, out: run(cmd, args, options).trim() };
  } catch (error) {
    return { ok: false, out: (error.stdout ?? "") + (error.stderr ?? "") };
  }
}

function titleCase(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ------------------------------------------------------- 1. validate the app

step("1. Validating the app directory");

if (!fs.existsSync(appDir)) fail(`No such directory: ${appDir}`);

const pkgPath = path.join(appDir, "package.json");
if (!fs.existsSync(pkgPath)) fail(`No package.json in ${appDir}`);

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
if (!pkg.scripts?.build) fail(`${pkg.name ?? appDir} has no "build" script.`);

const viteConfigPath = ["vite.config.ts", "vite.config.js", "vite.config.mts"]
  .map((name) => path.join(appDir, name))
  .find((candidate) => fs.existsSync(candidate));

if (!viteConfigPath) fail(`No vite config found in ${appDir}.`);

const gitignorePath = path.join(appDir, ".gitignore");
const gitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, "utf8") : "";
if (!/^dist\/?$/m.test(gitignore)) {
  note(`Warning: "dist" is not in .gitignore — build output may get committed.`);
}

done(`${pkg.name ?? path.basename(appDir)} at ${appDir}`);
done(`Vite config: ${path.basename(viteConfigPath)}`);

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
if (manifest.apps.some((app) => app.slug === slug)) {
  fail(`apps.json already has an app with slug "${slug}".`);
}

// --------------------------------------------------------- 2. set the base

step(`2. Setting the Vite base to /${slug}/`);

let viteConfig = fs.readFileSync(viteConfigPath, "utf8");
const existingBase = viteConfig.match(/^\s*base:\s*['"]([^'"]*)['"]/m);

if (existingBase) {
  if (existingBase[1] !== `/${slug}/`) {
    fail(
      `${path.basename(viteConfigPath)} already sets base to "${existingBase[1]}", ` +
        `but this app is being added at "/${slug}/". Resolve that by hand.`
    );
  }
  done(`Already set to /${slug}/`);
} else {
  const anchor = viteConfig.match(/defineConfig\(\{\s*\n/);
  if (!anchor) {
    fail(
      `Could not find a \`defineConfig({\` block to patch in ${path.basename(viteConfigPath)}. ` +
        `Add \`base: '/${slug}/',\` by hand and re-run.`
    );
  }
  const insertAt = anchor.index + anchor[0].length;
  viteConfig =
    viteConfig.slice(0, insertAt) +
    `  // Served from a sub-path of the portfolio's Hosting site.\n` +
    `  base: '/${slug}/',\n` +
    viteConfig.slice(insertAt);
  if (!flags["dry-run"]) fs.writeFileSync(viteConfigPath, viteConfig);
  done(`Added base: '/${slug}/'`);
}

// ------------------------------------------------------------- 3. the audit

step("3. Auditing for paths that break under a sub-path");

const blockers = [];

/**
 * Vite rewrites bundled imports and index.html attributes itself. What it cannot rewrite is
 * a URL built at runtime, or the contents of a file copied verbatim out of public/.
 */
function auditSourceLiterals() {
  const srcDir = path.join(appDir, "src");
  if (!fs.existsSync(srcDir)) return;

  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx|js|jsx|css)$/.test(entry.name)) files.push(full);
    }
  };
  walk(srcDir);

  for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      // A quoted literal that starts with a single slash and looks like a path.
      const matches = line.matchAll(/(['"`])(\/[A-Za-z0-9_-][^'"`\n]*)\1/g);
      for (const match of matches) {
        blockers.push({
          file: path.relative(appDir, file),
          line: index + 1,
          literal: match[2],
          hint: `Use \`\${import.meta.env.BASE_URL}${match[2].slice(1)}\` instead.`
        });
      }
    });
  }
}

/**
 * Relative URLs in a webmanifest resolve against the manifest's own URL, so making them
 * relative fixes the sub-path without hardcoding the slug anywhere.
 */
function fixWebmanifests() {
  const publicDir = path.join(appDir, "public");
  if (!fs.existsSync(publicDir)) return;

  const manifests = fs
    .readdirSync(publicDir)
    .filter((name) => name.endsWith(".webmanifest") || name === "manifest.json");

  for (const name of manifests) {
    const file = path.join(publicDir, name);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const changes = [];

    if (typeof data.start_url === "string" && data.start_url.startsWith("/")) {
      changes.push(`start_url: "${data.start_url}" -> "."`);
      data.start_url = ".";
    }
    if (typeof data.scope === "string" && data.scope.startsWith("/")) {
      changes.push(`scope: "${data.scope}" -> "."`);
      data.scope = ".";
    }
    for (const icon of data.icons ?? []) {
      if (typeof icon.src === "string" && icon.src.startsWith("/")) {
        const relative = icon.src.replace(/^\/+/, "");
        changes.push(`icons[].src: "${icon.src}" -> "${relative}"`);
        icon.src = relative;
      }
    }

    if (changes.length === 0) {
      done(`public/${name} already resolves relatively`);
      continue;
    }

    if (!flags["dry-run"]) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
    }
    done(`Rewrote public/${name} to use relative URLs`);
    for (const change of new Set(changes)) note(change);
  }
}

/**
 * Every app now shares one origin, so localStorage is a single namespace across all of them.
 */
function auditStorageKeys() {
  const srcDir = path.join(appDir, "src");
  if (!fs.existsSync(srcDir)) return;

  const unprefixed = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        const content = fs.readFileSync(full, "utf8");
        for (const match of content.matchAll(
          /(?:localStorage|sessionStorage)\.(?:get|set|remove)Item\(\s*['"`]([^'"`]+)['"`]/g
        )) {
          const key = match[1];
          if (!key.includes(".") && !key.startsWith(slug)) unprefixed.add(key);
        }
      }
    }
  };
  walk(srcDir);

  if (unprefixed.size > 0) {
    note(
      `Warning: unprefixed storage keys share one origin with every other app: ` +
        `${[...unprefixed].join(", ")}. Consider prefixing them with "${slug}.".`
    );
  }
}

fixWebmanifests();
auditStorageKeys();
auditSourceLiterals();

if (blockers.length > 0) {
  console.error(`\n  Found ${blockers.length} root-absolute path(s) that Vite cannot rewrite:\n`);
  for (const blocker of blockers) {
    console.error(`    ${blocker.file}:${blocker.line}  ${blocker.literal}`);
    console.error(`      ${blocker.hint}`);
  }
  console.error(
    `\n  These resolve against the domain root and will 404 under /${slug}/.\n` +
      `  Fix them, then re-run this command — everything above is already applied.\n`
  );
  process.exit(1);
}

done("No root-absolute paths in src/");

// ------------------------------------------- 4/5. workflows and stale config

step("4. Removing stale Firebase config and installing the release workflow");

for (const stale of ["firebase.json", ".firebaserc", ".github/workflows/deploy.yml", ".github/workflows/ci.yml"]) {
  const target = path.join(appDir, stale);
  if (fs.existsSync(target)) {
    if (!flags["dry-run"]) fs.rmSync(target);
    done(`Removed ${stale}`);
  }
}

const workflowDir = path.join(appDir, ".github", "workflows");
if (!flags["dry-run"]) {
  fs.mkdirSync(workflowDir, { recursive: true });
  fs.copyFileSync(TEMPLATE_PATH, path.join(workflowDir, "release.yml"));
}
done("Installed .github/workflows/release.yml");

if (flags["dry-run"]) {
  console.log(`\nDry run complete. Nothing was written, committed or published.\n`);
  process.exit(0);
}

// --------------------------------------------------------- 6. publish the repo

step("5. Publishing the repository");

if (!fs.existsSync(path.join(appDir, ".git"))) {
  run("git", ["init", "-b", "main"]);
  done("Initialised a git repository");
}

const remote = tryRun("git", ["remote", "get-url", "origin"]);
let repoSlug = null;

if (remote.ok) {
  repoSlug = remote.out.replace(/^.*github\.com[/:]/, "").replace(/\.git$/, "");
  done(`Remote: ${repoSlug}`);
} else {
  repoSlug = `${run("gh", ["api", "user", "--jq", ".login"]).trim()}/${path.basename(appDir)}`;
}

const description = flags.description ?? `${titleCase(slug)} — part of Jake's portfolio.`;

if (!flags.yes) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    `\n  About to publish ${repoSlug} as a PUBLIC repo, push it, and deploy /${slug}/ live.\n  Continue? [y/N] `
  );
  rl.close();
  if (!/^y(es)?$/i.test(answer.trim())) {
    console.log("\nAborted. Local file changes above are kept.\n");
    process.exit(0);
  }
}

const status = run("git", ["status", "--porcelain"]).trim();
if (status) {
  run("git", ["add", "-A"]);
  run("git", ["commit", "-m", `Serve from /${slug}/ and publish build artifacts`]);
  done("Committed local changes");
}

const repoExists = tryRun("gh", ["repo", "view", repoSlug, "--json", "visibility"]);

if (!repoExists.ok) {
  run("gh", [
    "repo", "create", repoSlug, "--public", "--source=.", "--push", "--description", description
  ]);
  done(`Created public repo ${repoSlug} and pushed`);
} else {
  if (JSON.parse(repoExists.out).visibility !== "PUBLIC") {
    run("gh", ["repo", "edit", repoSlug, "--visibility", "public", "--accept-visibility-change-consequences"]);
    done("Switched the repo to public");
  }
  const push = gitPush(["-u", "origin", "main"]);
  if (!push.ok) fail(`git push failed:\n${push.out}`);
  done("Pushed to main");
}

// ------------------------------------------------------- 7. wait for a release

step("6. Waiting for the release artifact");

const started = Date.now();
let tag = null;

while (Date.now() - started < 10 * 60 * 1000) {
  const release = tryRun("gh", [
    "release", "view", "--repo", repoSlug, "--json", "tagName,assets"
  ]);

  if (release.ok) {
    const data = JSON.parse(release.out);
    if (data.assets.some((asset) => asset.name === "dist.tar.gz")) {
      tag = data.tagName;
      break;
    }
  }

  process.stdout.write(".");
  await new Promise((resolve) => setTimeout(resolve, 10_000));
}

if (!tag) {
  fail(
    `No release with a dist.tar.gz asset appeared within 10 minutes.\n` +
      `  Check: gh run list --repo ${repoSlug}`
  );
}

console.log();
done(`Release ${tag} is ready`);

// ------------------------------------------------------- 7. capture the cover

const cover = flags.cover ?? `/images/${slug}-cover.jpg`;

if (flags["skip-cover"]) {
  step("7. Skipping the cover capture");
} else {
  step("7. Capturing the cover from the app");
  const capture = tryRun(
    "node",
    [
      path.join(ROOT, "scripts", "capture-cover.mjs"),
      appDir,
      "--slug",
      slug,
      "--out",
      path.join("public", cover.replace(/^\//, "")),
      "--wait",
      String(flags["shot-wait"] ?? 2500),
      "--theme",
      flags["shot-theme"] ?? "light"
    ],
    { cwd: ROOT }
  );
  if (!capture.ok) {
    fail(
      `Cover capture failed:\n${capture.out}\n` +
        `  Re-run with --skip-cover and supply --cover <path> to carry on without one.`
    );
  }
  done(`Captured ${cover}`);
}

// --------------------------------------------------- 8/9/10. manifest + deploy

step("8. Adding it to the directory");

if (!fs.existsSync(path.join(ROOT, "public", cover.replace(/^\//, "")))) {
  note(`Warning: ${cover} does not exist in public/ — the card image will 404.`);
}

manifest.apps.push({
  slug,
  title: flags.title ?? titleCase(slug),
  description,
  tags: flags.tags ? flags.tags.split(",").map((tag) => tag.trim()) : [],
  cover,
  creationDate: flags.date ?? new Date().toISOString().slice(0, 10),
  disabled: false,
  repo: repoSlug
});

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
done(`Added "${slug}" to apps.json`);

run("git", ["add", "apps.json"], { cwd: ROOT });
run("git", ["commit", "-m", `Add ${slug} to the directory`], { cwd: ROOT });
const portfolioPush = gitPush([], { cwd: ROOT });
if (!portfolioPush.ok) fail(`Pushing the portfolio failed:\n${portfolioPush.out}`);
done("Committed and pushed the portfolio");

step("9. Deploying");

run("gh", ["workflow", "run", "deploy.yml"], { cwd: ROOT });
done("Triggered the portfolio deploy");

console.log(`
  ${slug} will be live at https://portfolio-4b9fe.web.app/${slug}/ once the run finishes.

    gh run watch --repo jakeflavin/portfolio
`);
