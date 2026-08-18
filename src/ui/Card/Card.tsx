import React from "react";
import {
  CardWrapper,
  CardTypeLabel,
  TitleRow,
  Title,
  CardBody,
  CardImage,
  Description,
  TagsRow,
  Tag,
  ImageContainer
} from "./Card.styled";

export type CardType = "project";

export interface CardProps {
  /** Card title */
  title: string;
  /** Card type; shown as an uppercase label above the title */
  type?: CardType;
  /** Image URL; shown full-width at the top */
  imageSrc: string;
  /** Short description shown below the title */
  description: string;
  /** Tags displayed at the bottom */
  tags?: string[];
  /** Destination for the card. Omit to render a non-interactive card. */
  href?: string;
  /** Renders the card as unavailable and drops the link */
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  type = "project",
  imageSrc,
  description,
  tags = [],
  href,
  disabled = false
}) => {
  const isLink = Boolean(href) && !disabled;

  return (
    <CardWrapper
      as={isLink ? "a" : "div"}
      href={isLink ? href : undefined}
      $disabled={disabled}
      aria-disabled={disabled || undefined}
    >
      <ImageContainer>
        <CardImage src={imageSrc} alt={title} />
      </ImageContainer>
      <CardBody>
        <CardTypeLabel>{disabled ? "coming soon" : type}</CardTypeLabel>
        <TitleRow>
          <Title>{title}</Title>
        </TitleRow>
        <Description>{description}</Description>
        {tags.length > 0 && (
          <TagsRow>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsRow>
        )}
      </CardBody>
    </CardWrapper>
  );
};

export default Card;
