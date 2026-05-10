import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Eye, Pencil, Trash2, SearchX,
  Github, FileUp, Layers, ChevronLeft, ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, isPast, parseISO } from "date-fns";
import { AvatarGroup } from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import EmptyState from "../common/EmptyState";
import TechBadge from "../common/TechBadge";
import { SUBMISSION_STATUS_CONFIG, PRIORITY_CONFIG } from "../../constants/task.constants";
import type { Task } from "../../Task.types";

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onDelete: (task: Task) => void;
  onCreateTask: () => void;
  hasFilters: boolean;
  onResetFilters: () => void;
}

const SUB_ICON: Record<string, React.ReactNode> = {
  file:   <FileUp size={11} />,
  github: <Github size={11} />,
  both:   <Layers size={11} />,
};

export default function TaskCardList({
  tasks, isLoading, onDelete, onCreateTask, hasFilters, onResetFilters,
}: Props) {
  const navigate   = useNavigate();
  const [page, setPage] = useState(1);
  const PAGE_SIZE  = 10;
  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginated  = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-40 rounded-xl animate-pulse"
          style={{ backgroundColor: "var(--cd-surface-2)" }}
        />
      ))}
    </div>
  );

  if (tasks.length === 0) {
    return hasFilters ? (
      <EmptyState
        variant="no-results"
        title="No tasks match your filters"
        description="Try adjusting your filters."
        action={
          <button
            onClick={onResetFilters}
            className="cd-btn cd-btn-secondary flex items-center gap-1.5"
          >
            <SearchX size={14} /> Clear Filters
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
            className="cd-btn cd-btn-primary flex items-center gap-1.5"
          >
            <Plus size={15} /> Create First Task
          </button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Card list ────────────────────────────────────── */}
      <div className="flex flex-col gap-3 p-4">
        {paginated.map((task) => {
          const subCfg     = SUBMISSION_STATUS_CONFIG[task.submissionStatus];
          const priCfg     = PRIORITY_CONFIG[task.priority];
          const deadlineDt = parseISO(task.deadline);
          const isOverdue  = isPast(deadlineDt) && task.status !== "completed";

          return (
            <div
              key={task.id}
              onClick={() => navigate(`/org/tasks/${task.id}`)}
              className={`rounded-xl border-l-4 ${priCfg.borderClass} shadow-sm cursor-pointer transition-shadow hover:shadow-md`}
              style={{
                backgroundColor: "var(--cd-surface)",
                border: "1px solid var(--cd-border)",
                borderLeftWidth: "4px",
                padding: "1rem",
              }}
            >
              {/* Top row: title + actions */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold leading-snug flex-1" style={{ color: "var(--cd-text)" }}>
                  {task.title}
                </h3>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 shrink-0"
                >
                  <ActionBtn
                    icon={<Eye size={13} />}
                    label="View"
                    color="indigo"
                    onClick={() => navigate(`/org/tasks/${task.id}`)}
                  />
                  <ActionBtn
                    icon={<Pencil size={13} />}
                    label="Edit"
                    color="gray"
                    onClick={() => navigate(`/org/tasks/${task.id}/edit`)}
                  />
                  <ActionBtn
                    icon={<Trash2 size={13} />}
                    label="Delete"
                    color="red"
                    onClick={() => onDelete(task)}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--cd-text-muted)" }}>
                {task.description}
              </p>

              {/* Tech tags */}
              {task.technologies && task.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {task.technologies.slice(0, 4).map((tech) => (
                    <TechBadge key={tech.id} tech={tech} size="xs" />
                  ))}
                  {task.technologies.length > 4 && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text-muted)" }}
                    >
                      +{task.technologies.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Status badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <StatusBadge status={task.status} size="sm" />
                <PriorityBadge priority={task.priority} size="sm" />
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${subCfg.bg} ${subCfg.text}`}
                >
                  {SUB_ICON[task.submissionType]}{subCfg.label}
                </span>
                {task.isMandatory && (
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                    Mandatory
                  </span>
                )}
              </div>

              {/* Bottom: members + deadline + points */}
              <div className="flex items-center justify-between gap-2">
                <AvatarGroup members={task.assignedTo} max={4} size="xs" />
                <div className="flex items-center gap-3">
                  {task.points !== undefined && (
                    <span className="text-[10px] text-amber-600 font-bold">★ {task.points} pts</span>
                  )}
                  <span
                    className={`text-[10px] font-semibold ${isOverdue ? "text-red-500" : ""}`}
                    style={!isOverdue ? { color: "var(--cd-text-muted)" } : {}}
                  >
                    {isOverdue ? "OVERDUE · " : ""}
                    {formatDistanceToNow(deadlineDt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div
        className="sticky bottom-0 border-t px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: "var(--cd-border)",
        }}
      >
        <span className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="cd-btn cd-btn-secondary p-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-xs font-medium" style={{ color: "var(--cd-text-2)" }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="cd-btn cd-btn-secondary p-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}

        <button
          onClick={onCreateTask}
          className="cd-btn cd-btn-primary flex items-center gap-1.5 text-xs"
        >
          <Plus size={13} /> Add Task
        </button>
      </div>
    </div>
  );
}

// ── Small action button ───────────────────────────────────────────────────────
function ActionBtn({
  icon, label, onClick, color,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: "indigo" | "gray" | "red";
}) {
  const hover = {
    indigo: "hover:bg-indigo-100 hover:text-indigo-700",
    gray:   "hover:bg-gray-100 hover:text-gray-700",
    red:    "hover:bg-red-100 hover:text-red-600",
  };
  return (
    <button
      title={label}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${hover[color]}`}
      style={{ color: "var(--cd-text-muted)" }}
    >
      {icon}
    </button>
  );
}
