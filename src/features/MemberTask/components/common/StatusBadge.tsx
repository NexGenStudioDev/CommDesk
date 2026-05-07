import type { TaskStatus } from "../../types/task.types";

const config: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "To Do", className: "bg-gray-100 text-gray-600 border-gray-200" },
  "in-progress": { label: "In Progress", className: "bg-blue-50 text-blue-600 border-blue-200" },
  review: { label: "In Review", className: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  completed: { label: "Completed", className: "bg-green-50 text-green-600 border-green-200" },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}
