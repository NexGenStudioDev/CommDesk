import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AISuggestions from "@/features/Dashboard/components/AISuggestions";
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

describe("AISuggestions", () => {
  it("renders the section title", () => {
    render(<AISuggestions tasks={[]} />);
    expect(screen.getByText("AI Suggestions")).toBeInTheDocument();
  });

  it("renders Smart Insights label", () => {
    render(<AISuggestions tasks={[]} />);
    expect(screen.getByText("Smart Insights")).toBeInTheDocument();
  });

  it("renders no suggestion items for empty tasks", () => {
    const { container } = render(<AISuggestions tasks={[]} />);
    // space-y-2 div should be empty
    const suggestionList = container.querySelector(".space-y-2");
    expect(suggestionList?.children).toHaveLength(0);
  });

  it("renders overdue suggestion", () => {
    const task = makeTask({ title: "Overdue Task", deadline: hoursFromNow(-1) });
    render(<AISuggestions tasks={[task]} />);
    expect(screen.getByText(/Overdue Task/)).toBeInTheDocument();
    expect(screen.getByText(/overdue/)).toBeInTheDocument();
  });

  it("renders due today suggestion", () => {
    const task = makeTask({ title: "Today Task", deadline: hoursFromNow(12) });
    render(<AISuggestions tasks={[task]} />);
    expect(screen.getByText(/due today/)).toBeInTheDocument();
  });

  it("renders due tomorrow suggestion", () => {
    const task = makeTask({ title: "Tomorrow Task", deadline: hoursFromNow(36) });
    render(<AISuggestions tasks={[task]} />);
    expect(screen.getByText(/due tomorrow/)).toBeInTheDocument();
  });

  it("renders upcoming suggestion", () => {
    const task = makeTask({ title: "Soon Task", deadline: hoursFromNow(60) });
    render(<AISuggestions tasks={[task]} />);
    expect(screen.getByText(/due soon/)).toBeInTheDocument();
  });

  it("skips completed tasks", () => {
    const task = makeTask({ status: "completed", deadline: hoursFromNow(-1) });
    const { container } = render(<AISuggestions tasks={[task]} />);
    expect(container.querySelector(".space-y-2")?.children).toHaveLength(0);
  });

  it("renders at most 5 suggestions", () => {
    const tasks = Array.from({ length: 10 }, (_, i) =>
      makeTask({ id: i, title: `Task ${i}`, deadline: hoursFromNow(-1) }),
    );
    render(<AISuggestions tasks={tasks} />);
    const items = document.querySelectorAll(".space-y-2 > div");
    expect(items.length).toBeLessThanOrEqual(5);
  });
});
