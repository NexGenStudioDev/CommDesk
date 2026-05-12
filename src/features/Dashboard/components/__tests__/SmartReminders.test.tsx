import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SmartReminders from "@/features/Dashboard/components/SmartReminders";
import type { Task } from "@/features/Dashboard/Member/v1/Type/dashboard";

const TODAY = "2024-06-15";

function makeTask(overrides: Partial<Task>): Task {
  return { id: 1, title: "Task", status: "todo", deadline: TODAY, ...overrides };
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

describe("SmartReminders", () => {
  it("renders the section title", () => {
    render(<SmartReminders tasks={[]} />);
    expect(screen.getByText("Smart Reminders")).toBeInTheDocument();
  });

  it("shows all-caught-up message when no reminders", () => {
    render(<SmartReminders tasks={[]} />);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
  });

  it("does not show all-caught-up message when reminders exist", () => {
    const task = makeTask({ deadline: TODAY });
    render(<SmartReminders tasks={[task]} />);
    expect(screen.queryByText(/all caught up/i)).not.toBeInTheDocument();
  });

  it("renders urgent section for overdue task", () => {
    const task = makeTask({ deadline: daysFromToday(-1) });
    render(<SmartReminders tasks={[task]} />);
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("renders urgent section for due today task", () => {
    const task = makeTask({ deadline: TODAY });
    render(<SmartReminders tasks={[task]} />);
    expect(screen.getByText("Due today")).toBeInTheDocument();
  });

  it("renders urgent section for due tomorrow task", () => {
    const task = makeTask({ deadline: daysFromToday(1) });
    render(<SmartReminders tasks={[task]} />);
    expect(screen.getByText("Due tomorrow")).toBeInTheDocument();
  });

  it("renders upcoming section for task due in 2 days", () => {
    const task = makeTask({ deadline: daysFromToday(2) });
    render(<SmartReminders tasks={[task]} />);
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Due in 2 days")).toBeInTheDocument();
  });

  it("renders task title in reminder", () => {
    const task = makeTask({ title: "Write report", deadline: TODAY });
    render(<SmartReminders tasks={[task]} />);
    expect(screen.getByText("Write report")).toBeInTheDocument();
  });

  it("excludes completed tasks", () => {
    const task = makeTask({ status: "completed", deadline: TODAY });
    render(<SmartReminders tasks={[task]} />);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
  });

  it("renders multiple reminders", () => {
    const tasks = [
      makeTask({ id: 1, title: "Task A", deadline: TODAY }),
      makeTask({ id: 2, title: "Task B", deadline: daysFromToday(2) }),
    ];
    render(<SmartReminders tasks={tasks} />);
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });
});
