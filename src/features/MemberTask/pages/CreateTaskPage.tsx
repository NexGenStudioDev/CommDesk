import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { MdAddTask } from "react-icons/md";
import { usePermissions } from "../context/PermissionContext";
import { mockMembers } from "../mock/taskMock";
import TaskForm from "../components/task/TaskForm";
import type { TaskFormData } from "../types/task.types";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const { hasPermission, currentUserId } = usePermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hasPermission("CREATE_TASK")) {
    return <Navigate to="/org/tasks" replace />;
  }

  const handleSubmit = (data: TaskFormData) => {
    setIsSubmitting(true);
    // Simulate async save
    setTimeout(() => {
      console.log("New task:", {
        ...data,
        id: `task-${Date.now()}`,
        status: "todo",
        createdBy: currentUserId,
        createdAt: new Date().toISOString().split("T")[0],
        assignedToName:
          mockMembers.find((m) => m.id === data.assignedTo)?.name ?? data.assignedTo,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      setIsSubmitting(false);
      navigate("/org/tasks");
    }, 600);
  };

  return (
    <div className="flex-1 p-6 min-w-0">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#306ee8]/10 flex items-center justify-center">
            <MdAddTask className="text-[#306ee8] text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Create Task</h1>
            <p className="text-xs text-gray-400">Add a new task to an event</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/org/tasks")}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
