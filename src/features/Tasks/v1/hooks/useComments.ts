import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockComments } from "../mock/taskMockData";
import type { TaskComment } from "../Task.types";

let store: Record<string, TaskComment[]> = { ...mockComments };

export function useComments(taskId: string | undefined) {
  return useQuery<TaskComment[]>({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return store[taskId ?? ""] ?? [];
    },
    enabled: !!taskId,
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, text }: { taskId: string; text: string }): Promise<TaskComment> => {
      await new Promise((r) => setTimeout(r, 300));
      const comment: TaskComment = {
        id: `cmt-${Date.now()}`,
        taskId,
        author: "Organizer",
        avatar: `https://ui-avatars.com/api/?name=Organizer&background=6366f1&color=fff&size=96&bold=true&rounded=true`,
        text,
        createdAt: new Date().toISOString(),
      };
      store = { ...store, [taskId]: [...(store[taskId] ?? []), comment] };
      return comment;
    },
    onSuccess: (comment) => {
      qc.invalidateQueries({ queryKey: ["comments", comment.taskId] });
    },
  });
}
