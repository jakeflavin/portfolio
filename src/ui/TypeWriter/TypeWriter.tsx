import React from "react";
import { Wrapper, Cursor } from "./TypeWriter.styled";
import { useTypeWriter } from "./useTypeWriter";

export interface TypeWriterProps {
  sentences: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  sentences,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseTime = 1200
}) => {
  const displayText = useTypeWriter({ sentences, typingSpeed, deletingSpeed, pauseTime });

  return (
    <Wrapper>
      {displayText}
      <Cursor>|</Cursor>
    </Wrapper>
  );
};

export default TypeWriter;
