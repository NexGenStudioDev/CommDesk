import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@/theme";
import { Performance } from "../member/types/dashboard";

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
  const { theme } = useTheme();

  const metrics = [
    { label: "Completion Rate", value: `${data.completionRate}%`, color: theme.success.default },
    { label: "Avg Completion", value: data.avgTime, color: theme.primary.default },
    { label: "Streak", value: `${data.streak} days 🔥`, color: theme.warning.default },
    { label: "Weekly Done", value: data.weeklyCompleted, color: theme.accent.default },
  ];

  return (
    <div className="cd-card">
      <h3 className="cd-section-title">Performance Overview</h3>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {metrics.map((m) => (
          <div key={m.label} className="cd-metric">
            <p className="text-xs" style={{ color: theme.text.secondary }}>
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
            <XAxis dataKey="day" fontSize={11} stroke={theme.text.muted} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.bg.surface,
                border: `1px solid ${theme.border.default}`,
                borderRadius: "0.5rem",
                color: theme.text.primary,
              }}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke={theme.primary.default}
              strokeWidth={2.5}
              dot={{ r: 3, fill: theme.primary.default }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
