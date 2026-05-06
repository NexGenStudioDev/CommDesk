import { lightTokens, darkTokens } from "./colors";
import { typography } from "./typography";
import { lightShadows, darkShadows } from "./shadows";
import { spacing, radius } from "./spacing";

export type ThemeMode = "light" | "dark";

export const themes = {
  light: {
    colors: lightTokens,
    typography,
    shadows: lightShadows,
    spacing,
    radius,
    gradients: {
      primary: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
      secondary: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
      accent: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      surface: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      hero: "linear-gradient(135deg, #eff6ff 0%, #faf5ff 50%, #ecfeff 100%)",
    },
  },
  dark: {
    colors: darkTokens,
    typography,
    shadows: darkShadows,
    spacing,
    radius,
    gradients: {
      primary: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
      secondary: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
      accent: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
      surface: "linear-gradient(135deg, #1a1f2e 0%, #151929 100%)",
      hero: "linear-gradient(135deg, #0f1320 0%, #1a1f2e 50%, #151929 100%)",
    },
  },
} as const;

export type Theme = (typeof themes)["light"];

export function getTheme(mode: ThemeMode): Theme {
  return themes[mode];
}

// Legacy compat — keeps old callers working while migration proceeds
export type { ThemeMode as default };
