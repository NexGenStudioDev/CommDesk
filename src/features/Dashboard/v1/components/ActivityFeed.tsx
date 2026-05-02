import { Activity } from "../mock/ActivityMock";
import { ClipboardList, MessageCircle, Calendar } from "lucide-react";

function formatTime(time: string) {
  const now = new Date();
  const activityTime = new Date(time);
  const diff = Math.floor((now.getTime() - activityTime.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

  return `${Math.floor(diff / 86400)} days ago`;
}

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  const sorted = [...activities].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Activity</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sorted.map((item) => {
          const icon =
            item.type === "task" ? (
              <ClipboardList size={16} />
            ) : item.type === "comment" ? (
              <MessageCircle size={16} />
            ) : (
              <Calendar size={16} />
            );

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "8px",
                paddingBottom: "8px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div style={{ marginTop: "2px", color: "#666" }}>{icon}</div>

              <div>
                <p style={{ margin: 0, fontSize: "14px" }}>{item.message}</p>
                <span style={{ fontSize: "12px", color: "#666" }}>{formatTime(item.time)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
