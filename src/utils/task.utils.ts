import { Task } from "@/features/Dashboard/member/types/dashboard";

export const categorizeTasks = (tasks: Task[]) => {
  const now = new Date();

  const urgent: Task[] = [];
  const upcoming: Task[] = [];

  tasks.forEach((task) => {
    if (!task?.deadline) return;

    const deadline = new Date(task.deadline);

    if (isNaN(deadline.getTime())) return;

    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 48 && diffHours > 0) {
      urgent.push(task);
    } else if (diffHours > 48) {
      upcoming.push(task);
    }
  });

  return { urgent, upcoming };
};

export const formatDueLabel = (date: string) => {
  if (!date) return "No deadline";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  const diffDays = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return "Due Today";
  if (diffDays === 1) return "Due Tomorrow";
  if (diffDays < 0) return "Overdue";

  return `Due in ${diffDays} days`;
};
