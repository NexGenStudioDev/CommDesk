import { useState } from "react";
import { Plus, SearchX } from "lucide-react";
import TaskRow from "./TaskRow";
import SkeletonLoader from "../common/SkeletonLoader";
import EmptyState from "../common/EmptyState";
import type { Task } from "../../Task.types";

const PAGE_SIZE = 15;

const COLUMNS = [
  { key: "title", label: "Task", width: "min-w-[360px]" },
  { key: "assigned", label: "Assignees", width: "w-32" },
  { key: "priority", label: "Priority", width: "w-24" },
  { key: "deadline", label: "Due", width: "w-36" },
  { key: "submission", label: "Submission", width: "w-36" },
  { key: "actions", label: "", width: "w-24 text-right" },
];

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onDelete: (task: Task) => void;
  onCreateTask: () => void;
  hasFilters: boolean;
  onResetFilters: () => void;
}

export default function TaskTable({
  tasks,
  isLoading,
  onDelete,
  onCreateTask,
  hasFilters,
  onResetFilters,
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginated = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <SkeletonLoader type="table" />;

  if (tasks.length === 0) {
    return (
      <div
        className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl"
        style={{
          backgroundColor: "var(--cd-surface)",
          border: "0",
          boxShadow: "none",
        }}
      >
        {hasFilters ? (
          <EmptyState
            variant="no-results"
            title="No tasks match your filters"
            description="Try adjusting your filters or search query."
            action={
              <button
                onClick={onResetFilters}
                className="cd-btn cd-btn-secondary h-9 rounded-lg px-4 text-sm"
              >
                <SearchX size={14} />
                Clear Filters
              </button>
            }
          />
        ) : (
          <EmptyState
            variant="no-tasks"
            title="No tasks yet"
            description="Create the first task for this event."
            action={
              <button
                onClick={onCreateTask}
                className="cd-btn cd-btn-primary h-9 rounded-lg px-4 text-sm"
              >
                <Plus size={15} />
                Create First Task
              </button>
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative">
      <table className="cd-table table-fixed w-full">
        <thead>
          <tr style={{ backgroundColor: "var(--cd-surface)" }}>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`${col.width} px-5 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors`}
                style={{
                  color: "var(--cd-text-muted)",
                  borderBottom: "1px solid var(--cd-border-subtle)",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginated.map((task) => (
            <TaskRow key={task.id} task={task} onDelete={onDelete} />
          ))}
        </tbody>
      </table>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div
        className="flex justify-between items-center gap-3 border-t px-5 py-3 text-sm"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: "var(--cd-border-subtle)",
          color: "var(--cd-text-2)",
        }}
      >
        <p style={{ color: "var(--cd-text-2)" }}>
          Showing{" "}
          <span style={{ color: "var(--cd-text)", fontWeight: 600 }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, tasks.length)}
          </span>{" "}
          of <span style={{ color: "var(--cd-text)", fontWeight: 600 }}>{tasks.length}</span>
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cd-btn cd-btn-secondary h-8 rounded-lg px-3 text-xs disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="cd-btn cd-btn-secondary h-8 rounded-lg px-3 text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
