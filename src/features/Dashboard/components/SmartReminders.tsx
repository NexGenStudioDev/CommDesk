import { AlertTriangle, Clock } from "lucide-react";
import { Task } from "@/features/Dashboard/types/dashboard";
import { getSmartReminders } from "@/utils/reminders";

interface Props {
  tasks: Task[];
}

export default function SmartReminders({ tasks }: Props) {
  const reminders = getSmartReminders(tasks);

  const urgent = reminders.filter((r) => r.type === "urgent");
  const upcoming = reminders.filter((r) => r.type === "upcoming");

  return (
    <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/40 shadow-sm">
      {/* Header */}
      <h3 className="font-semibold text-lg mb-4">Smart Reminders</h3>

      {/* 🔴 URGENT */}
      {urgent.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-red-500 mb-2 font-medium">Urgent</p>

          <div className="space-y-2">
            {urgent.map((r, i) => (
              <div
                key={i}
                className="
                  flex items-start gap-3 p-3 rounded-xl
                  bg-red-50 border border-red-100
                  hover:bg-red-100 transition cursor-pointer
                "
              >
                <div className="text-red-600 mt-[2px]">
                  <AlertTriangle size={16} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">{r.title}</p>
                  <p className="text-xs text-red-600">{r.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🟡 UPCOMING */}
      {upcoming.length > 0 && (
        <div>
          <p className="text-xs text-yellow-600 mb-2 font-medium">Upcoming</p>

          <div className="space-y-2">
            {upcoming.map((r, i) => (
              <div
                key={i}
                className="
                  flex items-start gap-3 p-3 rounded-xl
                  bg-yellow-50 border border-yellow-100
                  hover:bg-yellow-100 transition cursor-pointer
                "
              >
                <div className="text-yellow-600 mt-[2px]">
                  <Clock size={16} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">{r.title}</p>
                  <p className="text-xs text-yellow-700">{r.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {reminders.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">🎉 You're all caught up!</p>
      )}
    </div>
  );
}
