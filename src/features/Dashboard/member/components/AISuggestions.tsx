import { Sparkles } from "lucide-react";

import { Task } from "@/features/Dashboard/member/types/dashboard";
import { getAISuggestions } from "@/utils/aisuggestions";

interface Props {
  tasks: Task[];
}

export default function AISuggestions({ tasks }: Props) {
  const suggestions = getAISuggestions(tasks);

  return (
    <div
      className="
        bg-white/90
        dark:bg-zinc-900

        border border-gray-200
        dark:border-zinc-800

        rounded-2xl
        p-5

        shadow-sm dark:shadow-none

        hover:shadow-md
        dark:hover:border-zinc-700

        transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div
            className="
              p-2 rounded-xl

              bg-indigo-100
              dark:bg-indigo-500/15

              text-indigo-600
              dark:text-indigo-400
            "
          >
            <Sparkles size={16} />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Suggestions</h3>
        </div>

        <span
          className="
            text-xs font-medium

            text-indigo-600
            dark:text-indigo-400
          "
        >
          Smart Insights
        </span>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className={`
              p-3 rounded-xl text-sm
              border

              transition-all duration-200

              hover:shadow-sm
              hover:-translate-y-[1px]

              break-words

              ${
                i === 0
                  ? `
                    bg-green-50
                    border-green-100

                    dark:bg-green-500/10
                    dark:border-green-500/10
                  `
                  : `
                    bg-gray-50
                    border-gray-100

                    dark:bg-zinc-800/50
                    dark:border-zinc-700
                  `
              }
            `}
          >
            <span
              className="
                text-gray-800
                dark:text-zinc-100
              "
            >
              {s}
            </span>
          </div>
        ))}

        {/* Empty State */}
        {suggestions.length === 0 && (
          <p
            className="
              text-sm text-center py-4
              text-gray-400
              dark:text-zinc-500
            "
          >
            No AI suggestions available
          </p>
        )}
      </div>
    </div>
  );
}
