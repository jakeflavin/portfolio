import type { TypingStep } from '@/components/TypeWriter'

/**
 * The bio, written out live: typos, second thoughts and all.
 *
 * Backspacing only reaches the end of the line, so a typo is either caught on the spot or
 * costs you everything typed after it. That constraint is what makes the corrections read
 * as real rather than as an animation.
 *
 * The four sentences after the bio are typed out and then taken back. They are the things
 * you might say about yourself and then decide against, so each one is written in full,
 * held long enough to be read, and removed. Only the bio survives.
 */
export const BIO_SCRIPT: TypingStep[] = [
  { type: "Hi, I'm Jake." },
  { pause: 700 },

  // Transposed letters, caught immediately.
  { type: ' I biuld' },
  { pause: 420 },
  { delete: 5 },
  { type: 'build things on the internet for fun.' },
  { pause: 900 },

  { type: ' All apps are local. No accounts. Nothing to sign up for.' },
  { pause: 500 },
  { type: ' No data collection. No ads.' },
  { pause: 1600 },

  // Second thoughts, one at a time. The delete counts match the strings above them
  // exactly; the test plays the script rather than trusting that.
  { type: ' I have no idea what I am doing.' },
  { pause: 1500 },
  { delete: 32 },

  { type: " I'm a full stack engineer. React, Java, Node." },
  { pause: 1500 },
  { delete: 46 },

  { type: ' I have too many hobbies. Hiking, reading, running, random DIY, and now this site.' },
  { pause: 1800 },
  { delete: 82 },

  { type: ' My three kids are prematurely turning my hair gray.' },
  { pause: 1800 },
  { delete: 52 },
]

/** What the script settles on. Asserted in the tests so edits cannot drift the deletes. */
export const BIO_TEXT =
  "Hi, I'm Jake. I build things on the internet for fun. All apps are local. " +
  'No accounts. Nothing to sign up for. No data collection. No ads.'
