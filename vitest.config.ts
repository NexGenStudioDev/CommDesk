import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/__tests__/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["src/e2e/**", "node_modules", "src-tauri"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      include: [
        "src/utils/reminders.ts",
        "src/utils/task.utils.ts",
        "src/utils/aisuggestions.ts",
        "src/lib/utils.ts",
        "src/theme/hooks/useTheme.ts",
        "src/theme/provider.tsx",
        "src/theme/theme.config.ts",
        "src/Component/ui/Button.tsx",
        "src/Component/ui/Input.tsx",
        "src/features/Dashboard/components/SmartReminders.tsx",
        "src/features/Dashboard/components/AISuggestions.tsx",
        "src/features/Dashboard/components/TaskOverview.tsx",
        "src/routes/ProtectedRoute.tsx",
        "src/system/updater/autoUpdater.ts",
      ],
      thresholds: {
        lines: 90,
        functions: 70,
        branches: 85,
        statements: 90,
      },
    },
  },
});
