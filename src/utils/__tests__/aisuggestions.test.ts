import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getAISuggestions } from "@/utils/aisuggestions";
import type { Task } from "@/features/Dashboard/Member/v1/Type/dashboard";

const NOW = new Date("2024-06-15T12:00:00Z");

function makeTask(overrides: Partial<Task>): Task {
  return { id: 1, title: "Task", status: "todo", deadline: "", ...overrides };
}

function hoursFromNow(hours: number): string {
  return new Date(NOW.getTime() + hours * 60 * 60 * 1000).toISOString();
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getAISuggestions", () => {
  it("returns empty array for empty task list", () => {
    expect(getAISuggestions([])).toEqual([]);
  });

  it("skips completed tasks", () => {
    const task = makeTask({ status: "completed", deadline: hoursFromNow(-5) });
    expect(getAISuggestions([task])).toHaveLength(0);
  });

  it("skips tasks with no deadline", () => {
    const task = makeTask({ deadline: "" });
    expect(getAISuggestions([task])).toHaveLength(0);
  });

  it("generates overdue suggestion", () => {
    const task = makeTask({ title: "Overdue Task", deadline: hoursFromNow(-1) });
    const result = getAISuggestions([task]);
    expect(result[0]).toContain("Overdue Task");
    expect(result[0]).toContain("overdue");
  });

  it("generates due today suggestion", () => {
    const task = makeTask({ title: "Today Task", deadline: hoursFromNow(12) });
    const result = getAISuggestions([task]);
    expect(result[0]).toContain("Today Task");
    expect(result[0]).toContain("due today");
  });

  it("generates due tomorrow suggestion", () => {
    const task = makeTask({ title: "Tomorrow Task", deadline: hoursFromNow(36) });
    const result = getAISuggestions([task]);
    expect(result[0]).toContain("Tomorrow Task");
    expect(result[0]).toContain("due tomorrow");
  });

  it("generates upcoming (2-3 days) suggestion", () => {
    const task = makeTask({ title: "Soon Task", deadline: hoursFromNow(60) });
    const result = getAISuggestions([task]);
    expect(result[0]).toContain("Soon Task");
    expect(result[0]).toContain("due soon");
  });

  it("does not generate suggestion for tasks due in 4+ days", () => {
    const task = makeTask({ deadline: hoursFromNow(100) });
    expect(getAISuggestions([task])).toHaveLength(0);
  });

  it("caps results at 5", () => {
    const tasks = Array.from({ length: 10 }, (_, i) =>
      makeTask({ id: i, title: `Task ${i}`, deadline: hoursFromNow(-1) }),
    );
    expect(getAISuggestions(tasks)).toHaveLength(5);
  });
});
