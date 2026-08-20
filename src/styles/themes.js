/**
 * EXPERIMENT: the grid background, the surfaces and all elevation are switched off here,
 * so the whole thing is flat. Kept in the tokens rather than the components so it is a
 * single revert. Hairline outlines remain.
 *
 * Design tokens.
 *
 * Visual language follows Instagram and Threads:
 *  - one flat surface, not a stack of nested cards; separation comes from hairline
 *    dividers and whitespace rather than borders, shadows or elevation
 *  - the system sans stack, small tight type, 14px body
 *  - near-monochrome, with a single blue reserved for focus and links
 *
 * The only technical flourish is a faint grid on the page background.
 *
 * Use semantic names only (no component-specific tokens).
 */

/** Corner radii. Media and controls are softer than containers, as in both apps. */
export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  pill: '999px',
}

export const borderRadius = radii.md

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
}

/**
 * Breakpoints (min-width) for responsive layout.
 */
export const breakpoints = {
  sm: '600px',
  md: '750px',
  lg: '900px',
}

/**
 * The one query the layout actually has.
 *
 * Everything inside the app sits in a single column that stops growing at 520px, so above
 * that width the viewport can change all it likes and the space these components are laid
 * out in does not. Asking the viewport was the source of the jumping: the measure froze
 * at about 470px of viewport, and then the type and the avatar and the sort field each
 * changed again at 600 and at 750 for no reason the reader could see.
 *
 * 440px is the content width of the full measure less a margin - a phone is at most about
 * 390px of content, and the measure is 480 - so it separates the two states the layout
 * genuinely has, and nothing moves once the column is at its width.
 */
export const wideQuery = '@container app (min-width: 440px)'

const createMediaQueries = (bps) => ({
  sm: `@media (min-width: ${bps.sm})`,
  md: `@media (min-width: ${bps.md})`,
  lg: `@media (min-width: ${bps.lg})`,
})

/** The system stack, which is what Instagram and Threads both ship. */
const systemSans =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

