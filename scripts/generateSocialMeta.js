import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

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

/** Swaps an .svg for a sibling .png, since most social crawlers will not render SVG. */
function preferSocialImage(imageSrc) {
  const parsed = path.parse(imageSrc);
  if (parsed.ext !== ".svg") return imageSrc;

  const pngPath = path.join("public", parsed.dir, `${parsed.name}.png`);
  return fs.existsSync(pngPath) ? path.join(parsed.dir, `${parsed.name}.png`) : imageSrc;
}

function socialMeta({ title, description, imageSrc, url }) {
  const imageUrl = absoluteUrl(preferSocialImage(imageSrc));
  const pageUrl = absoluteUrl(url);

  return [
    "<!-- social-meta:start -->",
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_TITLE)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(title)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
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

// Only the directory's own index.html is generated here. Each app under /<slug>/ ships
// its own index.html inside its release artifact, and must not be overwritten.
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

console.log("Generated social meta for the directory index.");
