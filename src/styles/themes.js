/**
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
  sm: "8px",
  md: "12px",
  lg: "16px",
  pill: "999px"
};

export const borderRadius = radii.md;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "40px"
};

/**
 * Breakpoints (min-width) for responsive layout.
 */
export const breakpoints = {
  sm: "600px",
  md: "750px",
  lg: "900px"
};

const createMediaQueries = (bps) => ({
  sm: `@media (min-width: ${bps.sm})`,
  md: `@media (min-width: ${bps.md})`,
  lg: `@media (min-width: ${bps.lg})`
});

/** The system stack, which is what Instagram and Threads both ship. */
const systemSans =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export const typography = {
  fontFamily: {
    heading: systemSans,
    body: systemSans,
    /**
     * Wordmark only. Currently the UI face; swap this one value for a custom
     * display font and the wordmark picks it up.
     */
    display: systemSans
  },
  heading: {
    weight: 600,
    tracking: "-0.01em",
    transform: "none"
  },
  typewriter: {
    size: "clamp(28px, 4.2vw, 40px)",
    tracking: "-0.035em",
    transform: "none"
  },
  card: {
    titleSize: "0.9375rem",
    titleTracking: "-0.01em",
    titleTransform: "none"
  },
  /** 14px body, with everything else close to it — both apps keep a very tight scale. */
  size: {
    xs: "0.75rem",
    sm: "0.8125rem",
    md: "0.875rem",
    lg: "0.9375rem",
    xl: "1.25rem"
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

/** Kept for API compatibility; surfaces are opaque in this language, so barely used. */
export const blur = {
  sm: "4px",
  md: "8px",
  lg: "12px"
};

/**
 * Instagram has no single brand colour — its identity is the gradient, running blue
 * through purple and pink into orange and gold.
 */
export const gradient = {
  stops: [
    "#405de6",
    "#5851db",
    "#833ab4",
    "#c13584",
    "#e1306c",
    "#fd1d1d",
    "#f77737",
    "#fcaf45"
  ],
  /** The logo sweep, used for the wordmark and accents. */
  brand:
    "linear-gradient(45deg, #405de6, #833ab4, #c13584, #e1306c, #fd1d1d, #f77737, #fcaf45)",
  /** The tighter three-stop version, for small surfaces like rings and bars. */
  compact: "linear-gradient(45deg, #833ab4, #e1306c, #fcaf45)"
};

/** Motion: short and unfussy. */
export const motion = {
  duration: { fast: "0.1s", normal: "0.15s", slow: "0.25s" },
  easing: "cubic-bezier(0.4, 0, 0.2, 1)"
};

/** Grid cell size. Fine enough to read as paper texture rather than as a layout grid. */
export const gridSize = "16px";

/** A faint grid — the one technical element in an otherwise plain surface. */
const gridBackground = (line, base) =>
  `linear-gradient(${line} 1px, transparent 1px) 0 0 / ${gridSize} ${gridSize}, ` +
  `linear-gradient(90deg, ${line} 1px, transparent 1px) 0 0 / ${gridSize} ${gridSize}, ` +
  base;

/**
 * Light palette, following Instagram: pure white page, #efefef control fills,
 * #737373 secondary text, #dbdbdb hairlines.
 */
export const lightTheme = {
  colors: {
    primary: "#262626",
    secondary: "#efefef",
    accent: "#0095f6",
    background: "#fafafa",
    surface: "#ffffff",
    surfaceGlass: "#ffffff",
    secondaryGlass: "#efefef",
    text: "#262626",
    muted: "#737373",
    border: "#dbdbdb",
    /** Lighter than `border`, for separating stacked content rather than outlining it. */
    divider: "#efefef",
    paper: "#fafafa",
    paperText: "#000000",
    paperMuted: "#737373",
    paperBorder: "#dbdbdb",
    success: "#1d7a37",
    warning: "#8a6100",
    danger: "#ed4956",
    inverse: "#262626",
    inverseText: "#fafafa",
    inverseHover: "rgba(255, 255, 255, 0.12)",
    inverseFocus: "rgba(255, 255, 255, 0.8)",
    focusBorder: "#0095f6",
    focusRing: "rgba(0, 149, 246, 0.28)",
    /**
     * Interactive text: hashtags and links. Darker than the action blue on purpose —
     * #0095f6 is only 3.17:1 on white, which fails AA for text this size.
     */
    link: "#0064c8",
    heart: "#ed4956"
  },
  radii,
  borderRadius,
  spacing,
  breakpoints,
  media: createMediaQueries(breakpoints),
  typography,
  blur,
  motion,
  gradient,
  /** Dividers and fills carry hierarchy; only overlays get elevation. */
  shadows: {
    sm: "none",
    md: "none",
    mdDown: "0 4px 16px rgba(0, 0, 0, 0.1)",
    focus: "0 0 0 2px rgba(0, 149, 246, 0.28)"
  },
  img: {
    brightness: "brightness(1)"
  },
  bodyBackground: gridBackground("rgba(0, 0, 0, 0.05)", "#fafafa")
};

/**
 * Dark palette, following Threads: #101010 rather than pure black, with #181818
 * surfaces and #262626 fills.
 */
export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#e8e8e8",
    secondary: "#262626",
    accent: "#0095f6",
    background: "#0f0f0f",
    surface: "#1a1a1a",
    surfaceGlass: "#1a1a1a",
    secondaryGlass: "#262626",
    text: "#e8e8e8",
    muted: "#a8a8a8",
    border: "#363636",
    divider: "#2a2a2a",
    paper: "#1a1a1a",
    paperText: "#e8e8e8",
    paperMuted: "#a8a8a8",
    paperBorder: "#363636",
    success: "#4bb563",
    warning: "#d9a441",
    danger: "#ff5a67",
    inverse: "#e8e8e8",
    inverseText: "#0f0f0f",
    inverseHover: "rgba(0, 0, 0, 0.12)",
    inverseFocus: "rgba(0, 0, 0, 0.8)",
    focusBorder: "#0095f6",
    focusRing: "rgba(0, 149, 246, 0.36)",
    link: "#4db2ff",
    heart: "#ff5a67"
  },
  shadows: {
    sm: "none",
    md: "none",
    mdDown: "0 4px 16px rgba(0, 0, 0, 0.6)",
    focus: "0 0 0 2px rgba(0, 149, 246, 0.36)"
  },
  img: {
    /* Takes the edge off the white-background placeholder art. Real screenshots will
       carry their own dark themes, at which point this can go back to 1. */
    brightness: "brightness(0.92)"
  },
  bodyBackground: gridBackground("rgba(255, 255, 255, 0.05)", "#0f0f0f")
};
