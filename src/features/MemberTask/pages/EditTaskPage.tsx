import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { usePermissions } from "../context/PermissionContext";
import { mockTasks, mockMembers } from "../mock/taskMock";
import TaskForm from "../components/task/TaskForm";
import type { TaskFormData } from "../types/task.types";

export default function EditTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hasPermission("EDIT_TASK")) {
    return <Navigate to="/org/tasks" replace />;
  }

  const task = mockTasks.find((t) => t.id === taskId);
  if (!task) return <Navigate to="/org/tasks" replace />;

  const handleSubmit = (data: TaskFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Updated task:", {
        ...task,
        ...data,
        assignedToName:
          mockMembers.find((m) => m.id === data.assignedTo)?.name ?? data.assignedTo,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      setIsSubmitting(false);
      navigate(`/org/tasks/${taskId}`);
    }, 600);
  };

  return (
    <div className="flex-1 p-6 min-w-0">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <MdEdit className="text-orange-500 text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Edit Task</h1>
            <p className="text-xs text-gray-400 truncate max-w-xs">{task.title}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <TaskForm
            initial={task}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/org/tasks/${taskId}`)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
