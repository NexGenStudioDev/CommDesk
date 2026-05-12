import React, { createContext, useCallback, useEffect, useState } from "react";
import { type ThemeMode, theme, type ThemeTokens } from "./theme.config";

// ─────────────────────────────────────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────────────────────────────────────
interface ThemeContextValue {
  /** Current active mode: "light" | "dark" */
  mode: ThemeMode;
  /** Typed design tokens — use these in components instead of raw var() strings */
  theme: ThemeTokens;
  /** Toggle between light and dark */
  toggle: () => void;
  /** Explicitly set a mode */
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Persistence key
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "commdesk-theme";

function resolveInitialMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore localStorage errors
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(resolveInitialMode);

  // Apply .dark class to <html> so CSS variables resolve correctly
  const applyMode = useCallback((m: ThemeMode) => {
    document.documentElement.classList.toggle("dark", m === "dark");
    document.documentElement.setAttribute("data-theme", m);
  }, []);

  useEffect(() => {
    applyMode(mode);
  }, [mode, applyMode]);

  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      try {
        localStorage.setItem(STORAGE_KEY, m);
      } catch {
        // ignore localStorage errors
      }
      applyMode(m);
    },
    [applyMode],
  );

  const toggle = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  return (
    // `theme` is the same object for both modes — CSS variables do the switching
    <ThemeContext.Provider value={{ mode, theme, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
