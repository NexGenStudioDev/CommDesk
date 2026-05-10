import { AlertTriangle, Clock } from "lucide-react";

import { Task } from "@/features/Dashboard/member/types/dashboard";

import { getSmartReminders } from "@/utils/reminders";

interface Props {
  tasks: Task[];
}

export default function SmartReminders({ tasks }: Props) {
  const reminders = getSmartReminders(tasks);

  const urgent = reminders.filter((r) => r.type === "urgent");

  const upcoming = reminders.filter((r) => r.type === "upcoming");

  return (
    <div
      className="
        bg-white/90
        dark:bg-zinc-900

        border border-gray-200
        dark:border-zinc-800

        backdrop-blur-xl

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
        Smart Reminders
      </h3>

      {/* Urgent */}
      {urgent.length > 0 && (
        <div className="mb-5">
          <p
            className="
              text-xs font-semibold uppercase tracking-wide

              text-red-500
              dark:text-red-400

              mb-3
            "
          >
            Urgent
          </p>

          <div className="space-y-3">
            {urgent.map((r, i) => (
              <div
                key={i}
                className="
                  flex items-start gap-3

                  p-4 rounded-2xl

                  bg-red-50
                  dark:bg-red-500/10

                  border border-red-100
                  dark:border-red-500/10

                  hover:bg-red-100
                  dark:hover:bg-red-500/15

                  hover:shadow-sm
                  hover:-translate-y-[1px]

                  transition-all duration-200

                  cursor-pointer
                "
              >
                {/* Icon */}
                <div
                  className="
                    p-2 rounded-xl

                    bg-red-100
                    dark:bg-red-500/15

                    text-red-600
                    dark:text-red-400

                    mt-[2px]
                  "
                >
                  <AlertTriangle size={16} />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <p
                    className="
                      text-sm font-medium

                      text-gray-800
                      dark:text-white

                      break-words
                    "
                  >
                    {r.title}
                  </p>

                  <p
                    className="
                      text-xs mt-1

                      text-red-600
                      dark:text-red-300
                    "
                  >
                    {r.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <p
            className="
              text-xs font-semibold uppercase tracking-wide

              text-yellow-600
              dark:text-yellow-400

              mb-3
            "
          >
            Upcoming
          </p>

          <div className="space-y-3">
            {upcoming.map((r, i) => (
              <div
                key={i}
                className="
                  flex items-start gap-3

                  p-4 rounded-2xl

                  bg-yellow-50
                  dark:bg-yellow-500/10

                  border border-yellow-100
                  dark:border-yellow-500/10

                  hover:bg-yellow-100
                  dark:hover:bg-yellow-500/15

                  hover:shadow-sm
                  hover:-translate-y-[1px]

                  transition-all duration-200

                  cursor-pointer
                "
              >
                {/* Icon */}
                <div
                  className="
                    p-2 rounded-xl

                    bg-yellow-100
                    dark:bg-yellow-500/15

                    text-yellow-600
                    dark:text-yellow-400

                    mt-[2px]
                  "
                >
                  <Clock size={16} />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <p
                    className="
                      text-sm font-medium

                      text-gray-800
                      dark:text-white

                      break-words
                    "
                  >
                    {r.title}
                  </p>

                  <p
                    className="
                      text-xs mt-1

                      text-yellow-700
                      dark:text-yellow-300
                    "
                  >
                    {r.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {reminders.length === 0 && (
        <div
          className="
            py-8 text-center

            text-sm

            text-gray-400
            dark:text-zinc-500
          "
        >
          🎉 You're all caught up!
        </div>
      )}
    </div>
  );
}
