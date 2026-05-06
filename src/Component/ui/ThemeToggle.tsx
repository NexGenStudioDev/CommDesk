import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme/hooks/useTheme";

export function ThemeToggle() {
  const { mode, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150"
      style={{
        backgroundColor: "var(--cd-surface-2)",
        color: "var(--cd-text-2)",
        border: "1px solid var(--cd-border)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--cd-hover)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--cd-surface-2)")
      }
    >
      {mode === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
