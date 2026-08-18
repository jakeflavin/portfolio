import React from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import {
  CardWrapper,
  PostHeader,
  Mark,
  HeaderText,
  Title,
  Subtitle,
  OpenIcon,
  ImageContainer,
  CardImage,
  Caption,
  Description,
  HashTags,
  Timestamp
} from "./Card.styled";

export type CardType = "project";

export interface CardProps {
  /** Card title */
  title: string;
  /** Card type; shown as the header subtitle when there are no tags */
  type?: CardType;
  /** Image URL; shown as the post media */
  imageSrc: string;
  /** Short description shown as the caption */
  description: string;
  /** Tags rendered as hashtags under the caption */
  tags?: string[];
  /** Destination for the card. Omit to render a non-interactive card. */
  href?: string;
  /** Renders the card as unavailable and drops the link */
  disabled?: boolean;
  /** Shown as the post timestamp */
  date?: Date;
}

/**
 * Rendered in UTC on purpose. Manifest dates are plain `YYYY-MM-DD`, which Date parses as
 * UTC midnight; formatting those in a behind-UTC local zone shows the previous day.
 */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });

const Card: React.FC<CardProps> = ({
  title,
  type = "project",
  imageSrc,
  description,
  tags = [],
  href,
  disabled = false,
  date
}) => {
  const isLink = Boolean(href) && !disabled;

  return (
    <CardWrapper
      as={isLink ? "a" : "div"}
      href={isLink ? href : undefined}
      $disabled={disabled}
      aria-disabled={disabled || undefined}
    >
      <PostHeader>
        <Mark aria-hidden="true">{title.charAt(0)}</Mark>
        <HeaderText>
          <Title>{title}</Title>
          <Subtitle>{disabled ? "coming soon" : type}</Subtitle>
        </HeaderText>
        {isLink && (
          <OpenIcon>
            <ArrowUpRightIcon size={16} />
          </OpenIcon>
        )}
      </PostHeader>

      <ImageContainer>
        <CardImage src={imageSrc} alt={title} />
      </ImageContainer>

      <Caption>
        <Description>
          <strong>{title}</strong> {description}
        </Description>
        {tags.length > 0 && (
          <HashTags>{tags.map((tag) => `#${tag.replace(/\s+/g, "")}`).join(" ")}</HashTags>
        )}
        {date && <Timestamp>{formatDate(date)}</Timestamp>}
      </Caption>
    </CardWrapper>
  );
};

export default Card;
