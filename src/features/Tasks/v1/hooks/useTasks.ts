import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isFuture, isPast, parseISO } from "date-fns";
import { taskStore } from "../mock/taskStore";
import { mockMembers } from "../mock/taskMockData";
import type { Task, TaskFilters, CreateTaskPayload, UpdateTaskPayload } from "../Task.types";

function matchesSearch(task: Task, q: string): boolean {
  const query = q.toLowerCase().trim();
  if (!query) return true;
  const deadline = parseISO(task.deadline);
  const isOverdue = isPast(deadline) && task.status !== "completed";
  const isUpcoming = isFuture(deadline);

  const fields = [
    task.title,
    task.description,
    task.priority,
    task.status,
    task.submissionType,
    task.submissionStatus,
    ...(task.technologies ?? []).map(t => t.label),
    ...(task.technologies ?? []).map(t => t.id),
    ...task.assignedTo.map(m => m.name),
    ...task.assignedTo.map(m => m.role),
    task.isMandatory ? "mandatory" : "",
    task.points !== undefined ? `${task.points} pts` : "",
    isOverdue ? "overdue past late" : "",
    isUpcoming ? "upcoming future" : "",
    task.status === "completed" ? "done complete completed" : "",
    task.status === "in-progress" ? "progress inprogress active working" : "",
    task.status === "todo" ? "todo to do open pending" : "",
    task.submissionStatus === "not-submitted" ? "not submitted missing" : "",
  ];
  const haystack = fields.join(" ").toLowerCase();
  const normalized = query
    .replaceAll("in progress", "in-progress")
    .replaceAll("not submitted", "not-submitted")
    .replaceAll("to do", "todo");
  const terms = normalized.split(/\s+/).filter(Boolean);

  return terms.every((term) => haystack.includes(term));
}

function applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((t) => {
    if (filters.status !== "all" && t.status !== filters.status) return false;
    if (filters.priority !== "all" && t.priority !== filters.priority) return false;
    if (filters.time === "upcoming"  && !isFuture(parseISO(t.deadline))) return false;
    if (filters.time === "past"      && !isPast(parseISO(t.deadline)))   return false;
    if (filters.time === "completed" && t.status !== "completed")        return false;
    if (filters.members.length > 0) {
      const ids = new Set(t.assignedTo.map((m) => m.id));
      if (!filters.members.some((id) => ids.has(id))) return false;
    }
    if (!matchesSearch(t, filters.search)) return false;
    return true;
  });
}

export function useTasks(eventId: string | null, filters: TaskFilters) {
  return useQuery<Task[]>({
    queryKey: ["tasks", eventId, filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600));
      if (!eventId) return [];
      return applyFilters(taskStore.getAll().filter((t) => t.eventId === eventId), filters);
    },
    enabled: !!eventId,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTaskPayload): Promise<Task> => {
      await new Promise((r) => setTimeout(r, 500));
      const resolvedMembers = payload.assignedTo
        .map((id) => mockMembers.find((m) => m.id === id))
        .filter(Boolean) as typeof mockMembers;

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        eventId: payload.eventId,
        status: "todo",
        priority: payload.priority,
        deadline: payload.deadline,
        assignedTo: resolvedMembers,
        submissionType: payload.submissionType,
        submissionStatus: "not-submitted",
        isMandatory: payload.isMandatory,
        points: payload.points,
        allowLateSubmission: payload.allowLateSubmission,
        maxSubmissions: payload.maxSubmissions,
        technologies: payload.technologies ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "Organizer",
      };
      taskStore.add(newTask);
      return newTask;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTaskPayload }): Promise<Task> => {
      await new Promise((r) => setTimeout(r, 400));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { assignedTo: _ids, ...rest } = payload;
      const patch: Partial<Task> = { ...rest };
      if (payload.assignedTo) {
        patch.assignedTo = payload.assignedTo
          .map((mid) => mockMembers.find((m) => m.id === mid))
          .filter(Boolean) as typeof mockMembers;
      }
      taskStore.update(id, patch);
      const updated = taskStore.getById(id);
      if (!updated) throw new Error("Task not found");
      return updated;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await new Promise((r) => setTimeout(r, 300));
      taskStore.remove(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
