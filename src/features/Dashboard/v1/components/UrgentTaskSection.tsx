import { Task } from "../types/task";

function isUrgent(deadline: string) {
  const now = new Date();
  const due = new Date(deadline);
  const diff = due.getTime() - now.getTime();

  return diff > 0 && diff <= 48 * 60 * 60 * 1000;
}

function getDueLabel(deadline: string) {
  const today = new Date();
  const due = new Date(deadline);

  const diff = due.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Due Today";
  if (days === 1) return "Due Tomorrow";
  return `Due in ${days} days`;
}

export default function UrgentTasksSection({ tasks }: { tasks: Task[] }) {
  const urgentTasks = tasks.filter(
    (task) => isUrgent(task.deadline) && task.status !== "completed",
  );

  if (urgentTasks.length === 0) {
    return (
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ color: "red" }}>⚠ Urgent Tasks</h2>
        <div style={{ fontSize: "13px", color: "#666" }}>You're all caught up 🎉</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ color: "red", marginBottom: "10px" }}>⚠ Urgent Tasks</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {urgentTasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid red",
              borderRadius: "10px",
              padding: "14px",
              background: "#fff5f5",
            }}
          >
            <strong>{task.title}</strong>

            <p style={{ margin: "6px 0" }}>
              Status: <span style={{ fontWeight: "bold" }}>{task.status}</span>
            </p>

            <p style={{ margin: 0 }}>{getDueLabel(task.deadline)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
