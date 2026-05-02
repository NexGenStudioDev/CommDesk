import { Task } from "../types/task";

function getDueLabel(deadline: string) {
  const today = new Date();
  const due = new Date(deadline);

  const diff = due.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Due Today";
  if (days === 1) return "Due Tomorrow";
  return `Due in ${days} days`;
}

function isUrgent(deadline: string) {
  const now = new Date();
  const due = new Date(deadline);
  const diff = due.getTime() - now.getTime();

  return diff > 0 && diff <= 48 * 60 * 60 * 1000;
}

export default function TaskSection({ tasks }: { tasks: Task[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Recent Tasks</h2>
        <p>No tasks assigned</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Recent Tasks</h2>

      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        {tasks.slice(0, 5).map((task) => {
          const urgent = isUrgent(task.deadline);

          return (
            <div
              key={task.id}
              style={{
                border: urgent ? "1px solid red" : "1px solid #f0f0f0",
                borderRadius: "10px",
                padding: "14px",
                background: urgent ? "#fff5f5" : "#fff",
              }}
            >
              {/* Title */}
              <strong>{task.title}</strong>

              {/* Status */}
              <p style={{ margin: "6px 0" }}>
                Status:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      task.status === "completed"
                        ? "green"
                        : task.status === "in-progress"
                          ? "orange"
                          : "gray",
                  }}
                >
                  {task.status}
                </span>
              </p>

              {/* Deadline */}
              <p style={{ margin: 0 }}>{getDueLabel(task.deadline)}</p>

              {/* Urgent Tag */}
              {urgent && <p style={{ color: "red", marginTop: "5px" }}>⚠ Urgent</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
