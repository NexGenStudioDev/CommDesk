type Task = {
  status: string;
};

export default function ProductivitySection({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const score = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>
        ⚡ Productivity Score
      </h2>

      <div
        style={{
          height: "8px",
          background: "#eee",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: "#3b82f6",
          }}
        />
      </div>

      <p style={{ fontSize: "12px", marginTop: "6px" }}>{score}% efficiency</p>
    </div>
  );
}
