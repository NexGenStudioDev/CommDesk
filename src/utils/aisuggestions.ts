import { Task } from "@/features/Dashboard/types/dashboard";

export const getAISuggestions = (tasks: Task[]) => {
  const now = new Date();

  const suggestions: string[] = [];

  tasks.forEach((task) => {
    if (!task.deadline || task.status === "completed") return;

    const deadline = new Date(task.deadline);
    const diffHours =
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 24 && diffHours > 0) {
      suggestions.push(`Focus on "${task.title}" — due today`);
    } else if (diffHours <= 48) {
      suggestions.push(`Start "${task.title}" — deadline approaching`);
    }
  });

  if (suggestions.length === 0) {
    suggestions.push("You're on track — keep up the consistency!");
  }

  return suggestions.slice(0, 3);
};