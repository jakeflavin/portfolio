import React from "react";
import { PageContainer, Column, ItemWrap } from "./DynamicColumnLayout.styled";
import { useDynamicColumnLayout } from "./useDynamicColumnLayout";

export interface DynamicColumnLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DynamicColumnLayout: React.FC<DynamicColumnLayoutProps> = ({ children, className }) => {
  const items = React.Children.toArray(children);
  const { containerRef, itemRefs, columnCount, assignment } = useDynamicColumnLayout(items.length);

  return (
    <PageContainer ref={containerRef} className={className}>
      {Array.from({ length: columnCount }, (_, col) => (
        <Column key={col}>
          {items
            .map((child, i) => ({ child, i }))
            .filter(({ i }) => assignment[i] === col)
            .map(({ child, i }) => (
              <ItemWrap key={i} ref={(el) => { itemRefs.current[i] = el; }}>
                {child}
              </ItemWrap>
            ))}
        </Column>
      ))}
    </PageContainer>
  );
};

export default DynamicColumnLayout;
