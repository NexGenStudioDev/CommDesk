import { Task } from "@/features/Dashboard/member/types/dashboard";

import { categorizeTasks } from "@/utils/task.utils";

import TaskRow from "@/features/Dashboard/member/components/TaskRow";

interface Props {
  tasks: Task[];
}

export default function UpcomingUrgentTasks({ tasks }: Props) {
  if (!tasks || !Array.isArray(tasks)) {
    return (
      <div
        className="
          bg-white
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
          No tasks available
        </p>
      </div>
    );
  }

  const { urgent, upcoming } = categorizeTasks(tasks);

  return (
    <div
      className="
        relative overflow-hidden

        bg-white
        dark:bg-zinc-900

        border border-gray-200
        dark:border-zinc-800

        rounded-3xl

        p-5

        shadow-sm
        hover:shadow-lg

        transition-all duration-300
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute -top-16 -right-16

          w-44 h-44

          rounded-full

          bg-indigo-500/5
          dark:bg-indigo-400/10

          blur-3xl
        "
      />

      {/* Header */}
      <div
        className="
          relative z-10

          flex items-center justify-between

          mb-6
        "
      >
        <div>
          <h3
            className="
              text-xl font-semibold

              text-gray-900
              dark:text-white
            "
          >
            Upcoming & Urgent Tasks
          </h3>

          <p
            className="
              text-sm mt-1

              text-gray-500
              dark:text-zinc-400
            "
          >
            Stay on top of deadlines
          </p>
        </div>

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

      {/* Urgent */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="
              w-2 h-2 rounded-full

              bg-red-500
            "
          />

          <p
            className="
              text-sm font-semibold

              text-red-500
              dark:text-red-400
            "
          >
            Urgent Tasks
          </p>
        </div>

        {urgent.length === 0 ? (
          <p
            className="
              text-sm

              text-gray-400
              dark:text-zinc-500
            "
          >
            No urgent tasks
          </p>
        ) : (
          <div className="space-y-3">
            {urgent.slice(0, 4).map((task) => (
              <TaskRow key={task.id} task={task} urgent />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="
              w-2 h-2 rounded-full

              bg-indigo-500
            "
          />

          <p
            className="
              text-sm font-semibold

              text-gray-700
              dark:text-zinc-300
            "
          >
            Upcoming Tasks
          </p>
        </div>

        {upcoming.length === 0 ? (
          <p
            className="
              text-sm

              text-gray-400
              dark:text-zinc-500
            "
          >
            No upcoming tasks
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 4).map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
