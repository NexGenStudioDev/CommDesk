import type { TaskPriority } from "../../types/task.types";

const config: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-gray-50 text-gray-500 border-gray-200" },
  medium: { label: "Medium", className: "bg-orange-50 text-orange-500 border-orange-200" },
  high: { label: "High", className: "bg-red-50 text-red-500 border-red-200" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-700 border-red-300 font-semibold" },
};

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, className } = config[priority];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}
