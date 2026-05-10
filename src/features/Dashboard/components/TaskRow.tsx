import { Task } from "@/features/Dashboard/types/dashboard";
import { formatDueLabel } from "@/utils/task.utils";
import { Check } from "lucide-react";

interface TaskRowProps {
  task: Task;
  urgent?: boolean;
}

export default function TaskRow({ task, urgent = false }: TaskRowProps) {
  if (!task) return null;

  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl transition-colors"
      style={{
        borderLeft: urgent ? "3px solid var(--cd-danger)" : undefined,
        backgroundColor: urgent ? "var(--cd-danger-subtle)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!urgent) (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--cd-hover)";
      }}
      onMouseLeave={(e) => {
        if (!urgent) (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
      }}
    >
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--cd-text)" }}>
          {task.title || "Untitled Task"}
        </p>
        <p
          className="text-xs"
          style={{ color: urgent ? "var(--cd-danger)" : "var(--cd-text-muted)" }}
        >
          {formatDueLabel(task.deadline)}
        </p>
      </div>

      <button
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: "var(--cd-success)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--cd-success-subtle)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
        }
      >
        <Check size={15} />
      </button>
    </div>
  );
}
