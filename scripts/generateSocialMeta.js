import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { PROJECT_RECORDS } from "../src/features/projects/projectRecords.js";

dotenv.config({ quiet: true });
dotenv.config({ path: ".env.local", quiet: true });

const DIST_DIR = path.resolve("dist");
const INDEX_PATH = path.join(DIST_DIR, "index.html");
const SITE_TITLE = "Jake's Portfolio";
const DEFAULT_DESCRIPTION = "Personal portfolio and utility app hub by Jake Flavin.";
const DEFAULT_IMAGE = "/crown.svg";
const SITE_URL =
  process.env.VITE_SITE_URL ??
  process.env.SITE_URL ??
  "https://portfolio-4b9fe.web.app";

function absoluteUrl(value) {
  if (value.startsWith("http")) return value;
  return new URL(value, SITE_URL).toString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function preferSocialImage(imageSrc) {
  const parsed = path.parse(imageSrc);
  if (parsed.ext !== ".svg") return imageSrc;

  const pngPath = path.join("public", parsed.dir, `${parsed.name}.png`);
  return fs.existsSync(pngPath) ? path.join(parsed.dir, `${parsed.name}.png`) : imageSrc;
}

function socialMeta({ title, description, imageSrc, url }) {
  const fullTitle = title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}`;
  const imageUrl = absoluteUrl(preferSocialImage(imageSrc));
  const pageUrl = absoluteUrl(url);

  return [
    "<!-- social-meta:start -->",
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_TITLE)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(title)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(title)}" />`,
    `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`,
    "<!-- social-meta:end -->"
  ].join("\n    ");
}

function applyMeta(html, meta) {
  const withoutExistingMeta = html.replace(
    /\n\s*<!-- social-meta:start -->[\s\S]*?<!-- social-meta:end -->/m,
    ""
  );

  return withoutExistingMeta
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(SITE_TITLE)}</title>`)
    .replace("</head>", `    ${meta}\n  </head>`);
}

function pageHtml(template, page) {
  return applyMeta(template, socialMeta(page)).replace(
    `<title>${escapeHtml(SITE_TITLE)}</title>`,
    `<title>${escapeHtml(page.title)} | ${escapeHtml(SITE_TITLE)}</title>`
  );
}

const template = fs.readFileSync(INDEX_PATH, "utf8");

fs.writeFileSync(
  INDEX_PATH,
  applyMeta(
    template,
    socialMeta({
      title: SITE_TITLE,
      description: DEFAULT_DESCRIPTION,
      imageSrc: DEFAULT_IMAGE,
      url: "/"
    })
  )
);

for (const project of PROJECT_RECORDS) {
  if (project.external) continue;

  const routeDir = path.join(DIST_DIR, project.path);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(
    path.join(routeDir, "index.html"),
    pageHtml(template, {
      title: project.title,
      description: project.description,
      imageSrc: project.imageSrc,
      url: project.path
    })
  );
}

console.log(`Generated static social meta for ${PROJECT_RECORDS.length - 1} project routes.`);
