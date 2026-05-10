import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { Task } from "../types/dashboard";

interface Props {
  tasks: Task[];
}

export default function TaskOverview({ tasks }: Props) {
  const todo = tasks.filter((t) => t.status === "todo").length;

  const inProgress = tasks.filter((t) => t.status === "in-progress").length;

  const completed = tasks.filter((t) => t.status === "completed").length;

  const total = tasks.length;

  const data = [
    {
      name: "Todo",
      value: todo,
      color: "#facc15",
    },

    {
      name: "In Progress",
      value: inProgress,
      color: "#60a5fa",
    },

    {
      name: "Completed",
      value: completed,
      color: "#34d399",
    },
  ];

  return (
    <div
      className="
        card

        hover:shadow-md

        transition-all duration-300

        dark:bg-zinc-900
        dark:border
        dark:border-zinc-800
      "
    >
      {/* Header */}
      <h3
        className="
          section-title

          dark:text-white
        "
      >
        Task Overview
      </h3>

      <div
        className="
          flex flex-col

          sm:flex-row
          sm:items-center

          gap-4 sm:gap-6
        "
      >
        {/* Chart */}
        <div
          className="
            w-full

            max-w-[160px]
            h-[160px]

            mx-auto sm:mx-0

            relative

            shrink-0
          "
        >
          {/* Glow */}
          <div
            className="
              absolute inset-0

              rounded-full

              bg-indigo-500/10

              blur-2xl

              dark:bg-indigo-400/10
            "
          />

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div
            className="
              absolute inset-0

              flex flex-col
              items-center justify-center
            "
          >
            <p
              className="
                text-sm

                text-gray-400
                dark:text-zinc-400
              "
            >
              Total
            </p>

            <p
              className="
                text-xl font-bold

                text-gray-900
                dark:text-white
              "
            >
              {total}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 w-full">
          {data.map((item) => (
            <div
              key={item.name}
              className="
                flex items-center justify-between

                gap-2

                text-sm

                p-2 rounded-xl

                transition

                hover:bg-gray-50
                dark:hover:bg-zinc-800
              "
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <span
                  className="
                    w-3 h-3 rounded-full
                    shrink-0
                  "
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span
                  className="
                    text-sm

                    text-gray-600
                    dark:text-zinc-300
                  "
                >
                  {item.name}
                </span>
              </div>

              {/* Value */}
              <span
                className="
                  text-sm font-semibold

                  text-gray-900
                  dark:text-white
                "
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
