import { CalendarItem } from "../mock/CalendarMock";
import { CalendarDays } from "lucide-react";

function formatDateLabel(date: string) {
  const today = new Date();
  const d = new Date(date);

  const diff = Math.floor(
    (d.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function CalendarSection({ items }: { items: CalendarItem[] }) {
  if (!items || items.length === 0) {
    return <p>No upcoming events</p>;
  }

  // 🔹 sort by nearest date
  const sorted = [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>
        <CalendarDays size={18} style={{ marginRight: "6px" }} />
        Calendar
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sorted.slice(0, 5).map((item) => {
          const isTask = item.type === "task";

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderRadius: "10px",
                background: isTask ? "#f1f5f9" : "#fef3c7",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div>
                <strong style={{ fontSize: "14px" }}>{item.title}</strong>

                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                  {formatDateLabel(item.date)}
                </p>
              </div>

              <span
                style={{
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background: isTask ? "#e2e8f0" : "#fde68a",
                }}
              >
                {item.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
