import { useState, useEffect } from "react";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

import { CalendarData } from "@/features/Dashboard/member/types/dashboard";

interface Props {
  data: CalendarData;
}

export default function CalendarWidget({ data }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Leap-safe month days
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Month alignment
  const firstDay = new Date(year, month, 1).getDay();

  // Auto-select today
  useEffect(() => {
    setSelectedDay(new Date().getDate());
  }, [month, year]);

  const today = new Date();

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Grid
  const dates: (number | null)[] = [
    ...Array(firstDay).fill(null),

    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Events map
  const eventMap: Record<number, any[]> = {};

  data.events.forEach((e) => {
    const eventDate = new Date(e.date);

    if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
      const day = eventDate.getDate();

      if (!eventMap[day]) {
        eventMap[day] = [];
      }

      eventMap[day].push(e);
    }
  });

  const selectedEvents = selectedDay && eventMap[selectedDay] ? eventMap[selectedDay] : [];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

        transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div
            className="
              p-2 rounded-xl

              bg-indigo-100
              dark:bg-indigo-500/15

              text-indigo-600
              dark:text-indigo-400
            "
          >
            <CalendarDays size={16} />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calendar</h3>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="
              p-2 rounded-lg

              hover:bg-gray-100
              dark:hover:bg-zinc-800

              transition
            "
          >
            <ChevronLeft size={16} className="text-gray-600 dark:text-zinc-300" />
          </button>

          <span
            className="
              text-sm font-medium

              text-gray-700
              dark:text-zinc-200
            "
          >
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button
            onClick={() => changeMonth(1)}
            className="
              p-2 rounded-lg

              hover:bg-gray-100
              dark:hover:bg-zinc-800

              transition
            "
          >
            <ChevronRight size={16} className="text-gray-600 dark:text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div
        className="
          grid grid-cols-7 mb-3
          text-xs font-medium

          text-gray-500
          dark:text-zinc-500
        "
      >
        {days.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {dates.map((d, i) => {
          if (!d) {
            return <div key={i} />;
          }

          const hasEvents = eventMap[d];

          return (
            <div
              key={i}
              onClick={() => setSelectedDay(d)}
              className={`
                relative

                h-9 sm:h-10

                text-xs sm:text-sm

                flex items-center justify-center

                rounded-xl

                cursor-pointer

                transition-all duration-200

                ${
                  selectedDay === d
                    ? `
                      bg-indigo-600
                      text-white
                      shadow-md
                    `
                    : isToday(d)
                      ? `
                      bg-indigo-500
                      text-white
                    `
                      : hasEvents
                        ? `
                      bg-yellow-50
                      text-yellow-700
                      border border-yellow-100

                      hover:bg-yellow-100

                      dark:bg-yellow-500/10
                      dark:text-yellow-300
                      dark:border-yellow-500/10
                      dark:hover:bg-yellow-500/20
                    `
                        : `
                      bg-gray-50
                      text-gray-700

                      hover:bg-gray-100

                      dark:bg-zinc-800/50
                      dark:text-zinc-300
                      dark:hover:bg-zinc-800
                    `
                }
              `}
            >
              {d}

              {/* Event Dot */}
              {hasEvents && (
                <span
                  className="
                    absolute bottom-1

                    w-1.5 h-1.5 rounded-full

                    bg-yellow-500
                    dark:bg-yellow-400
                  "
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Events */}
      <div className="mt-6">
        <p
          className="
            text-sm font-medium mb-3

            text-gray-800
            dark:text-white
          "
        >
          {selectedDay ? `Events on ${selectedDay}` : "Select a date"}
        </p>

        {selectedDay && selectedEvents.length === 0 && (
          <p
            className="
                text-xs

                text-gray-400
                dark:text-zinc-500
              "
          >
            No events for this day
          </p>
        )}

        <div className="space-y-2">
          {selectedEvents.map((e, i) => (
            <div
              key={i}
              className="
                flex items-center gap-3

                p-3 rounded-xl

                bg-gray-50
                dark:bg-zinc-800/50

                border border-gray-100
                dark:border-zinc-700

                hover:bg-yellow-50
                dark:hover:bg-yellow-500/10

                transition-all duration-200
              "
            >
              <span
                className="
                  w-2 h-2 rounded-full

                  bg-yellow-500
                  dark:bg-yellow-400
                "
              />

              <span
                className="
                  text-xs

                  text-gray-500
                  dark:text-zinc-400
                "
              >
                {e.time}
              </span>

              <span
                className="
                  text-sm break-words

                  text-gray-800
                  dark:text-zinc-100
                "
              >
                {e.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
