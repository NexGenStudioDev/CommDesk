export type Activity = {
  id: number;
  type: "task" | "comment" | "event";
  message: string;
  time: string;
};

export const mockActivities: Activity[] = [
  {
    id: 1,
    type: "task",
    message: "You were assigned 'Fix login bug'",
    time: "2026-05-01T10:00:00",
  },
  {
    id: 2,
    type: "comment",
    message: "New comment on 'Design homepage'",
    time: "2026-05-01T08:00:00",
  },
  {
    id: 3,
    type: "event",
    message: "Hackathon starts tomorrow",
    time: "2026-04-30T18:00:00",
  },
];