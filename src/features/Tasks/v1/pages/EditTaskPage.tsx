import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { useTaskDetail } from "../hooks/useTaskDetail";
import TaskForm from "../components/task/TaskForm";
import SkeletonLoader from "../components/common/SkeletonLoader";

export default function EditTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate   = useNavigate();
  const { data: task, isLoading, isError } = useTaskDetail(taskId);

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
            <Pencil size={15} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Edit Task</h1>
            <p className="text-xs text-gray-400 truncate max-w-[280px]">
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
              <p className="text-gray-500 font-semibold">Task not found.</p>
              <button
                onClick={() => navigate("/org/tasks")}
                className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
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