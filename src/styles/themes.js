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
    body: systemSans
  },
  heading: {
    weight: 600,
    tracking: "-0.01em",
    transform: "none"
  },
  typewriter: {
    size: "clamp(30px, 5vw, 46px)",
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

/** Motion: short and unfussy. */
export const motion = {
  duration: { fast: "0.1s", normal: "0.15s", slow: "0.25s" },
  easing: "cubic-bezier(0.4, 0, 0.2, 1)"
};

/** A faint 32px grid — the one technical element in an otherwise plain surface. */
const gridBackground = (line, base) =>
  `linear-gradient(${line} 1px, transparent 1px) 0 0 / 32px 32px, ` +
  `linear-gradient(90deg, ${line} 1px, transparent 1px) 0 0 / 32px 32px, ` +
  base;

/**
 * Light palette, following Instagram: pure white page, #efefef control fills,
 * #737373 secondary text, #dbdbdb hairlines.
 */
export const lightTheme = {
  colors: {
    primary: "#000000",
    secondary: "#efefef",
    accent: "#0095f6",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceGlass: "#ffffff",
    secondaryGlass: "#efefef",
    text: "#000000",
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
    inverse: "#000000",
    inverseText: "#ffffff",
    inverseHover: "rgba(255, 255, 255, 0.12)",
    inverseFocus: "rgba(255, 255, 255, 0.8)",
    focusBorder: "#0095f6",
    focusRing: "rgba(0, 149, 246, 0.28)",
    /** Caption links and hashtags — deliberately subtler than the action blue. */
    link: "#00376b",
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
  bodyBackground: gridBackground("rgba(0, 0, 0, 0.04)", "#ffffff")
};

/**
 * Dark palette, following Threads: #101010 rather than pure black, with #181818
 * surfaces and #262626 fills.
 */
export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#f3f5f7",
    secondary: "#262626",
    accent: "#0095f6",
    background: "#101010",
    surface: "#181818",
    surfaceGlass: "#181818",
    secondaryGlass: "#262626",
    text: "#f3f5f7",
    muted: "#777777",
    border: "#2e2e2e",
    divider: "#242424",
    paper: "#181818",
    paperText: "#f3f5f7",
    paperMuted: "#777777",
    paperBorder: "#2e2e2e",
    success: "#4bb563",
    warning: "#d9a441",
    danger: "#ff5a67",
    inverse: "#f3f5f7",
    inverseText: "#101010",
    inverseHover: "rgba(0, 0, 0, 0.12)",
    inverseFocus: "rgba(0, 0, 0, 0.8)",
    focusBorder: "#0095f6",
    focusRing: "rgba(0, 149, 246, 0.36)",
    link: "#e0f1ff",
    heart: "#ff5a67"
  },
  shadows: {
    sm: "none",
    md: "none",
    mdDown: "0 4px 16px rgba(0, 0, 0, 0.6)",
    focus: "0 0 0 2px rgba(0, 149, 246, 0.36)"
  },
  img: {
    brightness: "brightness(1)"
  },
  bodyBackground: gridBackground("rgba(255, 255, 255, 0.045)", "#101010")
};
