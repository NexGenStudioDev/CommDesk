// Legacy shim — kept so old imports don't break during migration.
// New code should import directly from "@/theme".
import { theme, type ThemeMode, type ThemeTokens } from "../theme/theme.config";

export type { ThemeMode };
export type Theme = ThemeTokens[ThemeMode];

export function getTheme(mode: ThemeMode): Theme {
  return theme[mode];
}
