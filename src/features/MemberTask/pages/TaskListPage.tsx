import { useState } from "react";
import { MdAssignment } from "react-icons/md";
import { usePermissions } from "../context/PermissionContext";
import { mockEvents, mockTasks } from "../mock/taskMock";
import EventDropdown from "../components/event/EventDropdown";
import TaskTable from "../components/task/TaskTable";
import type { Task } from "../types/task.types";

export default function TaskListPage() {
  const { hasPermission, currentUserId } = usePermissions();
  const [selectedEventId, setSelectedEventId] = useState<string>(mockEvents[0].id);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const visibleTasks = tasks.filter((t) => {
    const inEvent = t.eventId === selectedEventId;
    if (!inEvent) return false;
    return hasPermission("VIEW_ALL_TASKS") || t.assignedTo === currentUserId;
  });

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex-1 p-6 space-y-6 min-w-0">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#306ee8]/10 flex items-center justify-center">
            <MdAssignment className="text-[#306ee8] text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Tasks</h1>
            <p className="text-xs text-gray-400">
              {hasPermission("VIEW_ALL_TASKS") ? "All event tasks" : "Your assigned tasks"}
            </p>
          </div>
        </div>
        <EventDropdown
          events={mockEvents}
          selectedEventId={selectedEventId}
          onChange={setSelectedEventId}
        />
      </div>

      {!selectedEventId ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          Select an event to view tasks.
        </div>
      ) : (
        <TaskTable tasks={visibleTasks} onDelete={handleDelete} />
      )}
    </div>
  );
}
