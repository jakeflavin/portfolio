import { useEffect, useState } from "react";
import { isDelete, isType, type TypingStep } from "./typing";

interface UseTypeWriterOptions {
  script: TypingStep[];
  typingSpeed: number;
  deletingSpeed: number;
  /** How long the finished text rests before the script replays. 0 leaves it up. */
  restartDelay: number;
  /** Varies each keystroke's delay so the rhythm reads as human. Off in tests. */
  jitter: boolean;
}

/** Real typing is uneven; a fixed interval reads as a machine. */
const withJitter = (delay: number, jitter: boolean) =>
  jitter ? Math.round(delay * (0.55 + Math.random() * 0.9)) : delay;

export function useTypeWriter({
  script,
  typingSpeed,
  deletingSpeed,
  restartDelay,
  jitter
}: UseTypeWriterOptions): string {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const step = script[stepIndex];

    // Script finished.
    if (!step) {
      if (restartDelay <= 0) return;
      const id = setTimeout(() => {
        setText("");
        setProgress(0);
        setStepIndex(0);
      }, restartDelay);
      return () => clearTimeout(id);
    }

    const advance = () => {
      setProgress(0);
      setStepIndex((index) => index + 1);
    };

    if (isType(step)) {
      // A zero-length step would otherwise stall the script.
      if (step.type.length === 0) {
        advance();
        return;
      }
      const id = setTimeout(() => {
        const character = step.type[progress];
        setText((previous) => previous + character);
        if (progress + 1 >= step.type.length) advance();
        else setProgress(progress + 1);
      }, withJitter(typingSpeed, jitter));
      return () => clearTimeout(id);
    }

    if (isDelete(step)) {
      if (step.delete <= 0) {
        advance();
        return;
      }
      const id = setTimeout(() => {
        setText((previous) => previous.slice(0, -1));
        if (progress + 1 >= step.delete) advance();
        else setProgress(progress + 1);
      }, withJitter(deletingSpeed, jitter));
      return () => clearTimeout(id);
    }

    const id = setTimeout(advance, step.pause);
    return () => clearTimeout(id);
  }, [script, stepIndex, progress, typingSpeed, deletingSpeed, restartDelay, jitter]);

  return text;
}
