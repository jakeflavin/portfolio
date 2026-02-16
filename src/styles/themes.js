export const borderRadius = "24px";

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px"
};

export const lightTheme = {
  colors: {
    primary: "#6FAF7A",     // softened + slightly richer
    secondary: "#EDF7E8",   // cleaner tint of primary
    accent: "#E9D27A",      // warmer + less saturated
    background: "#FFFFFF",
    surface: "#F7F8F7",     // neutral with faint green bias
    text: "#0F172A",   
    muted: "#6C757D",      // better readability than gray-black
    border: "#E6E9E7"       // neutralized to match surface
  },
  borderRadius,
  spacing
};

export const darkTheme = {
  colors: {
    primary: "#337357",     // your chosen anchor
    secondary: "#1E2A24",   // deep muted green surface tint
    accent: "#C9B25F",      // dimmed version of light accent
    background: "#0F1412",  // near-black with green undertone
    surface: "#171E1A",     // elevated surface
    text: "#E6F1EA", 
    muted: "#6C757D",       // soft off-white
    border: "#27332C"       // visible but subtle
  },
  borderRadius,
  spacing
};