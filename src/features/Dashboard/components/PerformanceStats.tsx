import { Performance } from "../types/dashboard";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: Performance;
}

const trendData = [
  { day: "Mon", tasks: 2 },
  { day: "Tue", tasks: 4 },
  { day: "Wed", tasks: 3 },
  { day: "Thu", tasks: 5 },
  { day: "Fri", tasks: 6 },
  { day: "Sat", tasks: 4 },
  { day: "Sun", tasks: 3 },
];

export default function PerformanceStats({ data }: Props) {
  return (
    <div className="cd-card">
      <h3 className="cd-section-title">Performance Overview</h3>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: "Completion Rate", value: `${data.completionRate}%`, color: "var(--cd-success)" },
          { label: "Avg Completion", value: data.avgTime, color: "var(--cd-primary)" },
          { label: "Streak", value: `${data.streak} days 🔥`, color: "var(--cd-warning)" },
          { label: "Weekly Done", value: data.weeklyCompleted, color: "var(--cd-accent)" },
        ].map((m) => (
          <div key={m.label} className="cd-metric">
            <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
              {m.label}
            </p>
            <p className="text-xl font-semibold" style={{ color: m.color }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <XAxis dataKey="day" fontSize={11} stroke="var(--cd-text-muted)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--cd-surface)",
                border: "1px solid var(--cd-border)",
                borderRadius: "0.5rem",
                color: "var(--cd-text)",
              }}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="var(--cd-primary)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--cd-primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
