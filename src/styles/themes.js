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

const compactSpacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "18px"
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
  },
  heading: {
    weight: 700,
    tracking: "-0.025em",
    transform: "none"
  },
  typewriter: {
    size: "clamp(28px, 4.4vw, 44px)",
    tracking: "-0.025em",
    transform: "none"
  },
  card: {
    titleSize: "1.25rem",
    titleTracking: "-0.025em",
    titleTransform: "none"
  }
};

const blueprintTypography = {
  fontFamily: {
    heading: '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
    body: '"IBM Plex Mono", ui-monospace, Menlo, monospace'
  },
  heading: {
    weight: 500,
    tracking: "-0.01em",
    transform: "uppercase"
  },
  typewriter: {
    size: "clamp(22px, 3.4vw, 34px)",
    tracking: "0.02em",
    transform: "uppercase"
  },
  card: {
    titleSize: "16px",
    titleTracking: "0.04em",
    titleTransform: "uppercase"
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
    paper: "#fff4dc",
    paperText: "#1f1f1f",
    paperMuted: "#6c6258",
    paperBorder: "rgba(0, 0, 0, 0.12)",
    success: "#2f7d3b",
    warning: "#9a6a00",
    danger: "#a73525",
    inverse: "#1a1a1a",
    inverseText: "rgba(255, 255, 255, 0.92)",
    inverseHover: "rgba(255, 255, 255, 0.1)",
    inverseFocus: "rgba(255, 255, 255, 0.75)",
    focusBorder: "#8e8e8e",
    focusRing: "rgba(0, 0, 0, 0.12)",
    heart: "#c75151"
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
    paper: "#f8ecd4",
    paperText: "#1f1f1f",
    paperMuted: "#6c6258",
    paperBorder: "rgba(0, 0, 0, 0.16)",
    success: "#66b36f",
    warning: "#d49a25",
    danger: "#df725f",
    inverse: "#141414",
    inverseText: "rgba(255, 255, 255, 0.92)",
    inverseHover: "rgba(255, 255, 255, 0.1)",
    inverseFocus: "rgba(255, 255, 255, 0.75)",
    focusBorder: "#737373",
    focusRing: "rgba(255, 255, 255, 0.15)",
    heart: "#e88080"
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

/** Blueprint: technical navy, grid-paper background, JetBrains Mono + IBM Plex Mono, compact density. */
export const blueprintTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#ffffff",
    secondary: "#1d3f70",
    accent: "#9fd0ff",
    background: "#1a4a8a",
    surface: "#1d3f70",
    surfaceGlass: "rgba(15, 45, 90, 0.78)",
    secondaryGlass: "rgba(20, 55, 105, 0.72)",
    text: "#eaf3ff",
    muted: "rgba(200, 220, 245, 0.75)",
    border: "rgba(200, 225, 255, 0.45)",
    paper: "#eaf3ff",
    paperText: "#0a1f3d",
    paperMuted: "#2f5d91",
    paperBorder: "rgba(10, 31, 61, 0.2)",
    success: "#77d58b",
    warning: "#ffd36b",
    danger: "#ff8a78",
    inverse: "#eaf3ff",
    inverseText: "rgba(10, 20, 60, 0.92)",
    inverseHover: "rgba(200, 225, 255, 0.1)",
    inverseFocus: "rgba(200, 225, 255, 0.75)",
    focusBorder: "rgba(220, 235, 255, 0.6)",
    focusRing: "rgba(220, 235, 255, 0.3)",
    heart: "#e88080"
  },
  borderRadius: "14px",
  spacing: compactSpacing,
  typography: blueprintTypography,
  shadows: {
    sm: "0 2px 10px rgba(0, 15, 40, 0.35)",
    md: "0 10px 28px rgba(0, 15, 40, 0.45)",
    mdDown: "0 14px 34px rgba(0, 15, 40, 0.55)",
    focus: "0 0 0 3px rgba(220, 235, 255, 0.3)"
  },
  img: {
    brightness: "brightness(0.95) contrast(1.05)"
  },
  bodyBackground: [
    "linear-gradient(rgba(220, 235, 255, 0.08) 1px, transparent 1px) 0 0 / 32px 32px",
    "linear-gradient(90deg, rgba(220, 235, 255, 0.08) 1px, transparent 1px) 0 0 / 32px 32px",
    "linear-gradient(180deg, #1a4a8a 0%, #15407a 50%, #103466 100%)"
  ].join(", ")
};

export const blueprintDarkTheme = {
  ...blueprintTheme,
  colors: {
    ...blueprintTheme.colors,
    primary: "#9fd0ff",
    accent: "#c5e1ff",
    background: "#0a1f3d",
    surface: "#122544",
    surfaceGlass: "rgba(18, 37, 68, 0.85)",
    secondaryGlass: "rgba(24, 46, 82, 0.75)",
    text: "#eaf3ff",
    muted: "rgba(180, 205, 235, 0.72)",
    border: "rgba(180, 215, 255, 0.32)",
    focusRing: "rgba(180, 215, 255, 0.3)"
  },
  shadows: {
    sm: "0 2px 14px rgba(0, 8, 28, 0.5)",
    md: "0 10px 32px rgba(0, 8, 28, 0.6)",
    mdDown: "0 14px 38px rgba(0, 8, 28, 0.7)",
    focus: "0 0 0 3px rgba(180, 215, 255, 0.3)"
  },
  bodyBackground: [
    "linear-gradient(rgba(180, 215, 255, 0.05) 1px, transparent 1px) 0 0 / 32px 32px",
    "linear-gradient(90deg, rgba(180, 215, 255, 0.05) 1px, transparent 1px) 0 0 / 32px 32px",
    "linear-gradient(180deg, #0a1f3d 0%, #08182f 50%, #051124 100%)"
  ].join(", ")
};
