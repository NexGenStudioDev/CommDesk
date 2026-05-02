type Performance = {
  totalTasks: number;
  completedTasks: number;
  avgCompletionTime: string;
  streak: number;
};

export default function PerformanceSection({ data }: { data: Performance }) {
  const completionRate = Math.round((data.completedTasks / data.totalTasks) * 100);
  let barColor = "#4caf50"; // default green

  if (completionRate < 40) {
    barColor = "#f44336"; // red
  } else if (completionRate < 70) {
    barColor = "#ff9800"; // orange
  }

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Performance</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Completion Rate */}
        <div>
          <p style={{ margin: 0 }}>Completion Rate</p>

          <div
            style={{
              height: "8px",
              background: "#f0f0f0",
              borderRadius: "10px",
              marginTop: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${completionRate}%`,
                height: "100%",
                background: barColor,
              }}
            />
          </div>

          <span style={{ fontSize: "12px", color: "#666" }}>{completionRate}%</span>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0 }}>Completed (This Month)</p>
            <strong>{data.completedTasks}</strong>
          </div>

          <div>
            <p style={{ margin: 0 }}>Avg Time</p>
            <strong>{data.avgCompletionTime}</strong>
          </div>

          <div>
            <p style={{ margin: 0 }}>Streak</p>
            <strong>{data.streak} days</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
