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
import { handleKeyboardAction } from "./card.utils";

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
  /** Called when the card is clicked */
  onAction?: () => void;
  /** Number of columns to span in a grid container (default: 1) */
  columnSpan?: number;
}

const Card: React.FC<CardProps> = ({
  title,
  type = "project",
  imageSrc,
  description,
  tags = [],
  onAction,
  columnSpan = 1
}) => {
  return (
    <CardWrapper
      $columnSpan={columnSpan}
      role={onAction ? "button" : undefined}
      tabIndex={onAction ? 0 : undefined}
      onClick={onAction}
      onKeyDown={onAction ? (event) => handleKeyboardAction(event, onAction) : undefined}
    >
      <ImageContainer>
        <CardImage src={imageSrc} alt={title} />
      </ImageContainer>
      <CardBody>
        <CardTypeLabel>{type}</CardTypeLabel>
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
