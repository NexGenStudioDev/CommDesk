// ─────────────────────────────────────────────────────────────────────────────
// theme.config.ts
//
// THE SINGLE SOURCE OF TRUTH for CommDesk theming.
//
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
// 1. CSS variables are declared in App.css for :root (light) and .dark (dark).
//    They are what actually change when the user toggles the theme.
//
// 2. This file maps every CSS variable to a human-readable TypeScript property.
//    Components import `useTheme()` and write:
//
//      const { theme } = useTheme();
//      <p style={{ color: theme.text.primary }}>Hello</p>
//
//    instead of the raw, hard-to-read:
//
//      <p style={{ color: "var(--cd-text)" }}>Hello</p>
//
// 3. To change a color across the whole app, edit App.css (the CSS variable).
//    To rename a token or add a new one, edit the `themeTokens` object below
//    and TypeScript will tell you everywhere it needs updating.
//
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark";

/**
 * Every property here is a CSS variable reference.
 * The actual color values live in App.css — edit them there.
 * This object is the typed bridge between CSS and TypeScript.
 */
export const themeTokens = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  bg: {
    /** Page-level background */
    page: "var(--cd-bg)",
    /** Card / panel surface */
    surface: "var(--cd-surface)",
    /** Slightly elevated surface (inputs, tags, rows) */
    surfaceSecondary: "var(--cd-surface-2)",
    /** Tertiary surface (hover states, subtle fills) */
    surfaceTertiary: "var(--cd-surface-3)",
  },

  // ── Text ───────────────────────────────────────────────────────────────────
  text: {
    /** Main body text */
    primary: "var(--cd-text)",
    /** Secondary / supporting text */
    secondary: "var(--cd-text-2)",
    /** Placeholder / disabled text */
    muted: "var(--cd-text-muted)",
    /** Text on dark/colored backgrounds */
    inverse: "#ffffff",
  },

  // ── Borders ────────────────────────────────────────────────────────────────
  border: {
    /** Default border */
    default: "var(--cd-border)",
    /** Subtle divider (table rows, inner sections) */
    subtle: "var(--cd-border-subtle)",
  },

  // ── Brand — Primary (Blue) ─────────────────────────────────────────────────
  primary: {
    /** Main primary color */
    default: "var(--cd-primary)",
    /** Hover state */
    hover: "var(--cd-primary-hover)",
    /** Light tinted background (badges, highlights) */
    subtle: "var(--cd-primary-subtle)",
    /** Text on primary-subtle backgrounds */
    text: "var(--cd-primary-text)",
  },

  // ── Brand — Secondary (Purple) ─────────────────────────────────────────────
  secondary: {
    default: "var(--cd-secondary)",
  },

  // ── Brand — Accent (Cyan) ──────────────────────────────────────────────────
  accent: {
    default: "var(--cd-accent)",
  },

  // ── Status ─────────────────────────────────────────────────────────────────
  success: {
    default: "var(--cd-success)",
    subtle: "var(--cd-success-subtle)",
  },
  warning: {
    default: "var(--cd-warning)",
    subtle: "var(--cd-warning-subtle)",
  },
  danger: {
    default: "var(--cd-danger)",
    subtle: "var(--cd-danger-subtle)",
  },

  // ── Interactive ────────────────────────────────────────────────────────────
  interactive: {
    /** Background on hover */
    hover: "var(--cd-hover)",
  },

  // ── Shadows ────────────────────────────────────────────────────────────────
  shadow: {
    sm: "var(--cd-shadow)",
    md: "var(--cd-shadow-md)",
  },
} as const;

/** The shape every component receives from useTheme() */
export type ThemeTokens = typeof themeTokens;

// ─────────────────────────────────────────────────────────────────────────────
// The theme object is the same for both modes — the CSS variables resolve
// to different values automatically via App.css :root / .dark rules.
// ─────────────────────────────────────────────────────────────────────────────
export const theme: ThemeTokens = themeTokens;
