import { AlertTriangle, Clock } from "lucide-react";
import { Task } from "@/features/Dashboard/types/dashboard";
import { getSmartReminders } from "@/utils/reminders";

interface Props {
  tasks: Task[];
}

export default function SmartReminders({ tasks }: Props) {
  const reminders = getSmartReminders(tasks);
  const urgent = reminders.filter((r) => r.type === "urgent");
  const upcoming = reminders.filter((r) => r.type === "upcoming");

  return (
    <div className="cd-card">
      <h3 className="cd-section-title">Smart Reminders</h3>

      {urgent.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--cd-danger)" }}>
            Urgent
          </p>
          <div className="space-y-2">
            {urgent.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                style={{ backgroundColor: "var(--cd-danger-subtle)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.filter = "brightness(0.95)")
                }
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.filter = "none")}
              >
                <AlertTriangle
                  size={15}
                  className="mt-[2px] shrink-0"
                  style={{ color: "var(--cd-danger)" }}
                />
                <div>
                  <p
                    className="text-sm font-medium break-words"
                    style={{ color: "var(--cd-text)" }}
                  >
                    {r.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--cd-danger)" }}>
                    {r.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--cd-warning)" }}>
            Upcoming
          </p>
          <div className="space-y-2">
            {upcoming.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                style={{ backgroundColor: "var(--cd-warning-subtle)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.filter = "brightness(0.95)")
                }
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.filter = "none")}
              >
                <Clock
                  size={15}
                  className="mt-[2px] shrink-0"
                  style={{ color: "var(--cd-warning)" }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--cd-text)" }}>
                    {r.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--cd-warning)" }}>
                    {r.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: "var(--cd-text-muted)" }}>
          🎉 You're all caught up!
        </p>
      )}
    </div>
  );
}
