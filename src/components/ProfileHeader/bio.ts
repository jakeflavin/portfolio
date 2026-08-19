import type { TypingStep } from '@/components/TypeWriter'

/**
 * The bio, written out live — typos, second thoughts and all.
 *
 * Backspacing only reaches the end of the line, so a typo is either caught on the spot or
 * costs you everything typed after it. That constraint is what makes the corrections read
 * as real rather than as an animation.
 */
export const BIO_SCRIPT: TypingStep[] = [
  { type: "Hi, I'm Jake." },
  { pause: 900 },

  // Transposed letters, caught immediately.
  { type: ' I biuld' },
  { pause: 420 },
  { delete: 5 },
  { type: 'build things for the web.' },
  { pause: 1100 },

  // Second thoughts: "things for the web" is vague, so that tail goes.
  { delete: 19 },
  { type: 'small, usefull' },
  { pause: 340 },
  { delete: 1 },
  { type: ' tools.' },
  { pause: 1200 },

  // A second sentence, tacked on.
  { type: ' I ship them, too.' },
  { pause: 1400 },

  // ", too" is doing nothing, so it goes.
  { delete: 6 },
  { type: '.' },
]

/** What the script settles on. Asserted in the tests so edits cannot drift the deletes. */
export const BIO_TEXT = "Hi, I'm Jake. I build small, useful tools. I ship them."
