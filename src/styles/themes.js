/**
 * Design tokens: shared values for layout and appearance.
 * Liquid Glass aesthetic: translucent layers, blur, soft edge lighting, physics-informed motion.
 * Use semantic names only (no component-specific tokens).
 */

export const borderRadius = "18px";

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px"
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

export const typography = {
  fontFamily: {
    heading: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    body: '"Inter", system-ui, -apple-system, sans-serif'
  }
};

/** Blur strength for glass layers (heavier elevation = stronger blur). */
export const blur = {
  sm: "8px",
  md: "16px",
  lg: "24px"
};

/** Motion: elastic/settle timing for hierarchy and focus changes. */
export const motion = {
  duration: { fast: "0.2s", normal: "0.3s", slow: "0.4s" },
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
};

/**
 * Semantic color palette. Use primary/secondary/surface for hierarchy; inverse* for content on dark (e.g. buttons).
 * surfaceGlass/secondaryGlass: translucent variants for backdrop-filter glass layers.
 */
export const lightTheme = {
  colors: {
    primary: "#223631",
    secondary: "#f0f0f0",
    accent: "#2a4a3a",
    background: "#f5f5f7",
    surface: "#ffffff",
    surfaceGlass: "rgba(255, 255, 255, 0.72)",
    secondaryGlass: "rgba(245, 245, 247, 0.65)",
    text: "#1a1a1a",
    muted: "#6b6b6b",
    border: "rgba(0, 0, 0, 0.08)",
    inverse: "#1a1a1a",
    inverseText: "rgba(255, 255, 255, 0.92)",
    inverseHover: "rgba(255, 255, 255, 0.1)",
    inverseFocus: "rgba(255, 255, 255, 0.75)",
    focusBorder: "#8e8e8e",
    focusRing: "rgba(0, 0, 0, 0.12)"
  },
  borderRadius,
  spacing,
  breakpoints,
  media: createMediaQueries(breakpoints),
  typography,
  blur,
  motion,
  /** Softer, diffused shadows for molded material feel. */
  shadows: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.04)",
    md: "0 8px 24px rgba(0, 0, 0, 0.06)",
    mdDown: "0 12px 28px rgba(0, 0, 0, 0.07)",
    focus: "0 0 0 3px rgba(0, 0, 0, 0.12)"
  },
  img: {
    brightness: "brightness(1.0)"
  },
  /** Body background gradient (light mode). Used in globalStyles. */
  bodyBackground:
    "linear-gradient(180deg, #f6f6f4 0%, #ecebe7 50%, #e8e6e2 100%)"
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#5e7c3c",
    secondary: "#2a2a2a",
    accent: "#d4d4d4",
    background: "#0d0d0d",
    surface: "#1a1a1a",
    surfaceGlass: "rgba(26, 26, 26, 0.72)",
    secondaryGlass: "rgba(42, 42, 42, 0.65)",
    text: "#fafafa",
    muted: "#a3a3a3",
    border: "rgba(255, 255, 255, 0.08)",
    inverse: "#141414",
    inverseText: "rgba(255, 255, 255, 0.92)",
    inverseHover: "rgba(255, 255, 255, 0.1)",
    inverseFocus: "rgba(255, 255, 255, 0.75)",
    focusBorder: "#737373",
    focusRing: "rgba(255, 255, 255, 0.15)"
  },
  shadows: {
    sm: "0 2px 12px rgba(0, 0, 0, 0.28)",
    md: "0 8px 28px rgba(0, 0, 0, 0.35)",
    mdDown: "0 12px 32px rgba(0, 0, 0, 0.38)",
    focus: "0 0 0 3px rgba(255, 255, 255, 0.18)"
  },
  img: {
    brightness: "brightness(0.85)"
  },
  /** Body background gradient (dark mode). */
  bodyBackground:
    "linear-gradient(180deg, #0d0d0d 0%, #141414 50%, #1a1a1a 100%)"
};
