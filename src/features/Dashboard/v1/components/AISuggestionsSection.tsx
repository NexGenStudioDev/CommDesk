type Task = {
  id: number;
  title: string;
  deadline: string;
  status: string;
};

export default function AISuggestionsSection({ tasks }: { tasks: Task[] }) {
  const today = new Date();

  // pick nearest upcoming task
  const sorted = [...tasks]
    .filter((t) => t.status !== "completed")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const focusTask = sorted[0];

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>🤖 AI Suggestions</h2>

      {focusTask ? (
        <div
          style={{
            padding: "12px",
            borderRadius: "10px",
            background: "#f1f5f9",
          }}
        >
          <strong>Focus on this today:</strong>

          <p style={{ margin: "6px 0 0 0" }}>{focusTask.title}</p>

          <p
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "4px",
            }}
          >
            Deadline approaching soon
          </p>
        </div>
      ) : (
        <p style={{ fontSize: "12px", color: "#666" }}>You're all caught up 🎉</p>
      )}
    </div>
  );
}
