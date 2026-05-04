import { CalendarDays } from "lucide-react";
import { CalendarData } from "@/features/Dashboard/types/dashboard";

interface Props {
  data: CalendarData;
}

export default function CalendarWidget({ data }: Props) {
  const today = new Date();
  const currentDay = today.getDate();

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const eventMap: Record<number, any[]> = {};
  data.events.forEach((e) => {
    const d = new Date(e.date).getDate();
    if (!eventMap[d]) eventMap[d] = [];
    eventMap[d].push(e);
  });

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-indigo-500" />
          <h3 className="font-semibold text-lg">Calendar</h3>
        </div>
        <span className="text-sm text-gray-500">
          {today.toLocaleString("default", { month: "long" })}
        </span>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dates.map((d) => {
          const hasEvents = eventMap[d];

          return (
            <div
              key={d}
              className={`
                relative h-10 flex items-center justify-center rounded-xl text-sm
                transition-all duration-200 cursor-pointer

                ${
                  d === currentDay
                    ? "bg-indigo-500 text-white shadow-md scale-[1.05]"
                    : hasEvents
                      ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                }
              `}
            >
              {d}

              {/*Indicator */}
              {hasEvents && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Upcoming</p>

        {data.events.slice(0, 3).map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-yellow-50 transition"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-500">{e.time}</span>
            <span className="text-sm text-gray-800">{e.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
