import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme";

export function ThemeToggle() {
  const { mode, toggle, theme } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150"
      style={{
        backgroundColor: theme.bg.surfaceSecondary,
        color: theme.text.secondary,
        border: `1px solid ${theme.border.default}`,
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.interactive.hover)
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.bg.surfaceSecondary)
      }
    >
      {mode === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
