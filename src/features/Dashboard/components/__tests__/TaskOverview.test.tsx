import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskOverview from "@/features/Dashboard/components/TaskOverview";
import type { Task } from "@/features/Dashboard/Member/v1/Type/dashboard";

function makeTask(id: number, status: Task["status"]): Task {
  return { id, title: `Task ${id}`, status, deadline: "2024-12-31" };
}

describe("TaskOverview", () => {
  it("renders the section title", () => {
    render(<TaskOverview tasks={[]} />);
    expect(screen.getByText("Task Overview")).toBeInTheDocument();
  });

  it("renders total count of 0 for empty tasks", () => {
    render(<TaskOverview tasks={[]} />);
    // The bold total count sits inside the absolute-positioned center div
    const totalCount = document.querySelector(".text-xl.font-bold");
    expect(totalCount?.textContent).toBe("0");
  });

  it("renders correct total count", () => {
    const tasks = [makeTask(1, "todo"), makeTask(2, "in-progress"), makeTask(3, "completed")];
    render(<TaskOverview tasks={tasks} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders todo count", () => {
    const tasks = [makeTask(1, "todo"), makeTask(2, "todo")];
    render(<TaskOverview tasks={tasks} />);
    const todoLabel = screen.getByText("Todo");
    const todoCount = todoLabel.closest("div")?.querySelector(".font-semibold");
    expect(todoCount?.textContent).toBe("2");
  });

  it("renders in-progress count", () => {
    const tasks = [makeTask(1, "in-progress")];
    render(<TaskOverview tasks={tasks} />);
    const label = screen.getByText("In Progress");
    const count = label.closest("div")?.querySelector(".font-semibold");
    expect(count?.textContent).toBe("1");
  });

  it("renders completed count", () => {
    const tasks = [makeTask(1, "completed"), makeTask(2, "completed")];
    render(<TaskOverview tasks={tasks} />);
    const label = screen.getByText("Completed");
    const count = label.closest("div")?.querySelector(".font-semibold");
    expect(count?.textContent).toBe("2");
  });

  it("renders all three status labels", () => {
    render(<TaskOverview tasks={[]} />);
    expect(screen.getByText("Todo")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders Total label", () => {
    render(<TaskOverview tasks={[]} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
  });
});
