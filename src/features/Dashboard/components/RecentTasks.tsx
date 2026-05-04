import { Task } from "../types/dashboard";
import { Check, Eye } from "lucide-react";

interface Props {
  tasks: Task[];
}

const getStatusStyle = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-600";
    case "in-progress":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
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
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-gray-400">No tasks assigned</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Recent Tasks</h3>
        <button className="text-sm text-indigo-500 hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {tasks.slice(0, 8).map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition"
          >
            {/* Left */}
            <div>
              <p className="text-sm font-medium text-gray-800">{task.title}</p>
              <p className="text-xs text-gray-400">Due {formatDeadline(task.deadline)}</p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Status */}
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(task.status)}`}>
                {task.status}
              </span>

              {/* Action*/}
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Eye size={16} />
                </button>

                {task.status !== "completed" && (
                  <button className="p-2 rounded-lg hover:bg-green-100 text-green-600">
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
