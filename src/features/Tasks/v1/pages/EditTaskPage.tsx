import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { useTaskDetail } from "../hooks/useTaskDetail";
import TaskForm from "../components/task/TaskForm";
import SkeletonLoader from "../components/common/SkeletonLoader";

export default function EditTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, isError } = useTaskDetail(taskId);

  return (
    <div className="flex min-h-screen w-full flex-col" style={{ backgroundColor: "var(--cd-bg)" }}>
      <div
        className="flex items-center gap-3 border-b px-5 py-4 sm:px-8 lg:px-10"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 transition-colors hover:bg-[var(--cd-hover)]"
          style={{ color: "var(--cd-text-muted)" }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--cd-warning)" }}
          >
            <Pencil size={15} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold" style={{ color: "var(--cd-text)" }}>
              Edit Task
            </h1>
            <p className="text-xs truncate max-w-[280px]" style={{ color: "var(--cd-text-muted)" }}>
              {task?.title ?? "Loading…"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <SkeletonLoader type="form" />
        ) : isError || !task ? (
          <div className="flex items-center justify-center py-20 text-center">
            <div>
              <p className="font-semibold" style={{ color: "var(--cd-text-2)" }}>
                Task not found.
              </p>
              <button
                onClick={() => navigate("/org/tasks")}
                className="mt-4 px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition"
                style={{ backgroundColor: "var(--cd-primary)" }}
              >
                Back to Tasks
              </button>
            </div>
          </div>
        ) : (
          <TaskForm mode="edit" task={task} />
        )}
      </div>
    </div>
  );
}
