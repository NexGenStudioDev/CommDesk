import { Sparkles } from "lucide-react";
import { Task } from "@/features/Dashboard/types/dashboard";
import { getAISuggestions } from "@/utils/aisuggestions";

interface Props {
  tasks: Task[];
}

export default function AISuggestions({ tasks }: Props) {
  const suggestions = getAISuggestions(tasks);

  return (
    <div className="cd-card cd-card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={17} style={{ color: "var(--cd-secondary)" }} />
          <h3 className="cd-section-title" style={{ marginBottom: 0 }}>
            AI Suggestions
          </h3>
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--cd-secondary)" }}>
          Smart Insights
        </span>
      </div>

      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="p-3 rounded-xl text-sm break-words transition-colors"
            style={{
              backgroundColor: i === 0 ? "var(--cd-success-subtle)" : "var(--cd-surface-2)",
              color: "var(--cd-text)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                "var(--cd-primary-subtle)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                i === 0 ? "var(--cd-success-subtle)" : "var(--cd-surface-2)")
            }
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
