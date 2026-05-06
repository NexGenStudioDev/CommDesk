export const calculateProductivityScore = (data: {
  completionRate: number;
  streak: number;
  weeklyCompleted: number;
}) => {
  const { completionRate, streak, weeklyCompleted } = data;

  let score =
    completionRate * 0.5 +
    Math.min(streak * 5, 100) * 0.2 +
    Math.min(weeklyCompleted * 10, 100) * 0.3;

  return Math.round(Math.min(score, 100));
};