import React from "react";
import Surface from "../Surface";
import {
  Header,
  TitleBlock,
  Title,
  Description,
  CountBox,
  List,
  ListItem,
  NumberBadge,
  ItemContent,
  MoreSection,
  MoreButton
} from "./NumberedList.styled";
import { useNumberedList } from "./useNumberedList";

export interface NumberedListProps {
  /** Section title (top left) */
  title: string;
  /** Muted description under the title */
  description: string;
  /** Number of items to show before truncating; full list shown when expanded */
  truncate: number;
  /** List items (any React nodes) */
  children: React.ReactNode;
  /** Optional class name */
  className?: string;
}

const NumberedList: React.FC<NumberedListProps> = ({
  title,
  description,
  truncate,
  children,
  className
}) => {
  const { expanded, isTruncated, setExpanded, total, visibleItems } = useNumberedList(
    children,
    truncate
  );

  return (
    <Surface
      as="section"
      padding="lg"
      variant="surface"
      shadow="md"
      className={className}
      aria-label={title}
    >
      <Header>
        <TitleBlock>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </TitleBlock>
        <CountBox aria-label={`${total} items`}>{total}</CountBox>
      </Header>
      <List>
        {visibleItems.map((child, index) => (
          <ListItem key={index}>
            <NumberBadge aria-hidden>{index + 1}</NumberBadge>
            <ItemContent>{child}</ItemContent>
          </ListItem>
        ))}
      </List>
      {isTruncated && (
        <MoreSection>
          <MoreButton
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? "less ▴" : "more ▾"}
          </MoreButton>
        </MoreSection>
      )}
    </Surface>
  );
};

export default NumberedList;
