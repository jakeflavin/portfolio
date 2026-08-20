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
/**
 * The height of a control in the search row - the field, the sort trigger, and the
 * marquee that mirrors them at the foot of the page.
 *
 * Named because three places have to agree on it. It was written out three times, which
 * is three chances for two of them to drift and nobody to notice.
 */
export const sizes = {
  control: '38px',
}

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
/**
 * The brand's five stops, as drawn: ultramarine into ember.
 *
 * These are what the sweep looks like on a dark ground, where a saturated mid-tone reads
 * as colour. On a light page the same five read as a heavy band, because the page is
 * lighter than every one of them - so the light theme uses a set lifted toward white until
 * white type sits on each at about 5.2:1.
 *
 * That number is the constraint rather than a preference: the story circles carry white
 * glyphs and the footer's marquee carries white text, so how far these can be lifted is
 * decided by the ink on top of them.
 */
export const brandStops = ['#2244D8', '#4A42A9', '#72407A', '#9B3E4B', '#C33C1C']

/** The same five, lifted for a light page. Each holds white at about 5.2:1. */
export const brandStopsLight = ['#4562DE', '#6962B8', '#885E8F', '#A6535F', '#C43E1E']

/**
 * The shapes the gradient is used in, built from whichever stops a theme carries.
 *
 * One function rather than two copies of five strings: the shapes are identical in both
 * themes and only the stops differ, and a second literal copy is somewhere for one of them
 * to drift away from the other.
 */
const gradientsFrom = (stops) => ({
  stops,
  /** The full sweep, for the wordmark, the avatar ring and the footer's marquee. */
  brand: `linear-gradient(45deg, ${stops.join(', ')})`,
  /**
   * The tighter three-stop version, for small surfaces like rings and bars.
   *
   * Horizontal rather than diagonal on purpose: a 45deg sweep running dark at one corner
   * to light at the opposite one reads as a lit sphere on a circle, which is where the
   * bevelled look came from.
   */
  compact: `linear-gradient(to right, ${stops[0]}, ${stops[2]}, ${stops[4]})`,
  /**
   * The appearance toggle's gradient: one half of the sweep above, not a colour of its own.
   *
   * It has to tell itself apart from the five links beside it without looking imported —
   * an unrelated pair read as bolted on. Halving the brand sweep does both: the cool half
   * is entirely cool and the warm half entirely warm, so neither can be mistaken for the
   * full blue-to-ember run the links wear, and every colour in them is already ours.
   *
   * Which half is showing previews the mode it would switch you to, so the chip turns warm
   * as it offers daylight.
   */
  toggle: {
    /** Offers dark mode: the sweep from its start to the plum at its middle. */
    night: `linear-gradient(to right, ${stops[0]}, ${stops[2]})`,
    /** Offers light mode: the plum on to the ember it finishes at. */
    dawn: `linear-gradient(to right, ${stops[2]}, ${stops[4]})`,
  },
})

export const gradient = gradientsFrom(brandStops)
export const gradientLight = gradientsFrom(brandStopsLight)

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

export const textGradientDark = 'linear-gradient(to right, #7C9BFF, #BE8CC6, #FF9878)'

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
 * Light palette.
 *
 * It followed Instagram's - a white page, #efefef fills, #737373 secondary text - and the
 * secondary text is the reason it changed. #737373 was drawn for a pure white page, where
 * it gives 4.6:1; on this one it gave 4.54, which passes and leaves nothing over. It is
 * most of the running text on the page: every description, every date, the bio, the stat
 * labels. It is #5f6570 now, at 5.5 against the page.
 *
 * The neutrals carry a faint blue bias, from the cool end of the site's own gradient.
 */
export const lightTheme = {
  colors: {
    primary: '#2b2f36',
    secondary: '#e9ebef',
    accent: '#2563eb',
    background: 'var(--bg)',
    /* Flush with the ground, as before: nothing in this language is a raised panel. */
    surface: '#f6f7f9',
    surfaceGlass: '#f6f7f9',
    secondaryGlass: '#e9ebef',
    text: 'var(--text)',
    muted: '#5f6570',
    border: '#dfe2e8',
    /**
     * Transparent while the flat experiment is in place. Every outline in the app is
     * drawn with this, so one value switches them all off. Revert to "#efefef".
     */
    divider: 'transparent',
    paper: '#f6f7f9',
    paperText: '#2b2f36',
    paperMuted: '#5f6570',
    paperBorder: '#dfe2e8',
    success: '#1d7a37',
    warning: '#8a6100',
    danger: '#e11d48',
    inverse: '#2b2f36',
    inverseText: '#f6f7f9',
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
  sizes,
  breakpoints,
  media: createMediaQueries(breakpoints),
  query: { wide: wideQuery },
  typography,
  blur,
  motion,
  gradient: { ...gradientLight, text: textGradientLight },
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
 * Dark palette.
 *
 * Lifted off near-black: the ground was #0f0f0f under #e8e8e8 ink, which is 15.6:1 and
 * reads as a hole in the screen rather than as a page. #17181b under #dcdee3 is 13.2, and
 * the secondary text comes down with it - 8:1 was brighter than a secondary should be, so
 * it no longer competes with the text it sits under.
 */
export const darkTheme = {
  ...lightTheme,
  gradient: { ...gradient, text: textGradientDark },
  colors: {
    ...lightTheme.colors,
    primary: '#dcdee3',
    secondary: '#2a2d33',
    accent: '#60a5fa',
    background: 'var(--bg)',
    /* Flush with the ground, as in the light theme. */
    surface: '#17181b',
    surfaceGlass: '#17181b',
    secondaryGlass: '#2a2d33',
    text: 'var(--text)',
    muted: '#9aa0aa',
    border: '#33363d',
    divider: 'transparent',
    paper: '#17181b',
    paperText: '#dcdee3',
    paperMuted: '#9aa0aa',
    paperBorder: '#33363d',
    success: '#4bb563',
    warning: '#d9a441',
    danger: '#fb7185',
    inverse: '#dcdee3',
    inverseText: '#17181b',
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
