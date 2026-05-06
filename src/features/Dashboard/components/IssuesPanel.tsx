import { Issues } from "@/features/Dashboard/types/dashboard";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface Props {
  data: Issues;
}

export default function IssuesPanel({ data }: Props) {
  const total = data.open + data.resolved;
  const resolvedPercent = total > 0 ? Math.round((data.resolved / total) * 100) : 0;
  const hasIssues = data.open > 0;

  return (
    <div className="cd-card cd-card-hover">
      <h3 className="cd-section-title">Issues</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="p-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-[1px]"
          style={{
            backgroundColor: "var(--cd-danger-subtle)",
            border: "1px solid var(--cd-border-subtle)",
          }}
          onClick={() => alert("View open issues")}
        >
          <AlertCircle size={17} style={{ color: "var(--cd-danger)" }} />
          <div>
            <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
              Open
            </p>
            <p className="text-lg font-semibold" style={{ color: "var(--cd-danger)" }}>
              {data.open}
            </p>
          </div>
        </div>

        <div
          className="p-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-[1px]"
          style={{
            backgroundColor: "var(--cd-success-subtle)",
            border: "1px solid var(--cd-border-subtle)",
          }}
          onClick={() => alert("View resolved issues")}
        >
          <CheckCircle size={17} style={{ color: "var(--cd-success)" }} />
          <div>
            <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
              Resolved
            </p>
            <p className="text-lg font-semibold" style={{ color: "var(--cd-success)" }}>
              {data.resolved}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--cd-text-2)" }}>
          <span>Resolution Progress</span>
          <span>{resolvedPercent}%</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--cd-border)" }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              width: `${resolvedPercent}%`,
              backgroundColor: "var(--cd-primary)",
            }}
          />
        </div>
      </div>

      <div
        className="mt-4 p-3 rounded-xl border text-sm flex items-start gap-2 cursor-pointer transition-colors"
        style={{
          backgroundColor: hasIssues ? "var(--cd-warning-subtle)" : "var(--cd-success-subtle)",
          borderColor: "var(--cd-border-subtle)",
          color: hasIssues ? "var(--cd-warning)" : "var(--cd-success)",
        }}
        onClick={() => alert("Review issues")}
      >
        <AlertTriangle size={15} className="mt-[2px]" />
        <span>
          {hasIssues
            ? `${data.open} issue(s) need attention`
            : "All issues are resolved — great job!"}
        </span>
      </div>
    </div>
  );
}
