import { useEffect, useState } from "react";

interface UseTypeWriterOptions {
  sentences: string[];
  typingSpeed: number;
  deletingSpeed: number;
  pauseTime: number;
}

export function useTypeWriter({
  sentences,
  typingSpeed,
  deletingSpeed,
  pauseTime
}: UseTypeWriterOptions): string {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentSentence = sentences[sentenceIndex];
  const isLastSentence = sentenceIndex === sentences.length - 1;

  useEffect(() => {
    if (!currentSentence) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!isDeleting && displayText.length < currentSentence.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentSentence.slice(0, displayText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && !isLastSentence) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentSentence.slice(0, displayText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting) {
      setIsDeleting(false);
      setSentenceIndex((prev) => prev + 1);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [
    currentSentence,
    deletingSpeed,
    displayText,
    isDeleting,
    isLastSentence,
    pauseTime,
    typingSpeed
  ]);

  return displayText;
}
