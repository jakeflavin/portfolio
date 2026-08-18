import React, { useState } from "react";
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  LinkSimpleIcon,
  CheckIcon
} from "@phosphor-icons/react";
import {
  CardWrapper,
  PostHeader,
  Mark,
  HeaderTitle,
  Age,
  Media,
  CardImage,
  Actions,
  ActionButton,
  ActionLink,
  Caption,
  Description,
  HashTags
} from "./Card.styled";
import { formatPostAge } from "./card.utils";

export type CardType = "project";

export interface CardProps {
  /** Card title */
  title: string;
  /** Card type; unused in the header now that the age sits there */
  type?: CardType;
  /** Image URL; shown as the post media */
  imageSrc: string;
  /** Short description shown as the caption */
  description: string;
  /** Tags rendered as hashtags under the caption */
  tags?: string[];
  /** Destination for the card. Omit to render a non-interactive card. */
  href?: string;
  /** Renders the card as unavailable and drops the links */
  disabled?: boolean;
  /** Shown as the post age */
  date?: Date;
  /** `owner/name` on GitHub, linked from the action row */
  repo?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  imageSrc,
  description,
  tags = [],
  href,
  disabled = false,
  date,
  repo
}) => {
  const [copied, setCopied] = useState(false);
  const isLink = Boolean(href) && !disabled;

  /**
   * clipboard.writeText rejects on a permission denial, an unfocused document, or an
   * insecure context. Left unhandled that is an uncaught rejection and a button that
   * silently does nothing, so failures fall back to the legacy path.
   */
  const copyLink = async () => {
    if (!href) return;
    const url = new URL(href, window.location.origin).toString();

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copiedViaFallback = document.execCommand("copy");
      document.body.removeChild(field);
      if (!copiedViaFallback) return;
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <CardWrapper $disabled={disabled}>
      <PostHeader>
        <Mark aria-hidden="true">{title.charAt(0)}</Mark>
        <HeaderTitle as={isLink ? "a" : "span"} href={isLink ? href : undefined}>
          {title}
        </HeaderTitle>
        <Age>{disabled ? "coming soon" : date ? formatPostAge(date) : null}</Age>
      </PostHeader>

      <Media as={isLink ? "a" : "div"} href={isLink ? href : undefined} tabIndex={-1}>
        <CardImage src={imageSrc} alt={`${title} preview`} />
      </Media>

      <Actions>
        {isLink && (
          <ActionLink href={href} aria-label={`Open ${title}`} title="Open">
            <ArrowSquareOutIcon size={22} />
          </ActionLink>
        )}
        {repo && (
          <ActionLink
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View source for ${title}`}
            title="Source"
          >
            <GithubLogoIcon size={22} />
          </ActionLink>
        )}
        {isLink && (
          <ActionButton
            type="button"
            onClick={copyLink}
            aria-label={`Copy link to ${title}`}
            title={copied ? "Copied" : "Copy link"}
          >
            {copied ? <CheckIcon size={22} /> : <LinkSimpleIcon size={22} />}
          </ActionButton>
        )}
      </Actions>

      <Caption>
        <Description>
          <strong>{title}</strong> {description}
        </Description>
        {tags.length > 0 && (
          <HashTags>{tags.map((tag) => `#${tag.replace(/\s+/g, "")}`).join(" ")}</HashTags>
        )}
      </Caption>
    </CardWrapper>
  );
};

export default Card;
