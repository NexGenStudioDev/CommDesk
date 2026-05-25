import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, TrendingUp, Zap } from "lucide-react";
import UsageCharts from "../components/analytics/UsageCharts";
import { useUsageForecast, useUsageSummary } from "../hooks/useUsageAnalytics";
import { formatCredits } from "../utils/credits";

export default function UsageDashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading } = useUsageSummary();
  const { data: forecast } = useUsageForecast();

  const stats = [
    {
      label: "Monthly estimate",
      value: summary ? formatCredits(summary.monthlyEstimate) : "—",
      icon: TrendingUp,
    },
    {
      label: "Daily burn rate",
      value: summary ? formatCredits(summary.burnRatePerDay) : "—",
      icon: Zap,
    },
    {
      label: "Next month forecast",
      value: forecast ? formatCredits(forecast.nextMonthCredits) : "—",
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: "var(--cd-bg)" }}>
      <div
        className="border-b px-5 py-5 sm:px-8 lg:px-10"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
      >
        <div className="mx-auto max-w-[1440px] flex items-center gap-4">
          <button
            onClick={() => navigate("/org/billing/wallet")}
            className="p-2 rounded-lg hover:bg-[var(--cd-hover)]"
          >
            <ArrowLeft size={18} style={{ color: "var(--cd-text-muted)" }} />
          </button>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--cd-text)" }}>
              Usage Analytics
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cd-text-muted)" }}>
              Credit burn rate, feature breakdown, and forecasts
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--cd-surface)",
                borderColor: "var(--cd-border-subtle)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} style={{ color: "var(--cd-primary)" }} />
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--cd-text-muted)" }}>
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-black" style={{ color: "var(--cd-text)" }}>
                {isLoading ? "..." : stat.value}
              </p>
            </div>
          ))}
        </div>

        {forecast && (
          <div
            className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-4"
            style={{
              backgroundColor: "var(--cd-warning-subtle)",
              borderColor: "var(--cd-warning)",
            }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--cd-text)" }}>
                AI usage spike risk:{" "}
                <span className="capitalize">{forecast.aiSpikeRisk}</span>
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--cd-text-muted)" }}>
                Storage growth estimate: {formatCredits(forecast.storageGrowthCredits)} credits ·
                Confidence: {Math.round(forecast.confidence * 100)}%
              </p>
            </div>
          </div>
        )}

        <UsageCharts />
      </main>
    </div>
  );
}

