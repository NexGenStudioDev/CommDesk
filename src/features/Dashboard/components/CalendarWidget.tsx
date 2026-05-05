import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { CalendarData } from "@/features/Dashboard/types/dashboard";

interface Props {
  data: CalendarData;
}

export default function CalendarWidget({ data }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // ✅ Days in month (leap-safe)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // ✅ First day alignment
  const firstDay = new Date(year, month, 1).getDay();

  // ✅ Auto-select today
  useEffect(() => {
    setSelectedDay(new Date().getDate());
  }, [month, year]);

  const today = new Date();

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // ✅ Build grid
  const dates: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // ✅ FIXED event mapping (month + year safe)
  const eventMap: Record<number, any[]> = {};

  data.events.forEach((e) => {
    const eventDate = new Date(e.date);

    if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
      const day = eventDate.getDate();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push(e);
    }
  });

  // ✅ Selected day events
  const selectedEvents = selectedDay && eventMap[selectedDay] ? eventMap[selectedDay] : [];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/40 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-indigo-500" />
          <h3 className="font-semibold text-lg">Calendar</h3>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth(-1)} className="p-1 rounded-md hover:bg-gray-100">
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm font-medium text-gray-600">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button onClick={() => changeMonth(1)} className="p-1 rounded-md hover:bg-gray-100">
            <ChevronRight size={16} />
          </button>
        </div>
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
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {dates.map((d, i) => {
          if (!d) return <div key={i} />;

          const hasEvents = eventMap[d];

          return (
            <div
              key={i}
              onClick={() => setSelectedDay(d)}
              className={`
                relative h-8 sm:h-10 text-xs sm:text-sm flex items-center justify-center rounded-xl
                cursor-pointer transition-all duration-200

                ${
                  selectedDay === d
                    ? "bg-indigo-600 text-white shadow-md"
                    : isToday(d)
                      ? "bg-indigo-500 text-white"
                      : hasEvents
                        ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {d}

              {/* Event dot */}
              {hasEvents && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Events */}
      <div className="mt-5">
        <p className="text-sm font-medium mb-2">
          {selectedDay ? `Events on ${selectedDay}` : "Select a date"}
        </p>

        {selectedDay && selectedEvents.length === 0 && (
          <p className="text-xs text-gray-400">No events for this day</p>
        )}

        {selectedEvents.map((e, i) => (
          <div
            key={i}
            className="
              flex items-center gap-2 p-2 mb-2
              rounded-lg bg-gray-50 hover:bg-yellow-50
              transition
            "
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-500">{e.time}</span>
            <span className="text-sm text-gray-800 break-words">{e.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
