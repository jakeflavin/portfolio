/**
 * The photos the avatar can be, and the pick made on load.
 *
 * A fixed list rather than a directory read: these are the only three, they ship in
 * `public/`, and a build-time glob would put the choice in the bundler's hands rather
 * than here where it can be tested.
 */
export interface Avatar {
  src: string
  /** What is in the photo, for anyone who cannot see it. */
  alt: string
}

export const AVATARS: Avatar[] = [
  {
    src: '/images/avatars/jake-kids-of-steel.jpg',
    alt: 'Jake and his daughter at the Kids of Steel race',
  },
  {
    src: '/images/avatars/jake-marathon.jpg',
    alt: 'Jake flexing at the finish of the Pittsburgh Marathon',
  },
  {
    src: '/images/avatars/jake-castle.jpg',
    alt: 'Jake in front of Cinderella Castle at Walt Disney World',
  },
]

/**
 * One of them, at random.
 *
 * `random` is a parameter so a test can pin it. Called once per mount rather than per
 * render, so the face does not change while the page is open.
 */
export function pickAvatar(random: () => number = Math.random): Avatar | undefined {
  if (AVATARS.length === 0) return undefined
  return AVATARS[Math.floor(random() * AVATARS.length)]
}
