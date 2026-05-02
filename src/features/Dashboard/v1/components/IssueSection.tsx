import { Issue } from "../mock/IssueMock";

export default function IssuesSection({ issues }: { issues: Issue[] }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Issues</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {issues.map((issue) => (
          <div
            key={issue.id}
            style={{
              padding: "12px",
              borderRadius: "10px",
              background: issue.status === "open" ? "#fef2f2" : "#f0fdf4",
              border: "1px solid #f0f0f0",
            }}
          >
            <strong style={{ fontSize: "14px" }}>{issue.title}</strong>

            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "12px",
                color: issue.status === "open" ? "#ef4444" : "#22c55e",
              }}
            >
              {issue.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
