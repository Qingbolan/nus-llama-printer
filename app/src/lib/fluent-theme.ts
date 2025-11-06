
import {
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
  type Theme,
} from "@fluentui/react-components"

// Define brand color palette (based on our primary color)
const brandColors: BrandVariants = {
  10: "#060315",
  20: "#15103F",
  30: "#24185C",
  40: "#331F78",
  50: "#422694",
  60: "#5432A8", // Our primary color
  70: "#6F49C5",
  80: "#8A64D9",
  90: "#A57FED",
  100: "#C09BFF",
  110: "#D4B7FF",
  120: "#E8D3FF",
  130: "#F3E7FF",
  140: "#F9F3FF",
  150: "#FCFAFF",
  160: "#FFFFFF",
}

// Create light theme
export const lightTheme: Theme = {
  ...createLightTheme(brandColors),
}

// Create dark theme
export const darkTheme: Theme = {
  ...createDarkTheme(brandColors),
}

// Add custom Acrylic and Mica tokens
export const acrylicTokens = {
  backdropFilter: "blur(30px) saturate(180%)",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
}

export const micaTokens = {
  backdropFilter: "blur(80px) saturate(120%)",
  backgroundColor: "rgba(248, 248, 250, 0.92)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
}

// Reveal effect tokens
export const revealTokens = {
  transitionDuration: "167ms",
  transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
  hoverBorderColor: "rgba(255, 255, 255, 0.3)",
  hoverShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.14)",
}
