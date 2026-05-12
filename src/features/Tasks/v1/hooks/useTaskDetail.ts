import { useQuery } from "@tanstack/react-query";
import { taskStore } from "../mock/taskStore";
import { mockActivity } from "../mock/taskMockData";
import type { Task, ActivityEvent } from "../Task.types";

export function useTaskDetail(taskId: string | undefined) {
  return useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      // Reads from shared store — sees tasks created in useTasks
      const task = taskStore.getById(taskId ?? "");
      if (!task) throw new Error("Task not found");
      return task;
    },
    enabled: !!taskId,
    retry: false,
  });
}

export function useTaskActivity(taskId: string | undefined) {
  return useQuery<ActivityEvent[]>({
    queryKey: ["task-activity", taskId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return (mockActivity[taskId ?? ""] ?? []).slice().reverse();
    },
    enabled: !!taskId,
  });
}
