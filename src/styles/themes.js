/**
 * Design tokens: shared values for layout and appearance.
 * Edit this file to change the look and feel across the site.
 * Use semantic names only (no component-specific tokens).
 */

export const borderRadius = "12px";

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
  md: "900px",
  lg: "1200px"
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

/**
 * Semantic color palette: off-black, off-white, and grays only.
 */
export const lightTheme = {
  colors: {
    primary: "#1a1a1a",
    secondary: "#f0f0f0",
    accent: "#2a2a2a",
    background: "#fafafa",
    surface: "#ffffff",
    text: "#1a1a1a",
    muted: "#6b6b6b",
    border: "#e0e0e0",
    inverse: "#1a1a1a",
    inverseText: "rgba(255, 255, 255, 0.92)",
    inverseHover: "rgba(255, 255, 255, 0.1)",
    inverseFocus: "rgba(255, 255, 255, 0.75)",
    tagBackground: "#525252",
    tagText: "#fafafa",
    inputFocusBorder: "#8e8e8e",
    inputFocusRing: "rgba(0, 0, 0, 0.12)"
  },
  borderRadius,
  spacing,
  breakpoints,
  media: createMediaQueries(breakpoints),
  typography,
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 2px 6px rgba(0, 0, 0, 0.08)",
    focus: "0 0 0 3px rgba(0, 0, 0, 0.15)",
    focusInput: "0 0 0 3px rgba(0, 0, 0, 0.12)"
  },
  img: {
    brightness: "brightness(1.0)"
  }
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#e5e5e5",
    secondary: "#2a2a2a",
    accent: "#d4d4d4",
    background: "#141414",
    surface: "#1a1a1a",
    text: "#fafafa",
    muted: "#a3a3a3",
    border: "#404040",
    inverse: "#141414",
    inverseText: "rgba(255, 255, 255, 0.92)",
    inverseHover: "rgba(255, 255, 255, 0.1)",
    inverseFocus: "rgba(255, 255, 255, 0.75)",
    tagBackground: "#525252",
    tagText: "#fafafa",
    inputFocusBorder: "#737373",
    inputFocusRing: "rgba(255, 255, 255, 0.15)"
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 2px 6px rgba(0, 0, 0, 0.35)",
    focus: "0 0 0 3px rgba(255, 255, 255, 0.2)",
    focusInput: "0 0 0 3px rgba(255, 255, 255, 0.12)"
  },
  img: {
    brightness: "brightness(0.85)"
  }
};
