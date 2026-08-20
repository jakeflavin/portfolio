import type { TypingStep } from '@/components/TypeWriter'

/**
 * The bio, written out live — typos, second thoughts and all.
 *
 * Backspacing only reaches the end of the line, so a typo is either caught on the spot or
 * costs you everything typed after it. That constraint is what makes the corrections read
 * as real rather than as an animation.
 *
 * Two corrections across the paragraph, and no more. Over fifty characters a stumble reads
 * as human; over two hundred, one every other clause reads as a gimmick — so the rest is
 * typed clean and the pauses between sentences do the work instead.
 */
export const BIO_SCRIPT: TypingStep[] = [
  { type: "Hi, I'm Jake." },
  { pause: 700 },

  // Transposed letters, caught immediately.
  { type: ' I biuld' },
  { pause: 380 },
  { delete: 5 },
  { type: 'build small, useful tools' },
  { pause: 700 },

  // The qualifier arrives as an afterthought, which is how it reads.
  { type: ' — one job each, no accounts, nothing to sign up for.' },
  { pause: 900 },

  { type: ' Eight of them are on this page, source and all.' },
  { pause: 900 },

  // A second thought, and the honest one: the tools that get abandoned are the ones that
  // were never for you in the first place.
  { type: ' I ship them, then forget' },
  { pause: 520 },
  { delete: 6 },
  { type: 'keep using them.' },
]

/** What the script settles on. Asserted in the tests so edits cannot drift the deletes. */
export const BIO_TEXT =
  "Hi, I'm Jake. I build small, useful tools — one job each, no accounts, nothing to sign " +
  'up for. Eight of them are on this page, source and all. I ship them, then keep using ' +
  'them.'