export const typography = {
  fontFamily: {
    heading: systemSans,
    body: systemSans,
    /**
     * Wordmark only. Currently the UI face; swap this one value for a custom
     * display font and the wordmark picks it up.
     */
    display: systemSans,
  },
  heading: {
    weight: 600,
    tracking: '-0.01em',
    transform: 'none',
  },
  typewriter: {
    /* The typewriter is the profile bio now, not a display headline. */
    size: '0.875rem',
    tracking: '0',
    transform: 'none',
  },
  card: {
    titleSize: '0.9375rem',
    titleTracking: '-0.01em',
    titleTransform: 'none',
  },
  /** 14px body, with everything else close to it — both apps keep a very tight scale. */
  size: {
    xs: '0.75rem',
    sm: '0.8125rem',
    md: '0.875rem',
    lg: '0.9375rem',
    xl: '1.25rem',
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

/** Kept for API compatibility; surfaces are opaque in this language, so barely used. */
export const blur = {
  sm: '4px',
  md: '8px',
  lg: '12px',
}

/**
 * The identity gradient: ultramarine into ember, borrowed from Rova.
 *
 * Rova states it in two stops — its accent at one end, the fourth step of its intensity
 * ramp at the other — and lets the sweep find its own way between them. The three stops
 * here are the points that sweep actually passes through, so this renders identically to
 * Rova's while keeping five named values. On the way it crosses a plum that belongs to
 * neither end, which is what stops it reading as two colours stuck together.
 *
 * This replaces a teal-through-violet sweep that was cool the whole way, chosen to avoid
 * reading as Instagram's warm arc. Half of this one is warm, so that argument is partly
 * given up — but Instagram's mark is pink-dominant with no blue in it at all, and this is
 * blue for most of its length. The ring's *shape* was always the closer borrowing.
 */
export const gradient = {
  stops: ['#2244D8', '#4A42A9', '#72407A', '#9B3E4B', '#C33C1C'],
  /** The full sweep, for the wordmark and the avatar ring. */
  brand: 'linear-gradient(45deg, #2244D8, #4A42A9, #72407A, #9B3E4B, #C33C1C)',
  /**
   * The tighter three-stop version, for small surfaces like rings and bars.
   *
   * Horizontal rather than diagonal on purpose: a 45deg sweep running dark at one corner
   * to light at the opposite one reads as a lit sphere on a circle, which is where the
   * bevelled look came from.
   */
  compact: 'linear-gradient(to right, #2244D8, #72407A, #C33C1C)',
  /**
   * The appearance toggle's gradient: one half of the sweep above, not a colour of its own.
   *
   * It has to tell itself apart from the five links beside it without looking imported —
   * an unrelated pair read as bolted on. Halving the brand sweep does both: the cool half
   * is entirely cool and the warm half entirely warm, so neither can be mistaken for the
   * full blue-to-ember run the links wear, and every colour in them is already ours.
   *
   * Which half is showing previews the mode it would switch you to, so the chip turns warm
   * as it offers daylight. Both halves carry white, at 7.28:1 and 5.27:1 across their own
   * sweeps, which is why the toggle keeps the same ink as everything else in the row.
   */
  toggle: {
    /** Offers dark mode: the sweep from its start to the plum at its middle. */
    night: 'linear-gradient(to right, #2244D8, #72407A)',
    /** Offers light mode: the plum on to the ember it finishes at. */
    dawn: 'linear-gradient(to right, #72407A, #C33C1C)',
  },
}

/**
 * The same sweep, for text.
 *
 * Clipping a gradient to text makes every colour along it a foreground colour — not just
 * the stops, which are the easy part. Both of these are measured across the whole sweep at
 * 240 points, and the worst point is what is quoted.
 *
 * Light needs no adjustment at all: Rova's colours are a *ground* carrying white, so they
 * are already dark enough to be ink on a near-white page. Worst point 5.05:1.
 *
 * Dark does. Every stop is lifted 27.7% of the way to white, which is the least that keeps
 * the whole sweep clear — the dip is between the first two stops, not at either of them.
 * Worst point 4.55:1, with the hues held to within 0.6 degrees of the ground version.
 */
export const textGradientLight = 'linear-gradient(to right, #2244D8, #72407A, #C33C1C)'

export const textGradientDark = 'linear-gradient(to right, #4676FF, #A06BA8, #EF6546)'

/** Motion: short and unfussy. */
export const motion = {
  duration: { fast: '0.1s', normal: '0.15s', slow: '0.25s' },
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
}

/** Grid cell size. Fine enough to read as paper texture rather than as a layout grid. */
export const gridSize = '16px'

/**
 * A faint grid — the one technical element in an otherwise plain surface.
 *
 * Unused while the flat experiment is in place; kept so reverting it is a one-line change
 * back to `gridBackground(...)` in bodyBackground.
 */
// eslint-disable-next-line no-unused-vars
const gridBackground = (line, base) =>
  `linear-gradient(${line} 1px, transparent 1px) 0 0 / ${gridSize} ${gridSize}, ` +
  `linear-gradient(90deg, ${line} 1px, transparent 1px) 0 0 / ${gridSize} ${gridSize}, ` +
  base

/**
 * Light palette, following Instagram: pure white page, #efefef control fills,
 * #737373 secondary text, #dbdbdb hairlines.
 */
export const lightTheme = {
  colors: {
    primary: '#262626',
    secondary: '#efefef',
    accent: '#2563eb',
    background: 'var(--bg)',
    surface: '#fafafa',
    surfaceGlass: '#fafafa',
    secondaryGlass: '#efefef',
    text: 'var(--text)',
    muted: '#737373',
    border: '#dbdbdb',
    /**
     * Transparent while the flat experiment is in place. Every outline in the app is
     * drawn with this, so one value switches them all off. Revert to "#efefef".
     */
    divider: 'transparent',
    paper: '#fafafa',
    paperText: '#000000',
    paperMuted: '#737373',
    paperBorder: '#dbdbdb',
    success: '#1d7a37',
    warning: '#8a6100',
    danger: '#e11d48',
    inverse: '#262626',
    inverseText: '#fafafa',
    inverseHover: 'rgba(255, 255, 255, 0.12)',
    inverseFocus: 'rgba(255, 255, 255, 0.8)',
    focusBorder: '#2563eb',
    focusRing: 'rgba(37, 99, 235, 0.28)',
    /**
     * Interactive text: links. Darker than the action blue on purpose — the action blue
     * is only 4.95:1 and that is the whole budget, with nothing left for a hover state.
     */
    link: '#1d4ed8',
    heart: '#e11d48',
  },
  radii,
  borderRadius,
  spacing,
  breakpoints,
  media: createMediaQueries(breakpoints),
  query: { wide: wideQuery },
  typography,
  blur,
  motion,
  gradient: { ...gradient, text: textGradientLight },
  /** Dividers and fills carry hierarchy; overlays and the hero panel get elevation. */
  shadows: {
    sm: 'none',
    md: 'none',
    raised: 'none',
    hover: 'none',
    /* The sort dropdown's only means of separating itself from the page. */
    mdDown: '0 4px 16px rgba(0, 0, 0, 0.16)',
    focus: '0 0 0 2px rgba(37, 99, 235, 0.28)',
  },
  img: {
    brightness: 'brightness(1)',
  },
  bodyBackground: 'var(--bg)',
}

/**
 * Dark palette, following Threads: #101010 rather than pure black, with #181818
 * surfaces and #262626 fills.
 */
export const darkTheme = {
  ...lightTheme,
  gradient: { ...gradient, text: textGradientDark },
  colors: {
    ...lightTheme.colors,
    primary: '#e8e8e8',
    secondary: '#262626',
    accent: '#60a5fa',
    background: 'var(--bg)',
    surface: '#0f0f0f',
    surfaceGlass: '#0f0f0f',
    secondaryGlass: '#262626',
    text: 'var(--text)',
    muted: '#a8a8a8',
    border: '#363636',
    divider: 'transparent',
    paper: '#1a1a1a',
    paperText: '#e8e8e8',
    paperMuted: '#a8a8a8',
    paperBorder: '#363636',
    success: '#4bb563',
    warning: '#d9a441',
    danger: '#fb7185',
    inverse: '#e8e8e8',
    inverseText: '#0f0f0f',
    inverseHover: 'rgba(0, 0, 0, 0.12)',
    inverseFocus: 'rgba(0, 0, 0, 0.8)',
    focusBorder: '#60a5fa',
    focusRing: 'rgba(96, 165, 250, 0.36)',
    link: '#93c5fd',
    heart: '#fb7185',
  },
  shadows: {
    sm: 'none',
    md: 'none',
    raised: 'none',
    hover: 'none',
    mdDown: '0 4px 20px rgba(0, 0, 0, 0.7)',
    focus: '0 0 0 2px rgba(96, 165, 250, 0.36)',
  },
  img: {
    brightness: 'brightness(1)',
  },
  bodyBackground: 'var(--bg)',
}
