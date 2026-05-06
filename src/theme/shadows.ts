export const lightShadows = {
  sm: "0 1px 2px rgba(15,23,42,0.06)",
  md: "0 4px 6px -1px rgba(15,23,42,0.08), 0 2px 4px -2px rgba(15,23,42,0.06)",
  lg: "0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.06)",
  xl: "0 20px 25px -5px rgba(15,23,42,0.10), 0 8px 10px -6px rgba(15,23,42,0.06)",
  card: "0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)",
  cardHover: "0 4px 12px rgba(15,23,42,0.12)",
  inner: "inset 0 2px 4px rgba(15,23,42,0.06)",
} as const;

export const darkShadows = {
  sm: "0 1px 2px rgba(0,0,0,0.3)",
  md: "0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.3)",
  xl: "0 20px 25px -5px rgba(0,0,0,0.6), 0 8px 10px -6px rgba(0,0,0,0.4)",
  card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
  cardHover: "0 4px 12px rgba(0,0,0,0.5)",
  inner: "inset 0 2px 4px rgba(0,0,0,0.3)",
  // Glow accents for dark mode
  glowBlue: "0 0 20px rgba(59,130,246,0.25)",
  glowPurple: "0 0 20px rgba(168,85,247,0.25)",
  glowCyan: "0 0 20px rgba(34,211,238,0.20)",
  glowGreen: "0 0 20px rgba(74,222,128,0.20)",
} as const;
