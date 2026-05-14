const FAVICON_BASE = "https://www.google.com/s2/favicons?domain=";
const FAVICON_SIZE = "&sz=32";

export function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `${FAVICON_BASE}${encodeURIComponent(hostname)}${FAVICON_SIZE}`;
  } catch {
    return "";
  }
}
