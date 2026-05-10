import { Task } from "@/features/Dashboard/member/types/dashboard";

export type Reminder = {
  title: string;
  label: string;
  type: "urgent" | "upcoming";
};

export const getSmartReminders = (tasks: Task[]): Reminder[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminders: Reminder[] = [];

  tasks.forEach((task) => {
    if (!task.deadline || task.status === "completed") return;

    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    //urgent tasks
    if (daysLeft <= 1) {
      reminders.push({
        title: task.title,
        label:
          daysLeft < 0
            ? "Overdue"
            : daysLeft === 0
            ? "Due today"
            : "Due tomorrow",
        type: "urgent",
      });
    }

    // upcoming tasks
    else if (daysLeft <= 3) {
      reminders.push({
        title: task.title,
        label: `Due in ${daysLeft} days`,
        type: "upcoming",
      });
    }
  });

  //sorting acc to priority
  return reminders
    .sort((a, b) => (a.type === "urgent" ? -1 : 1))
    .slice(0, 5);
};