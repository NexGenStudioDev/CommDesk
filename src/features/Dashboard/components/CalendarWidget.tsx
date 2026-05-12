import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { CalendarData, CalendarEvent } from "@/features/Dashboard/Member/v1/Type/dashboard";

interface Props {
  data: CalendarData;
}

export default function CalendarWidget({ data }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Reset selectedDay to today when navigating months
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const dates: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventMap: Record<number, CalendarEvent[]> = {};
  data.events.forEach((e) => {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push(e);
    }
  });

  const selectedEvents = selectedDay && eventMap[selectedDay] ? eventMap[selectedDay] : [];
  const changeMonth = (offset: number) => setCurrentDate(new Date(year, month + offset, 1));
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="cd-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={17} style={{ color: "var(--cd-primary)" }} />
          <h3 className="cd-section-title" style={{ marginBottom: 0 }}>
            Calendar
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--cd-text-2)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--cd-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
            }
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs font-medium px-1" style={{ color: "var(--cd-text-2)" }}>
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--cd-text-2)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--cd-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
            }
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-xs mb-2" style={{ color: "var(--cd-text-muted)" }}>
        {days.map((d) => (
          <div key={d} className="text-center font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dates.map((d, i) => {
          if (!d) return <div key={i} />;
          const hasEvents = eventMap[d];
          const isSelected = selectedDay === d;
          const isTodayDay = isToday(d);

          return (
            <div
              key={i}
              onClick={() => setSelectedDay(d)}
              className="relative h-8 sm:h-9 text-xs flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150"
              style={{
                backgroundColor: isSelected
                  ? "var(--cd-primary)"
                  : isTodayDay
                    ? "var(--cd-primary-subtle)"
                    : hasEvents
                      ? "var(--cd-warning-subtle)"
                      : "transparent",
                color: isSelected
                  ? "#ffffff"
                  : isTodayDay
                    ? "var(--cd-primary-text)"
                    : hasEvents
                      ? "var(--cd-warning)"
                      : "var(--cd-text)",
              }}
            >
              {d}
              {hasEvents && !isSelected && (
                <span
                  className="absolute bottom-0.5 w-1 h-1 rounded-full"
                  style={{ backgroundColor: "var(--cd-warning)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium mb-2" style={{ color: "var(--cd-text-2)" }}>
          {selectedDay ? `Events on ${selectedDay}` : "Select a date"}
        </p>
        {selectedDay && selectedEvents.length === 0 && (
          <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
            No events for this day
          </p>
        )}
        {selectedEvents.map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 mb-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--cd-surface-2)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--cd-warning)" }}
            />
            <span className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
              {e.time}
            </span>
            <span className="text-xs font-medium" style={{ color: "var(--cd-text)" }}>
              {e.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
