import React, { useEffect, useState } from "react";
import { Wrapper, Cursor } from "./TypeWriter.styled";

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
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentSentence = sentences[sentenceIndex];
  const isLastSentence = sentenceIndex === sentences.length - 1;

  useEffect(() => {
    if (!currentSentence) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      // typing forward
      if (displayText.length < currentSentence.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentSentence.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // full sentence typed
        if (isLastSentence) return;

        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      // deleting backward
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentSentence.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setSentenceIndex((prev) => prev + 1);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    sentenceIndex,
    currentSentence,
    typingSpeed,
    deletingSpeed,
    pauseTime,
    isLastSentence
  ]);

  return (
    <Wrapper>
      {displayText}
      <Cursor>|</Cursor>
    </Wrapper>
  );
};

export default TypeWriter;