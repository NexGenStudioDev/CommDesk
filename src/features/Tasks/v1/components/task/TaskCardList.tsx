import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, SearchX, Github, FileUp, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow, isPast, parseISO } from "date-fns";
import { AvatarGroup } from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import SkeletonLoader from "../common/SkeletonLoader";
import EmptyState from "../common/EmptyState";
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
  file: <FileUp size={11} />, github: <Github size={11} />, both: <Layers size={11} />,
};

const PRIORITY_BORDER: Record<string, string> = {
  high: "border-l-red-500", medium: "border-l-amber-400", low: "border-l-sky-400",
};

export default function TaskCardList({ tasks, isLoading, onDelete, onCreateTask, hasFilters, onResetFilters }: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const PAGE_SIZE  = 10;
  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const paginated  = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (tasks.length === 0) {
    return hasFilters ? (
      <EmptyState variant="no-results" title="No tasks match your filters"
        description="Try adjusting your filters."
        action={<button onClick={onResetFilters}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition">
          <SearchX size={14} /> Clear Filters
        </button>} />
    ) : (
      <EmptyState variant="no-tasks" title="No tasks yet"
        description="Create the first task for this event."
        action={<button onClick={onCreateTask}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm">
          <Plus size={15} /> Create First Task
        </button>} />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-4">
        {paginated.map((task) => {
          const subCfg    = SUBMISSION_STATUS_CONFIG[task.submissionStatus];
          const priCfg    = PRIORITY_CONFIG[task.priority];
          const deadlineDt = parseISO(task.deadline);
          const isOverdue = isPast(deadlineDt) && task.status !== "completed";

          return (
            <div key={task.id}
              onClick={() => navigate(`/org/tasks/${task.id}`)}
              className={`bg-white rounded-xl border border-gray-200 border-l-4 ${PRIORITY_BORDER[task.priority]} shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4`}>

              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-gray-900 leading-snug flex-1">{task.title}</h3>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 shrink-0">
                  <button onClick={() => navigate(`/org/tasks/${task.id}`)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-indigo-100 hover:text-indigo-700 transition"><Eye size={13} /></button>
                  <button onClick={() => navigate(`/org/tasks/${task.id}/edit`)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"><Pencil size={13} /></button>
                  <button onClick={() => onDelete(task)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-600 transition"><Trash2 size={13} /></button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>

              {/* Tech tags */}
              {task.technologies && task.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {task.technologies.slice(0, 4).map((tech) => (
                    <span key={tech.id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${tech.color}`}>
                      {tech.label}
                    </span>
                  ))}
                  {task.technologies.length > 4 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                      +{task.technologies.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <StatusBadge status={task.status} size="sm" />
                <PriorityBadge priority={task.priority} size="sm" />
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${subCfg.bg} ${subCfg.text}`}>
                  {SUB_ICON[task.submissionType]}{subCfg.label}
                </span>
                {task.isMandatory && (
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">Mandatory</span>
                )}
              </div>

              {/* Bottom row: members + deadline + points */}
              <div className="flex items-center justify-between gap-2">
                {/* Member avatars */}
                <AvatarGroup members={task.assignedTo} max={4} size="xs" />

                <div className="flex items-center gap-3">
                  {task.points !== undefined && (
                    <span className="text-[10px] text-amber-600 font-bold">★ {task.points} pts</span>
                  )}
                  <span className={`text-[10px] font-semibold ${isOverdue ? "text-red-500" : "text-gray-500"}`}>
                    {isOverdue ? "OVERDUE · " : ""}{formatDistanceToNow(deadlineDt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-xs text-gray-500 font-medium">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}

        <button onClick={onCreateTask}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm">
          <Plus size={13} /> Add Task
        </button>
      </div>
    </div>
  );
}