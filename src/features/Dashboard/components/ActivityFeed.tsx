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
          bg: "bg-emerald-50",
          iconBg: "bg-emerald-100 text-emerald-600",
          border: "border-emerald-200",
        };

      case "comment":
        return {
          icon: <MessageSquare size={16} />,
          bg: "bg-yellow-50",
          iconBg: "bg-yellow-100 text-yellow-600",
          border: "border-yellow-200",
        };

      case "assigned":
      default:
        return {
          icon: <Bell size={16} />,
          bg: "bg-indigo-50",
          iconBg: "bg-indigo-100 text-indigo-600",
          border: "border-indigo-200",
        };
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/40 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Activity Feed</h3>
      </div>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
        {activities.map((activity) => {
          const config = getConfig(activity.type);

          return (
            <div
              key={activity.id}
              className={`
                flex items-start gap-3 p-3 rounded-xl border
                ${config.bg} ${config.border}
                hover:shadow-sm hover:-translate-y-[1px]
                transition-all duration-200
              `}
            >
              {/* Icon */}
              <div
                className={`
                  p-2 rounded-lg flex items-center justify-center
                  ${config.iconBg}
                `}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium break-words">{activity.text}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
}
