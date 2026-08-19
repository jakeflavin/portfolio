import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Send, Check } from "lucide-react";
import { BrandIcon } from "@/components/BrandIcon";
import {
  CardWrapper,
  PostHeader,
  HeaderTitle,
  Media,
  CardImage,
  Actions,
  ActionButton,
  ActionLink,
  Caption,
  Description,
  DescriptionWrap,
  MoreButton,
  HashTags,
  HashTag,
  Meta,
  Timestamp,
  MetaDot,
  Build,
  Pinned
} from "./Card.styled";
import { formatPostAge } from "./card.utils";
import { NAV_ITEM_ATTRIBUTE } from "@/hooks/useKeyboardNav";

export type CardType = "project";

const ICON_SIZE = 18;

export interface CardProps {
  /** Card title */
  title: string;
  /** Card type; retained for the directory's data shape */
  type?: CardType;
  /** Image URL; shown as the post media */
  imageSrc: string;
  /** Description shown as the caption, clamped to two lines until expanded */
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
  /** Called with a tag when its chip is clicked */
  onTagClick?: (tag: string) => void;
  /** Release tag this slug shipped from, per the deploy manifest */
  build?: string;
  /** Whether that release is pinned in apps.json rather than tracking the latest */
  pinned?: boolean;
}

export function Card({
  title,
  imageSrc,
  description,
  tags = [],
  href,
  disabled = false,
  date,
  repo,
  onTagClick,
  build,
  pinned = false
}: CardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const isLink = Boolean(href) && !disabled;
  const age = disabled ? "Coming soon" : date ? formatPostAge(date) : null;

  /**
   * Only offer "more" when the text actually overflows its two lines — otherwise a short
   * description gets a control that does nothing. Measured while clamped, and re-measured
   * on resize, since the card's width decides where the text wraps.
   */
  useEffect(() => {
    if (expanded) return;
    const element = descriptionRef.current;
    if (!element) return;

    const measure = () => setOverflows(element.scrollHeight > element.clientHeight + 1);
    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [description, expanded]);

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
        <HeaderTitle
          as={isLink ? "a" : "span"}
          href={isLink ? href : undefined}
          {...(isLink ? { [NAV_ITEM_ATTRIBUTE]: "" } : {})}
        >
          {title}
        </HeaderTitle>
      </PostHeader>

      <Media as={isLink ? "a" : "div"} href={isLink ? href : undefined} tabIndex={-1}>
        <CardImage src={imageSrc} alt={`${title} preview`} />
      </Media>

      <Actions>
        {isLink && (
          <ActionLink href={href} aria-label={`Open ${title}`} title="Open">
            <ArrowUpRight size={ICON_SIZE} />
          </ActionLink>
        )}
        {isLink && (
          <ActionButton
            type="button"
            onClick={copyLink}
            aria-label={`Copy link to ${title}`}
            title={copied ? "Copied" : "Copy link"}
          >
            {copied ? (
              <Check size={ICON_SIZE} />
            ) : (
              <Send size={ICON_SIZE} />
            )}
          </ActionButton>
        )}
        {repo && (
          <ActionLink
            $end
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View source for ${title}`}
            title="Source"
          >
            <BrandIcon name="github" size={ICON_SIZE} />
          </ActionLink>
        )}
      </Actions>

      <Caption>
        <DescriptionWrap>
          <Description ref={descriptionRef} $clamped={!expanded}>
            {description}
          </Description>
          {(overflows || expanded) && (
            <MoreButton
              type="button"
              $inline={!expanded}
              onClick={() => setExpanded((previous) => !previous)}
            >
              {expanded ? "less" : "\u2026 more"}
            </MoreButton>
          )}
        </DescriptionWrap>
        {tags.length > 0 && (
          <HashTags>
            {tags.map((tag) => (
              <HashTag
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                aria-label={`Filter by ${tag}`}
              >
                #{tag.replace(/\s+/g, "")}
              </HashTag>
            ))}
          </HashTags>
        )}
        {(age || build) && (
          <Meta>
            {age && <Timestamp>{age}</Timestamp>}
            {age && build && <MetaDot aria-hidden="true">·</MetaDot>}
            {build && (
              <Build title={`Deployed from release ${build}`}>{build}</Build>
            )}
            {build && pinned && <Pinned title="Held at this release">pinned</Pinned>}
          </Meta>
        )}
      </Caption>
    </CardWrapper>
  );
};

