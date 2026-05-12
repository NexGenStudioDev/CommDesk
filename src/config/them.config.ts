// Legacy shim — kept so old imports don't break during migration.
// New code should import directly from "@/theme".
import { theme, type ThemeMode, type ThemeTokens } from "../theme/theme.config";

export type { ThemeMode };
export type Theme = ThemeTokens;

/** Returns the single flat token object — CSS variables resolve per mode automatically. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getTheme(_mode?: ThemeMode): Theme {
  return theme;
}
