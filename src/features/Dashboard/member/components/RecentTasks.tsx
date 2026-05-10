import { Task } from "../types/dashboard";

import { Check, Eye } from "lucide-react";

interface Props {
  tasks: Task[];
}

const getStatusStyle = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return `
        bg-green-50
        text-green-600
        border border-green-100

        dark:bg-green-500/10
        dark:text-green-400
        dark:border-green-500/10
      `;

    case "in-progress":
      return `
        bg-yellow-50
        text-yellow-600
        border border-yellow-100

        dark:bg-yellow-500/10
        dark:text-yellow-400
        dark:border-yellow-500/10
      `;

    default:
      return `
        bg-gray-100
        text-gray-600
        border border-gray-200

        dark:bg-zinc-800
        dark:text-zinc-300
        dark:border-zinc-700
      `;
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
  const MAX_TASKS_DISPLAY = 8;
  if (!tasks.length) {
    return (
      <div
        className="
          bg-white/90
          dark:bg-zinc-900

          border border-gray-200
          dark:border-zinc-800

          rounded-3xl
          p-5

          shadow-sm
        "
      >
        <p
          className="
            text-sm

            text-gray-400
            dark:text-zinc-500
          "
        >
          No tasks assigned
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white/90
        dark:bg-zinc-900

        border border-gray-200
        dark:border-zinc-800

        rounded-3xl
        p-5

        shadow-sm
        dark:shadow-none

        hover:shadow-md
        dark:hover:border-zinc-700

        transition-all duration-300

        w-full
        h-full
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between

          mb-6
        "
      >
        <h3
          className="
            text-lg font-semibold

            text-gray-900
            dark:text-white
          "
        >
          Recent Tasks
        </h3>

        <button
          className="
            text-sm font-medium

            text-indigo-600
            dark:text-indigo-400

            hover:underline
          "
        >
          View All
        </button>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.slice(0, MAX_TASKS_DISPLAY).map((task) => (
          <div
            key={task.id}
            className="
              flex items-center justify-between

              gap-4

              p-4 rounded-2xl

              bg-gray-50
              dark:bg-zinc-800/50

              border border-gray-100
              dark:border-zinc-700

              hover:bg-gray-100
              dark:hover:bg-zinc-800

              hover:-translate-y-[1px]
              hover:shadow-sm

              transition-all duration-200
            "
          >
            {/* Left */}
            <div className="min-w-0 flex-1">
              <p
                className="
                  text-base font-semibold

                  text-gray-800
                  dark:text-white

                  break-words
                "
              >
                {task.title}
              </p>

              <p
                className="
                  text-sm mt-1

                  text-gray-400
                  dark:text-zinc-500
                "
              >
                Due {formatDeadline(task.deadline)}
              </p>
            </div>

            {/* Right */}
            <div
              className="
                flex items-center gap-3

                shrink-0
              "
            >
              {/* Status */}
              <span
                className={`
                  text-xs px-3 py-1 rounded-full
                  whitespace-nowrap font-medium

                  ${getStatusStyle(task.status)}
                `}
              >
                {task.status}
              </span>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="
                    p-2 rounded-xl

                    hover:bg-gray-200
                    dark:hover:bg-zinc-700

                    text-gray-600
                    dark:text-zinc-300

                    transition
                  "
                >
                  <Eye size={16} />
                </button>

                {task.status !== "completed" && (
                  <button
                    className="
                      p-2 rounded-xl

                      hover:bg-green-100
                      dark:hover:bg-green-500/15

                      text-green-600
                      dark:text-green-400

                      transition
                    "
                  >
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
