/**
 * Design tokens.
 *
 * Visual language follows Instagram/Threads: a near-monochrome palette, the system sans
 * stack, 1px hairline borders instead of shadows, and generous whitespace. The only
 * technical flourish is a faint grid on the page background.
 *
 * Use semantic names only (no component-specific tokens).
 */

export const borderRadius = "16px";

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
    weight: 700,
    tracking: "-0.02em",
    transform: "none"
  },
  typewriter: {
    size: "clamp(24px, 3.6vw, 38px)",
    tracking: "-0.02em",
    transform: "none"
  },
  card: {
    titleSize: "1rem",
    titleTracking: "-0.01em",
    titleTransform: "none"
  },
  /** Type scale. Sizes were previously hardcoded across styled files. */
  size: {
    xs: "0.6875rem",
    sm: "0.75rem",
    md: "0.875rem",
    lg: "1rem",
    xl: "1.25rem"
  }
};

/**
 * Blur strength. Kept low and mostly decorative — surfaces are opaque in this language,
 * so borders rather than glass carry the hierarchy.
 */
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
 * Semantic color palette. Near-monochrome: hierarchy comes from text weight and hairline
 * borders, not from colour or elevation.
 */
export const lightTheme = {
  colors: {
    primary: "#0a0a0a",
    secondary: "#fafafa",
    accent: "#737373",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceGlass: "#ffffff",
    secondaryGlass: "#fafafa",
    text: "#0a0a0a",
    muted: "#737373",
    border: "#dbdbdb",
    paper: "#fafafa",
    paperText: "#0a0a0a",
    paperMuted: "#737373",
    paperBorder: "#dbdbdb",
    success: "#1d7a37",
    warning: "#8a6100",
    danger: "#ed4956",
    inverse: "#0a0a0a",
    inverseText: "#ffffff",
    inverseHover: "rgba(255, 255, 255, 0.12)",
    inverseFocus: "rgba(255, 255, 255, 0.8)",
    focusBorder: "#0a0a0a",
    focusRing: "rgba(0, 0, 0, 0.1)",
    heart: "#ed4956"
  },
  borderRadius,
  spacing,
  breakpoints,
  media: createMediaQueries(breakpoints),
  typography,
  blur,
  motion,
  /** Hairlines do the work; shadows stay almost invisible. */
  shadows: {
    sm: "none",
    md: "none",
    mdDown: "0 2px 8px rgba(0, 0, 0, 0.06)",
    focus: "0 0 0 2px rgba(0, 0, 0, 0.1)"
  },
  img: {
    brightness: "brightness(1)"
  },
  bodyBackground: gridBackground("rgba(0, 0, 0, 0.045)", "#ffffff")
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#f5f5f5",
    secondary: "#121212",
    accent: "#8e8e8e",
    background: "#000000",
    surface: "#0a0a0a",
    surfaceGlass: "#0a0a0a",
    secondaryGlass: "#121212",
    text: "#f5f5f5",
    muted: "#8e8e8e",
    border: "#262626",
    paper: "#121212",
    paperText: "#f5f5f5",
    paperMuted: "#8e8e8e",
    paperBorder: "#262626",
    success: "#4bb563",
    warning: "#d9a441",
    danger: "#ff5a67",
    inverse: "#f5f5f5",
    inverseText: "#000000",
    inverseHover: "rgba(0, 0, 0, 0.12)",
    inverseFocus: "rgba(0, 0, 0, 0.8)",
    focusBorder: "#f5f5f5",
    focusRing: "rgba(255, 255, 255, 0.16)",
    heart: "#ff5a67"
  },
  shadows: {
    sm: "none",
    md: "none",
    mdDown: "0 2px 8px rgba(0, 0, 0, 0.5)",
    focus: "0 0 0 2px rgba(255, 255, 255, 0.16)"
  },
  img: {
    brightness: "brightness(0.95)"
  },
  bodyBackground: gridBackground("rgba(255, 255, 255, 0.05)", "#000000")
};
