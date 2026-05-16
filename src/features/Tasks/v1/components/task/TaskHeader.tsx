import { useNavigate } from "react-router-dom";
import { Plus, ListTodo } from "lucide-react";
import { useEvents } from "../../hooks/useEvents";
import type { Task } from "../../Task.types";

interface Props {
  selectedEventId: string | null;
  tasks: Task[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { key: "all", label: "All Tasks" },
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function TaskHeader({ selectedEventId, tasks, activeTab, onTabChange }: Props) {
  const navigate = useNavigate();
  const { data: events = [] } = useEvents();
  const event = events.find((e) => e.id === selectedEventId) ?? null;

  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const tabCount: Record<string, number> = {
    all: tasks.length,
    todo,
    "in-progress": inProgress,
    completed,
  };

  return (
    <div
      className="border-b flex flex-col justify-between transition-all duration-300"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
      }}
    >
      {/* ── Top row ─────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--cd-primary-subtle)",
              color: "var(--cd-primary-text)",
            }}
          >
            <ListTodo size={18} strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h1
              className="truncate text-xl font-semibold leading-tight tracking-tight"
              style={{ color: "var(--cd-text)" }}
            >
              Task Management
            </h1>
            <p className="mt-1 truncate text-sm" style={{ color: "var(--cd-text-2)" }}>
              {event
                ? `Managing tasks for ${event.name}`
                : "Centralized control for all event tasks"}
            </p>
          </div>
        </div>

        {/* Right: New Task button */}
        <button
          onClick={() =>
            navigate(
              selectedEventId
                ? `/org/tasks/create?eventId=${selectedEventId}`
                : "/org/tasks/create",
            )
          }
          disabled={!selectedEventId}
          className="cd-btn cd-btn-primary h-9 rounded-lg px-3.5 text-sm shadow-none transition-all disabled:opacity-40 sm:px-4"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden font-medium sm:inline">New Task</span>
        </button>
      </div>

      {/* ── Tabs Row ─────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: "var(--cd-border-subtle)" }}>
        <div className="mx-auto flex w-full max-w-[1440px] items-center overflow-x-auto px-5 sm:px-8 lg:px-10">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="group relative flex items-center gap-2 px-3.5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={{
                  color: isActive ? "var(--cd-text)" : "var(--cd-text-muted)",
                }}
              >
                {tab.label}
                {event && (
                  <span
                    className="min-w-5 rounded-md px-1.5 py-0.5 text-center text-[11px] font-medium transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? "var(--cd-primary-subtle)"
                        : "var(--cd-surface-2)",
                      color: isActive ? "var(--cd-primary-text)" : "var(--cd-text-muted)",
                    }}
                  >
                    {tabCount[tab.key]}
                  </span>
                )}
                {/* Active indicator */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-300 ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
                  style={{ backgroundColor: "var(--cd-primary)" }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
