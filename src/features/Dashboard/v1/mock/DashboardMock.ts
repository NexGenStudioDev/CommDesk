import { Task } from "../types/task";

export const mockTasks: Task[] = [ 
  {
    id: 1,
    title: "Fix login bug",
    status: "completed",
    deadline: "2026-05-01",
    completedAt: "2026-05-01",
  },
  {
    id: 2,
    title: "Design homepage",
    status: "completed",
    deadline: new Date().toISOString(),
    completedAt: "2026-04-28", // last month
  },
  {
    id: 3,
    title: "Prepare report",
    status: "in-progress",
    deadline: new Date(Date.now() + 86400000).toISOString(),
  },
];