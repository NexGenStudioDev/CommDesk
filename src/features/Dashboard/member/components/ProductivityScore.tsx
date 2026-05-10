import { calculateProductivityScore } from "@/utils/productivity";

import { Performance } from "@/features/Dashboard/member/types/dashboard";

interface Props {
  data: Performance;
}

export default function ProductivityScore({ data }: Props) {
  const score = calculateProductivityScore(data);

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
      <h3
        className="
          text-lg font-semibold mb-5

          text-gray-900
          dark:text-white
        "
      >
        Productivity Score
      </h3>

      {/* Score Circle */}
      <div className="flex justify-center mb-6">
        <div
          className="
            relative

            w-28 h-28

            flex items-center justify-center

            group cursor-pointer
          "
        >
          {/* Outer Ring */}
          <div
            className="
              absolute inset-0 rounded-full

              border-4

              border-yellow-300
              dark:border-yellow-500/30

              opacity-50

              group-hover:scale-105

              transition-all duration-300
            "
          />

          {/* Inner Ring */}
          <div
            className="
              w-full h-full rounded-full

              border-4

              border-indigo-500
              dark:border-indigo-400

              flex items-center justify-center

              shadow-inner
              dark:shadow-none

              bg-white
              dark:bg-zinc-900

              group-hover:shadow-md

              transition-all duration-300
            "
          >
            <span
              className="
                text-3xl font-bold

                text-indigo-600
                dark:text-indigo-400
              "
            >
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Completion */}
        <div
          className="
            p-4 rounded-2xl

            bg-indigo-50
            dark:bg-indigo-500/10

            border border-indigo-100
            dark:border-indigo-500/10

            cursor-pointer

            hover:bg-indigo-100
            dark:hover:bg-indigo-500/15

            hover:-translate-y-[1px]
            hover:shadow-sm

            transition-all duration-200
          "
          onClick={() => alert("View completion details")}
        >
          <p
            className="
              text-xs mb-1

              text-gray-500
              dark:text-zinc-400
            "
          >
            Completion
          </p>

          <p
            className="
              text-lg font-semibold

              text-indigo-600
              dark:text-indigo-400
            "
          >
            {data.completionRate}%
          </p>
        </div>

        {/* Streak */}
        <div
          className="
            p-4 rounded-2xl

            bg-yellow-50
            dark:bg-yellow-500/10

            border border-yellow-100
            dark:border-yellow-500/10

            cursor-pointer

            hover:bg-yellow-100
            dark:hover:bg-yellow-500/15

            hover:-translate-y-[1px]
            hover:shadow-sm

            transition-all duration-200
          "
          onClick={() => alert("View streak details")}
        >
          <p
            className="
              text-xs mb-1

              text-gray-500
              dark:text-zinc-400
            "
          >
            Streak
          </p>

          <p
            className="
              text-lg font-semibold

              text-yellow-600
              dark:text-yellow-400
            "
          >
            {data.streak} days
          </p>
        </div>
      </div>

      {/* Weekly Progress */}
      <div>
        <div
          className="
            flex justify-between mb-2

            text-xs font-medium

            text-gray-500
            dark:text-zinc-400
          "
        >
          <span>Weekly Tasks</span>

          <span>{data.weeklyCompleted}</span>
        </div>

        <div
          className="
            w-full h-2 rounded-full overflow-hidden

            bg-gray-100
            dark:bg-zinc-800
          "
        >
          <div
            className="
              h-2 rounded-full

              bg-indigo-500

              transition-all duration-700
            "
            style={{
              width: `${Math.min(data.weeklyCompleted * 10, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
