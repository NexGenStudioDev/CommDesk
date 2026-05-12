import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getSmartReminders } from "@/utils/reminders";
import type { Task } from "@/features/Dashboard/Member/v1/Type/dashboard";

const TODAY = "2024-06-15";

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 1,
    title: "Test Task",
    status: "todo",
    deadline: TODAY,
    ...overrides,
  };
}

function daysFromToday(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(TODAY));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getSmartReminders", () => {
  it("returns empty array for empty task list", () => {
    expect(getSmartReminders([])).toEqual([]);
  });

  it("skips completed tasks", () => {
    const task = makeTask({ status: "completed", deadline: daysFromToday(-1) });
    expect(getSmartReminders([task])).toHaveLength(0);
  });

  it("skips tasks with no deadline", () => {
    const task = makeTask({ deadline: "" });
    expect(getSmartReminders([task])).toHaveLength(0);
  });

  it("labels overdue task correctly", () => {
    const task = makeTask({ deadline: daysFromToday(-2) });
    const result = getSmartReminders([task]);
    expect(result[0].label).toBe("Overdue");
    expect(result[0].type).toBe("urgent");
  });

  it("labels due today correctly", () => {
    const task = makeTask({ deadline: TODAY });
    const result = getSmartReminders([task]);
    expect(result[0].label).toBe("Due today");
    expect(result[0].type).toBe("urgent");
  });

  it("labels due tomorrow correctly", () => {
    const task = makeTask({ deadline: daysFromToday(1) });
    const result = getSmartReminders([task]);
    expect(result[0].label).toBe("Due tomorrow");
    expect(result[0].type).toBe("urgent");
  });

  it("labels upcoming tasks (2-3 days) correctly", () => {
    const task = makeTask({ deadline: daysFromToday(2) });
    const result = getSmartReminders([task]);
    expect(result[0].label).toBe("Due in 2 days");
    expect(result[0].type).toBe("upcoming");
  });

  it("does not include tasks due in 4+ days", () => {
    const task = makeTask({ deadline: daysFromToday(4) });
    expect(getSmartReminders([task])).toHaveLength(0);
  });

  it("sorts urgent reminders before upcoming", () => {
    const upcoming = makeTask({ id: 1, title: "Upcoming", deadline: daysFromToday(2) });
    const urgent = makeTask({ id: 2, title: "Urgent", deadline: TODAY });
    const result = getSmartReminders([upcoming, urgent]);
    expect(result[0].type).toBe("urgent");
    expect(result[1].type).toBe("upcoming");
  });

  it("caps results at 5", () => {
    const tasks = Array.from({ length: 10 }, (_, i) =>
      makeTask({ id: i, title: `Task ${i}`, deadline: TODAY }),
    );
    expect(getSmartReminders(tasks)).toHaveLength(5);
  });

  it("includes task title in reminder", () => {
    const task = makeTask({ title: "My Important Task", deadline: TODAY });
    const result = getSmartReminders([task]);
    expect(result[0].title).toBe("My Important Task");
  });
});
