import React from "react";
import { ThemeProvider } from "@/theme";

export function withTheme(ui: React.ReactElement) {
  return <ThemeProvider>{ui}</ThemeProvider>;
}
