import { useContext } from "react";
import { ThemeContext } from "../provider";

/**
 * useTheme — access the current theme mode and typed design tokens.
 *
 * @example
 * const { theme, mode, toggle } = useTheme();
 *
 * // Use typed tokens instead of raw CSS variable strings:
 * <p style={{ color: theme.text.primary }}>Hello</p>
 * <div style={{ background: theme.bg.surface }}>Card</div>
 * <span style={{ color: theme.success.default }}>Done</span>
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
