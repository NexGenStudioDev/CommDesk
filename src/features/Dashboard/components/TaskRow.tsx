import { Task } from "@/features/Dashboard/types/dashboard";
import { formatDueLabel } from "@/utils/task.utils";
import { Check } from "lucide-react";

interface TaskRowProps {
  task: Task;
  urgent?: boolean;
}

export default function TaskRow({ task, urgent = false }: TaskRowProps) {
  if (!task) return null;

  return (
    <div
      className={`
        flex items-center justify-between
        p-3 rounded-xl transition
        hover:bg-gray-50
        ${urgent ? "border-l-4 border-red-500 bg-red-50/30" : ""}
      `}
    >
      {/* Left */}
      <div>
        <p className="text-sm font-medium text-gray-800">{task.title || "Untitled Task"}</p>

        <p className={`text-xs ${urgent ? "text-red-500" : "text-gray-400"}`}>
          {formatDueLabel(task.deadline)}
        </p>
      </div>

      {/* Action */}
      <button className="p-2 rounded-lg hover:bg-green-100 text-green-600">
        <Check size={16} />
      </button>
    </div>
  );
}
