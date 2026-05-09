import { CheckCircle, MessageSquare, Bell } from "lucide-react";
import { ActivityItem } from "@/features/Dashboard/types/dashboard";
import { useTheme } from "@/theme";

interface Props {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: Props) {
  const { theme } = useTheme();

  const getConfig = (type: ActivityItem["type"]) => {
    switch (type) {
      case "completed":
        return { icon: <CheckCircle size={15} />, color: theme.success.default, subtle: theme.success.subtle };
      case "comment":
        return { icon: <MessageSquare size={15} />, color: theme.warning.default, subtle: theme.warning.subtle };
      default:
        return { icon: <Bell size={15} />, color: theme.primary.default, subtle: theme.primary.subtle };
    }
  };

  return (
    <div className="cd-card">
      <h3 className="cd-section-title">Activity Feed</h3>

      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {activities.map((activity) => {
          const cfg = getConfig(activity.type);
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 hover:-translate-y-[1px]"
              style={{ backgroundColor: cfg.subtle, borderColor: theme.border.subtle }}
            >
              <div
                className="p-1.5 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: cfg.subtle, color: cfg.color }}
              >
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium break-words" style={{ color: theme.text.primary }}>
                  {activity.text}
                </p>
                <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: theme.text.muted }}>
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
