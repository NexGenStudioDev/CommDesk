import React, { createContext, useCallback, useEffect, useState } from "react";
import { type ThemeMode, themes, type Theme } from "./theme.config";

interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "commdesk-theme";

function resolveInitialMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(resolveInitialMode);

  const applyMode = useCallback((m: ThemeMode) => {
    const root = document.documentElement;
    root.classList.toggle("dark", m === "dark");
    root.setAttribute("data-theme", m);
  }, []);

  useEffect(() => {
    applyMode(mode);
  }, [mode, applyMode]);

  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      try {
        localStorage.setItem(STORAGE_KEY, m);
      } catch {}
      applyMode(m);
    },
    [applyMode],
  );

  const toggle = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, theme: themes[mode], toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
