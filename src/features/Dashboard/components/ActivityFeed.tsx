import { CheckCircle, MessageSquare, Bell } from "lucide-react";

import { ActivityItem } from "@/features/Dashboard/types/dashboard";

interface Props {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: Props) {
  const getConfig = (text: string) => {
    if (text.toLowerCase().includes("completed")) {
      return {
        icon: <CheckCircle size={16} />,
        bg: "bg-emerald-50",
        iconBg: "bg-emerald-100 text-emerald-600",
        border: "border-emerald-200",
      };
    }

    if (text.toLowerCase().includes("comment")) {
      return {
        icon: <MessageSquare size={16} />,
        bg: "bg-yellow-50",
        iconBg: "bg-yellow-100 text-yellow-600",
        border: "border-yellow-200",
      };
    }

    return {
      icon: <Bell size={16} />,
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100 text-indigo-600",
      border: "border-indigo-200",
    };
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Activity</h3>
        <span className="text-xs text-gray-400">Latest</span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">No recent activity</div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => {
            const config = getConfig(a.text);

            return (
              <div
                key={a.id}
                className={`
                  relative flex items-start gap-3 p-3 rounded-xl
                  transition-all duration-200 cursor-pointer
                  ${config.bg} border ${config.border}
                  hover:shadow-sm hover:-translate-y-[1px]
                `}
              >
                {/* Left accent */}
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-transparent to-gray-300 opacity-30" />

                {/* Icon */}
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-lg ${config.iconBg}`}
                >
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm text-gray-800 leading-snug">{a.text}</p>

                  <p className="text-xs text-gray-500 mt-1">{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
