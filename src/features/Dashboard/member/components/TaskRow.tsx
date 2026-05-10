import { Task } from "@/features/Dashboard/member/types/dashboard";
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
        group

        flex items-center justify-between

        gap-4

        p-4 rounded-2xl

        transition-all duration-200

        border

        ${
          urgent
            ? `
              border-red-200
              bg-red-50/70

              dark:border-red-500/20
              dark:bg-red-500/10
            `
            : `
              border-gray-100
              bg-white

              dark:border-zinc-800
              dark:bg-zinc-900
            `
        }

        hover:shadow-sm
        hover:-translate-y-[1px]

        dark:hover:border-zinc-700
      `}
    >
      {/* Left */}
      <div className="min-w-0 flex-1">
        <p
          className="
            text-sm font-semibold

            text-gray-800
            dark:text-white

            break-words
          "
        >
          {task.title || "Untitled Task"}
        </p>

        <p
          className={`
            text-xs mt-1

            ${
              urgent
                ? `
                  text-red-500
                  dark:text-red-400
                `
                : `
                  text-gray-400
                  dark:text-zinc-500
                `
            }
          `}
        >
          {formatDueLabel(task.deadline)}
        </p>
      </div>

      {/* Action */}
      <button
        className="
          p-2.5 rounded-xl

          bg-green-50
          dark:bg-green-500/10

          text-green-600
          dark:text-green-400

          hover:bg-green-100
          dark:hover:bg-green-500/20

          transition-all duration-200

          shrink-0
        "
      >
        <Check size={16} />
      </button>
    </div>
  );
}
