import { useState } from "react";
import { Plus, SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import TaskRow from "./TaskRow";
import SkeletonLoader from "../common/SkeletonLoader";
import EmptyState from "../common/EmptyState";
import type { Task } from "../../Task.types";

const PAGE_SIZE = 15;

// No ghost th needed — border-l-4 on <tr> is part of the row, not a column
const COLUMNS = [
  { key: "title",      label: "Task",        width: "min-w-[220px]" },
  { key: "assigned",   label: "Assigned To", width: "w-28"          },
  { key: "status",     label: "Status",      width: "w-28"          },
  { key: "priority",   label: "Priority",    width: "w-24"          },
  { key: "deadline",   label: "Deadline",    width: "w-36"          },
  { key: "submission", label: "Submission",  width: "w-36"          },
  { key: "actions",    label: "Actions",     width: "w-24"          },
];

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onDelete: (task: Task) => void;
  onCreateTask: () => void;
  hasFilters: boolean;
  onResetFilters: () => void;
}

export default function TaskTable({ tasks, isLoading, onDelete, onCreateTask, hasFilters, onResetFilters }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginated  = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <SkeletonLoader type="table" />;

  if (tasks.length === 0) {
    return hasFilters ? (
      <EmptyState
        variant="no-results"
        title="No tasks match your filters"
        description="Try adjusting your filters or search query."
        action={
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition"
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
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200"
          >
            <Plus size={15} />
            Create First Task
          </button>
        }
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`${col.width} px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400`}
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

      <div className="border-t bg-gray-50 px-5 py-2.5 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-xs text-gray-500 font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}

        <button
          onClick={onCreateTask}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          <Plus size={13} />
          Add Task
        </button>
      </div>
    </div>
  );
}