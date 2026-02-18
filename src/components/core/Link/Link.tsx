import React from "react";
import { StyledLink, Favicon, LinkText, LinkIcon } from "./Link.styled";

export interface LinkProps {
  /** Link label (visible text) */
  title: string;
  /** Link URL */
  url: string;
  /** Open in new tab (default: false) */
  openInNewTab?: boolean;
  /** Optional class name */
  className?: string;
}

const FAVICON_BASE = "https://www.google.com/s2/favicons?domain=";
const FAVICON_SIZE = "&sz=32";

function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `${FAVICON_BASE}${encodeURIComponent(hostname)}${FAVICON_SIZE}`;
  } catch {
    return "";
  }
}

const ExternalLinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const Link: React.FC<LinkProps> = ({
  title,
  url,
  openInNewTab = false,
  className
}) => {
  const faviconUrl = getFaviconUrl(url);

  return (
    <StyledLink
      href={url}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className={className}
    >
      {faviconUrl ? (
        <Favicon src={faviconUrl} alt="" width={20} height={20} />
      ) : null}
      <LinkText>{title}</LinkText>
      <LinkIcon>
        <ExternalLinkIcon />
      </LinkIcon>
    </StyledLink>
  );
};

export default Link;
