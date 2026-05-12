import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { categorizeTasks, formatDueLabel } from "@/utils/task.utils";
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

describe("categorizeTasks", () => {
  it("returns empty urgent and upcoming for empty array", () => {
    expect(categorizeTasks([])).toEqual({ urgent: [], upcoming: [] });
  });

  it("categorizes task due within 48h as urgent", () => {
    const task = makeTask({ deadline: hoursFromNow(24) });
    const { urgent } = categorizeTasks([task]);
    expect(urgent).toHaveLength(1);
  });

  it("categorizes task due after 48h as upcoming", () => {
    const task = makeTask({ deadline: hoursFromNow(72) });
    const { upcoming } = categorizeTasks([task]);
    expect(upcoming).toHaveLength(1);
  });

  it("excludes overdue tasks (diffHours <= 0)", () => {
    const task = makeTask({ deadline: hoursFromNow(-5) });
    const { urgent, upcoming } = categorizeTasks([task]);
    expect(urgent).toHaveLength(0);
    expect(upcoming).toHaveLength(0);
  });

  it("skips tasks with no deadline", () => {
    const task = makeTask({ deadline: "" });
    const { urgent, upcoming } = categorizeTasks([task]);
    expect(urgent).toHaveLength(0);
    expect(upcoming).toHaveLength(0);
  });

  it("skips tasks with invalid deadline", () => {
    const task = makeTask({ deadline: "not-a-date" });
    const { urgent, upcoming } = categorizeTasks([task]);
    expect(urgent).toHaveLength(0);
    expect(upcoming).toHaveLength(0);
  });

  it("handles mixed tasks correctly", () => {
    const tasks = [
      makeTask({ id: 1, deadline: hoursFromNow(10) }),
      makeTask({ id: 2, deadline: hoursFromNow(60) }),
      makeTask({ id: 3, deadline: hoursFromNow(-1) }),
    ];
    const { urgent, upcoming } = categorizeTasks(tasks);
    expect(urgent).toHaveLength(1);
    expect(upcoming).toHaveLength(1);
  });
});

describe("formatDueLabel", () => {
  it("returns 'No deadline' for empty string", () => {
    expect(formatDueLabel("")).toBe("No deadline");
  });

  it("returns 'Invalid date' for invalid string", () => {
    expect(formatDueLabel("not-a-date")).toBe("Invalid date");
  });

  it("returns 'Due Today' for today's date", () => {
    expect(formatDueLabel("2024-06-15")).toBe("Due Today");
  });

  it("returns 'Due Tomorrow' for tomorrow", () => {
    expect(formatDueLabel("2024-06-16")).toBe("Due Tomorrow");
  });

  it("returns 'Overdue' for past date", () => {
    expect(formatDueLabel("2024-06-10")).toBe("Overdue");
  });

  it("returns 'Due in N days' for future date", () => {
    expect(formatDueLabel("2024-06-20")).toBe("Due in 5 days");
  });
});
