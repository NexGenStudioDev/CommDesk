import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import TaskForm from "../components/task/TaskForm";

export default function CreateTaskPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Create Task</h1>
            <p className="text-xs text-gray-400">Add a new task to an event</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <TaskForm mode="create" />
      </div>
    </div>
  );
}