import { CheckCircle, MessageSquare, Bell } from "lucide-react";

import { ActivityItem } from "@/features/Dashboard/types/dashboard";

interface Props {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: Props) {
  const getConfig = (type: ActivityItem["type"]) => {
    switch (type) {
      case "completed":
        return {
          icon: <CheckCircle size={16} />,

          bg: `
            bg-emerald-50
            dark:bg-emerald-500/10
          `,

          iconBg: `
            bg-emerald-100 text-emerald-600

            dark:bg-emerald-500/15
            dark:text-emerald-400
          `,

          border: `
            border-emerald-200
            dark:border-emerald-500/10
          `,
        };

      case "comment":
        return {
          icon: <MessageSquare size={16} />,

          bg: `
            bg-yellow-50
            dark:bg-yellow-500/10
          `,

          iconBg: `
            bg-yellow-100 text-yellow-600

            dark:bg-yellow-500/15
            dark:text-yellow-400
          `,

          border: `
            border-yellow-200
            dark:border-yellow-500/10
          `,
        };

      case "assigned":
      default:
        return {
          icon: <Bell size={16} />,

          bg: `
            bg-indigo-50
            dark:bg-indigo-500/10
          `,

          iconBg: `
            bg-indigo-100 text-indigo-600

            dark:bg-indigo-500/15
            dark:text-indigo-400
          `,

          border: `
            border-indigo-200
            dark:border-indigo-500/10
          `,
        };
    }
  };

  return (
    <div
      className="
        bg-white/90
        dark:bg-zinc-900

        backdrop-blur-xl

        p-5 rounded-2xl

        border border-gray-200
        dark:border-zinc-800

        shadow-sm dark:shadow-none

        transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
      </div>

      {/* Activities */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {activities.map((activity) => {
          const config = getConfig(activity.type);

          return (
            <div
              key={activity.id}
              className={`
                flex items-start gap-3 p-3 rounded-xl border

                ${config.bg}
                ${config.border}

                hover:shadow-sm
                hover:-translate-y-[1px]

                dark:hover:border-zinc-700

                transition-all duration-200
              `}
            >
              {/* Icon */}
              <div
                className={`
                  p-2 rounded-lg
                  flex items-center justify-center

                  ${config.iconBg}
                `}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="
                    text-sm font-medium
                    text-gray-800
                    dark:text-zinc-100

                    break-words
                  "
                >
                  {activity.text}
                </p>

                <p
                  className="
                    text-xs mt-1
                    text-gray-500
                    dark:text-zinc-400
                  "
                >
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {activities.length === 0 && (
          <p
            className="
              text-sm text-center py-6
              text-gray-400
              dark:text-zinc-500
            "
          >
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
