import React from 'react'
import { Wrapper, Ghost, Live, Cursor } from './TypeWriter.styled'
import { useTypeWriter } from './useTypeWriter'
import { composeScript, type TypingStep } from './typing'

export interface TypeWriterProps {
  /** The keystrokes to play, mistakes and all. */
  script: TypingStep[]
  typingSpeed?: number
  deletingSpeed?: number
  /** How long the finished text rests before replaying. 0 leaves it up. */
  restartDelay?: number
  /** Varies keystroke timing so it reads as human. Turn off for deterministic tests. */
  jitter?: boolean
}

export function TypeWriter({
  script,
  typingSpeed = 55,
  deletingSpeed = 28,
  restartDelay = 6000,
  jitter = true,
}: TypeWriterProps) {
  const text = useTypeWriter({ script, typingSpeed, deletingSpeed, restartDelay, jitter })

  // The script's own settled text, so the reservation cannot drift from the copy.
  const settled = React.useMemo(() => composeScript(script), [script])

  return (
    <Wrapper>
      <Ghost aria-hidden="true" data-text={`${settled}|`} />
      <Live>
        {text}
        <Cursor>|</Cursor>
      </Live>
    </Wrapper>
  )
}
