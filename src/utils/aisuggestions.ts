import { Task } from "@/features/Dashboard/member/types/dashboard";

export const getAISuggestions = (tasks: Task[]): string[] => {
  const now = new Date();

  const suggestions: string[] = [];

  tasks.forEach((task) => {
    if (!task.deadline || task.status === "completed") return;

    const deadline = new Date(task.deadline);

    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    // OVERDUE
    if (diffHours <= 0) {
      suggestions.push(`🚨 "${task.title}" is overdue — take immediate action`);
    }

    // DUE TODAY
    else if (diffHours <= 24) {
      suggestions.push(`⚠️ Focus on "${task.title}" — due today`);
    }

    //  DUE TOMORROW
    else if (diffHours <= 48) {
      suggestions.push(`⏳ Start "${task.title}" — due tomorrow`);
    }

    // UPCOMING (2–3 days)
    else if (diffHours <= 72) {
      suggestions.push(`📅 Plan ahead: "${task.title}" due soon`);
    }
  });

  // top 5 suggestions
  return suggestions.slice(0, 5);
};
