type Task = {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "completed";
  deadline: string;
};

export default function TaskItem({ task }: { task: Task }) {
  return (
    <div
      style={{
        border: "1px solid #f0f0f0",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "8px",
      }}
    >
      <strong>{task.title}</strong>
      <p>Status: {task.status}</p>
      <p>Deadline: {task.deadline}</p>
    </div>
  );
}
