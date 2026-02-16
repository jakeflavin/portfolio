import React from "react";
import {
  CardWrapper,
  TitleRow,
  Title,
  CardImage,
  Description,
  TagsRow,
  Tag,
  ImageContainer
} from "./Card.styled";
import SearchIcon from "@/assets/icons/magnifying-glass.svg?react";

export type CardType = "project";

export interface CardProps {
  /** Card title */
  title: string;
  /** Card type; determines the icon shown next to the title */
  type?: CardType;
  /** Image URL; shown full-width below the title */
  imageSrc: string;
  /** Image alt text for accessibility */
  description: string;
  /** Tags displayed below the description */
  tags?: string[];
  /** Called when the card is clicked */
  onAction?: () => void;
  /** Number of columns to span in a grid container (default: 1) */
  columnSpan?: number;
}

const CARD_TYPE_ICON: Record<CardType, React.ReactNode> = {
  project: <SearchIcon width={18} height={18} />
};

const Card: React.FC<CardProps> = ({
  title,
  type = "project",
  imageSrc,
  description,
  tags = [],
  onAction,
  columnSpan = 1
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onAction?.();
    }
  };

  const titleIcon = CARD_TYPE_ICON[type];

  return (
    <CardWrapper
      $columnSpan={columnSpan}
      role={onAction ? "button" : undefined}
      tabIndex={onAction ? 0 : undefined}
      onClick={onAction}
      onKeyDown={onAction ? handleKeyDown : undefined}
    >
      <ImageContainer>
        <CardImage src={imageSrc} />
      </ImageContainer>
      <TitleRow>
        {/* {titleIcon && <TitleIcon>{titleIcon}</TitleIcon>} */}
        <Title>{title}</Title>

        {tags.length > 0 && (
        <TagsRow>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsRow>
      )}
      </TitleRow>
      <Description>{description}</Description>
      
    </CardWrapper>
  );
};

export default Card;
