export type CalendarItem = {
  id: number;
  title: string;
  date: string;
  type: "task" | "event";
};

export const mockCalendar: CalendarItem[] = [
  {
    id: 1,
    title: "Fix login bug",
    date: new Date().toISOString(),
    type: "task",
  },
  {
    id: 2,
    title: "Team meeting",
    date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    type: "event",
  },
  {
    id: 3,
    title: "Submit report",
    date: "2026-05-05",
    type: "task",
  },
];