export type Task = {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "completed";
  deadline: string;
  completedAt?: string;
};