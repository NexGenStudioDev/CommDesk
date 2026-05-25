import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useUsageBreakdown, useUsageSummary } from "../../hooks/useUsageAnalytics";
import { formatCredits } from "../../utils/credits";

const COLORS = [
  "var(--cd-primary)",
  "var(--cd-success)",
  "var(--cd-warning)",
  "var(--cd-danger)",
  "var(--cd-violet)", // Or another appropriate CSS variable
];

export default function UsageCharts() {
  const { data: summary, isLoading: summaryLoading } = useUsageSummary();
  const { data: breakdown = [], isLoading: breakdownLoading } = useUsageBreakdown();

  if (summaryLoading || breakdownLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl border animate-pulse"
            style={{ backgroundColor: "var(--cd-surface-2)", borderColor: "var(--cd-border-subtle)" }}
          />
        ))}
      </div>
    );
  }

  const barData =
    summary?.topFeatures.map((f) => ({
      name: f.feature.replace(/_/g, " "),
      credits: f.credits,
    })) ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Top Consuming Features">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--cd-border-subtle)" />
            <XAxis type="number" tick={{ fill: "var(--cd-text-muted)", fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fill: "var(--cd-text-muted)", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--cd-surface)",
                border: "1px solid var(--cd-border-subtle)",
                borderRadius: 8,
              }}
              formatter={(v) => [formatCredits(Number(v)), "Credits"]}
            />
            <Bar dataKey="credits" fill="var(--cd-primary)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Usage by Category">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={breakdown}
              dataKey="credits"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {breakdown.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--cd-surface)",
                border: "1px solid var(--cd-border-subtle)",
                borderRadius: 8,
              }}
              formatter={(v) => [formatCredits(Number(v)), "Credits"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {breakdown.map((item, i) => (
            <span key={item.category} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span style={{ color: "var(--cd-text-muted)" }}>
                {item.category} ({item.percentage}%)
              </span>
            </span>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
      }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--cd-text)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
