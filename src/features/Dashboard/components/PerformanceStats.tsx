import { Performance } from "../types/dashboard";

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: Performance;
}

// Mock trend data
const trendData = [
  { day: "Mon", tasks: 2 },
  { day: "Tue", tasks: 4 },
  { day: "Wed", tasks: 3 },
  { day: "Thu", tasks: 5 },
  { day: "Fri", tasks: 6 },
  { day: "Sat", tasks: 4 },
  { day: "Sun", tasks: 3 },
];

export default function PerformanceStats({ data }: Props) {
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
        Performance Overview
      </h3>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Completion Rate */}
        <div
          className="
            p-4 rounded-2xl

            bg-green-50
            dark:bg-green-500/10

            border border-green-100
            dark:border-green-500/10

            hover:shadow-sm
            hover:-translate-y-[1px]

            transition-all duration-200
          "
        >
          <p
            className="
              text-xs mb-1

              text-gray-500
              dark:text-zinc-400
            "
          >
            Completion Rate
          </p>

          <p
            className="
              text-2xl font-semibold

              text-green-600
              dark:text-green-400
            "
          >
            {data.completionRate}%
          </p>
        </div>

        {/* Avg Completion */}
        <div
          className="
            p-4 rounded-2xl

            bg-indigo-50
            dark:bg-indigo-500/10

            border border-indigo-100
            dark:border-indigo-500/10

            hover:shadow-sm
            hover:-translate-y-[1px]

            transition-all duration-200
          "
        >
          <p
            className="
              text-xs mb-1

              text-gray-500
              dark:text-zinc-400
            "
          >
            Avg Completion
          </p>

          <p
            className="
              text-2xl font-semibold

              text-indigo-600
              dark:text-indigo-400
            "
          >
            {data.avgTime}
          </p>
        </div>

        {/* Streak */}
        <div
          className="
            p-4 rounded-2xl

            bg-orange-50
            dark:bg-orange-500/10

            border border-orange-100
            dark:border-orange-500/10

            hover:shadow-sm
            hover:-translate-y-[1px]

            transition-all duration-200
          "
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
              text-2xl font-semibold

              text-orange-500
              dark:text-orange-400
            "
          >
            {data.streak} days 🔥
          </p>
        </div>

        {/* Weekly Done */}
        <div
          className="
            p-4 rounded-2xl

            bg-blue-50
            dark:bg-blue-500/10

            border border-blue-100
            dark:border-blue-500/10

            hover:shadow-sm
            hover:-translate-y-[1px]

            transition-all duration-200
          "
        >
          <p
            className="
              text-xs mb-1

              text-gray-500
              dark:text-zinc-400
            "
          >
            Weekly Done
          </p>

          <p
            className="
              text-2xl font-semibold

              text-blue-600
              dark:text-blue-400
            "
          >
            {data.weeklyCompleted}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div
        className="
          h-44 rounded-2xl

          bg-gray-50
          dark:bg-zinc-800/50

          border border-gray-100
          dark:border-zinc-700

          p-3
        "
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <XAxis dataKey="day" fontSize={12} stroke="#71717a" />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #27272a",
                backgroundColor: "#18181b",
                color: "#fff",
              }}
            />

            <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
