import React, { useState } from "react";
import {
  Wrapper,
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
  const [expanded, setExpanded] = useState(false);
  const items = React.Children.toArray(children);
  const total = items.length;
  const isTruncated = total > truncate;
  const visibleItems = expanded || !isTruncated ? items : items.slice(0, truncate);

  return (
    <Wrapper className={className} aria-label={title}>
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
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          {expanded ? "less ▴" : "more ▾"}
          </MoreButton>
        </MoreSection>
      )}
    </Wrapper>
  );
};

export default NumberedList;
