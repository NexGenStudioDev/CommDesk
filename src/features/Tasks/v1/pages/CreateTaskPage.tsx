import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import Button from "../../../../Component/ui/Button";
import TaskForm from "../components/task/TaskForm";

export default function CreateTaskPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col cd-page">
      {/* Header - Matches Event_Header style */}
      <div
        className="py-[3vh] border-b flex text-xl font-bold justify-between"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: "var(--cd-border)",
        }}
      >
        <div className="w-1/3 h-full flex items-center">
          <h1
            className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold ml-5 mt-2 flex items-center gap-3"
            style={{ color: "var(--cd-text)" }}
          >
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl transition-colors hover:opacity-80"
              style={{ color: "var(--cd-text-muted)" }}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "var(--cd-primary)" }}
            >
              <Plus size={16} className="text-white" />
            </div>
            Create Task
          </h1>
        </div>

        <div className="w-1/2 xl:w-fit h-full mr-[3vw] flex justify-end gap-3">
          <Button
            text="Cancel"
            variant="secondary"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-auto p-[2vw]">
        <TaskForm mode="create" />
      </div>
    </div>
  );
}