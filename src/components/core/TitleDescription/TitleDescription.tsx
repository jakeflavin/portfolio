import React from "react";
import { Wrapper, Title, Description } from "./TitleDescription.styled";

export interface TitleDescriptionProps {
  /** Heading text */
  title: string;
  /** Body text shown in muted color */
  description: string;
  /** Optional class name for the wrapper */
  className?: string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  description,
  className
}) => {
  return (
    <Wrapper className={className}>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Wrapper>
  );
};

export default TitleDescription;
