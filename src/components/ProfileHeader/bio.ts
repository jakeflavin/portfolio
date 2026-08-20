import type { TypingStep } from '@/components/TypeWriter/typing'

/**
 * A take-back or a correction, sized from the words themselves.
 *
 * Backspacing only removes from the end, so every delete has to be an exact character
 * count - and a hand-counted number is wrong the moment a word in the copy changes. This
 * keeps the count and the text that produced it in one place.
 */
const unType = (text: string): TypingStep => ({ delete: text.length })

/**
 * The bio, typed the way it was actually written.
 *
 * Not a slideshow of finished sentences: a person typing, mistyping, catching it a beat
 * later, backspacing, and twice writing a whole line before deciding against it. The
 * mistakes are the ones you make on a real keyboard - transposed letters in a word your
 * fingers know, a doubled consonant - and each is caught while it is still the last thing
 * on the line, because that is the only kind of typo you can fix without retyping the
 * tail.
 *
 * The one structural edit is the middle: it goes down as a single comma-spliced sentence,
 * sits there a moment, and then gets taken out and set again as three short ones. That is
 * the edit the paragraph actually needed, so it is the one worth watching.
 */
export const BIO_SCRIPT: TypingStep[] = [
  { type: "Hi, I'm Jake." },
  { pause: 650 },

  // "build" transposed. The i-u swap is the one everybody makes in this word.
  { type: ' I biuld' },
  { pause: 480 },
  unType('biuld'),
  { type: 'build things on the internet for fun.' },
  { pause: 950 },

  // First take-back. Typed with a typo of its own, fixed, then dropped entirely.
  { type: ' I have no idae' },
  { pause: 420 },
  unType('idae'),
  { type: "idea what I'm doing." },
  { pause: 1500 },
  unType(" I have no idea what I'm doing."),
  { pause: 350 },

  // The middle, first as one long comma splice.
  { type: ' All apps are local, no accounts, nothign' },
  { pause: 460 },
  unType('nothign'),
  { type: 'nothing to sign up for.' },
  { pause: 1400 },

  // Then reconsidered: out it comes, and back in as three sentences that stop.
  unType(' All apps are local, no accounts, nothing to sign up for.'),
  { pause: 500 },
  { type: ' All apps are local. No accounts. Nothing to sign up for.' },
  { pause: 800 },

  { type: ' No data colletion.' },
  { pause: 440 },
  unType('letion.'),
  { type: 'lection.' },
  { pause: 620 },

  { type: ' No adds.' },
  { pause: 400 },
  unType('adds.'),
  { type: 'ads.' },
  { pause: 1600 },

  // Second take-back: the CV line, thought better of.
  { type: " I'm a full stack engineer. React, Java, Node." },
  { pause: 1500 },
  unType(" I'm a full stack engineer. React, Java, Node."),
  { pause: 400 },

  { type: ' My three kids are prematurely turning my hair gray.' },
  { pause: 1700 },
  unType(' My three kids are prematurely turning my hair gray.'),
]

/** Where the script lands once the editing is done. */
export const BIO_TEXT =
  "Hi, I'm Jake. I build things on the internet for fun. All apps are local. " +
  'No accounts. Nothing to sign up for. No data collection. No ads.'
