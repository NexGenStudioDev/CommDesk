import { Task } from "../types/dashboard";
import { Check, Eye } from "lucide-react";

interface Props {
  tasks: Task[];
}

const getStatusStyle = (status: Task["status"]): { bg: string; color: string } => {
  switch (status) {
    case "completed":
      return { bg: "var(--cd-success-subtle)", color: "var(--cd-success)" };
    case "in-progress":
      return { bg: "var(--cd-warning-subtle)", color: "var(--cd-warning)" };
    default:
      return { bg: "var(--cd-surface-2)", color: "var(--cd-text-2)" };
  }
};

const formatDeadline = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short" });

export default function RecentTasks({ tasks }: Props) {
  if (!tasks.length) {
    return (
      <div className="cd-card cd-card-hover w-full">
        <p className="text-sm" style={{ color: "var(--cd-text-muted)" }}>
          No tasks assigned
        </p>
      </div>
    );
  }

  return (
    <div className="cd-card cd-card-hover w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="cd-section-title" style={{ marginBottom: 0 }}>
          Recent Tasks
        </h3>
        <button
          className="text-xs font-medium self-start sm:self-auto"
          style={{ color: "var(--cd-primary)" }}
        >
          View All
        </button>
      </div>

      <div className="space-y-2">
        {tasks.slice(0, 8).map((task) => {
          const s = getStatusStyle(task.status);
          return (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl transition-colors"
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--cd-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent")
              }
            >
              <div className="min-w-0">
                <p className="text-sm font-medium break-words" style={{ color: "var(--cd-text)" }}>
                  {task.title}
                </p>
                <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                  Due {formatDeadline(task.deadline)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                <span
                  className="cd-badge text-xs"
                  style={{ backgroundColor: s.bg, color: s.color }}
                >
                  {task.status}
                </span>
                <div className="flex gap-1">
                  <button
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "var(--cd-text-2)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--cd-hover)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
                    }
                  >
                    <Eye size={15} />
                  </button>
                  {task.status !== "completed" && (
                    <button
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--cd-success)" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "var(--cd-success-subtle)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "transparent")
                      }
                    >
                      <Check size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
