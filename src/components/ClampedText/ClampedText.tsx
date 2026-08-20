import React, { useEffect, useRef, useState } from 'react'
import { Wrap, Text, More } from './ClampedText.styled'

export interface ClampedTextProps {
  children: string
  /** How many lines before it is cut. */
  lines?: number
  /**
   * The colour behind the text, which lets the control sit on the last line under a fade.
   * Omit where the background changes - on hover, say - and the control takes its own line.
   */
  fade?: string
  /** Lets a consumer restyle the paragraph with `styled(ClampedText)`. */
  className?: string
}

/**
 * A description cut to a few lines, with a control to see the rest - and no control at
 * all when the text already fits.
 *
 * The measurement is the reason this is shared rather than copied. Whether the text
 * overflows depends on the width it is set at, so it has to be measured in the DOM and
 * re-measured when that width changes; a second hand-rolled copy of that in the list view
 * is a second place for it to be subtly wrong.
 */
export function ClampedText({ children, lines = 2, fade, className }: ClampedTextProps) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (expanded) return
    const element = ref.current
    if (!element) return

    const measure = () => setOverflows(element.scrollHeight > element.clientHeight + 1)
    measure()

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [children, expanded])

  return (
    <Wrap className={className}>
      <Text ref={ref} $clamped={!expanded} $lines={lines}>
        {children}
      </Text>
      {(overflows || expanded) && (
        <More
          type="button"
          $inline={!expanded}
          $fade={fade}
          onClick={() => setExpanded((previous) => !previous)}
        >
          {expanded ? 'less' : '… more'}
        </More>
      )}
    </Wrap>
  )
}
