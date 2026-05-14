import React from "react";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { StyledLink, Favicon, LinkText, LinkIcon } from "./Link.styled";
import { getFaviconUrl } from "./link.utils";

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
      <LinkIcon aria-hidden="true">
        <ArrowSquareOutIcon size={14} />
      </LinkIcon>
    </StyledLink>
  );
};

export default Link;
