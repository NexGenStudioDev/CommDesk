import { Task } from "../types/dashboard";
import { Check, Eye } from "lucide-react";

interface Props {
  tasks: Task[];
}

const getStatusStyle = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "badge-success";
    case "in-progress":
      return "badge-warning";
    default:
      return "badge-default";
  }
};

const formatDeadline = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
};

export default function RecentTasks({ tasks }: Props) {
  if (!tasks.length) {
    return (
      <div className="card card-hover w-full">
        <p className="text-gray-400 text-sm">No tasks assigned</p>
      </div>
    );
  }

  return (
    <div className="card card-hover w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="section-title">Recent Tasks</h3>
        <button className="text-sm text-indigo-500 hover:underline self-start sm:self-auto">
          View All
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.slice(0, 8).map((task) => (
          <div
            key={task.id}
            className="
              flex flex-col sm:flex-row sm:items-center sm:justify-between
              gap-3 p-3 rounded-xl hover:bg-gray-50 transition
            "
          >
            {/* LEFT */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 break-words">{task.title}</p>
              <p className="text-xs text-gray-400">Due {formatDeadline(task.deadline)}</p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between sm:justify-end w-full sm:w-auto">
              {/* Status */}
              <span
                className={`
                  text-xs px-2 py-1 rounded-full whitespace-nowrap
                  ${getStatusStyle(task.status)}
                `}
              >
                {task.status}
              </span>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                  <Eye size={16} />
                </button>

                {task.status !== "completed" && (
                  <button className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition">
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
