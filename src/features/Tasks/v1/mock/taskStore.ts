// ─── Shared in-memory store ───────────────────────────────────────────────────
// Both useTasks and useTaskDetail import from here so they always read/write
// the same array. Without this, creating a task in useTasks is invisible to
// useTaskDetail because they each had their own copy of the array.

import { mockTasks } from "./taskMockData";
import type { Task } from "../Task.types";

let store: Task[] = [...mockTasks];

export const taskStore = {
  getAll: ()                  => store,
  getById: (id: string)       => store.find((t) => t.id === id),
  add: (task: Task)           => { store = [task, ...store]; },
  update: (id: string, patch: Partial<Task>) => {
    store = store.map((t) => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t);
  },
  remove: (id: string)        => { store = store.filter((t) => t.id !== id); },
  reset: ()                   => { store = [...mockTasks]; },
};