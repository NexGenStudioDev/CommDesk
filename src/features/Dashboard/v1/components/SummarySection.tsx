import SummaryCard from "./SummaryCard";
import { Task } from "../types/task";

export default function SummarySection({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;

  const upcoming = tasks.filter(
    (t) => new Date(t.deadline) > new Date() && t.status !== "completed",
  ).length;

  const urgent = tasks.filter((t) => {
    const diff = new Date(t.deadline).getTime() - new Date().getTime();
    return diff > 0 && diff <= 48 * 60 * 60 * 1000;
  }).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "12px",
        padding: "12px",
      }}
    >
      <SummaryCard title="Total Tasks" value={total} />
      <SummaryCard title="Completed" value={completed} />
      <SummaryCard title="In Progress" value={inProgress} />
      <SummaryCard title="Upcoming" value={upcoming} />
      <SummaryCard title="Urgent" value={urgent} />
    </div>
  );
}
