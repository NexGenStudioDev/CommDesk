import { useState, useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import EventDropdown from "../components/event/EventDropdown";
import TaskHeader from "../components/task/TaskHeader";
import TaskFiltersBar from "../components/task/TaskFilters";
import TaskTable from "../components/task/TaskTable";
import TaskCardList from "../components/task/TaskCardList";
import ConfirmModal from "../components/common/ConfirmModal";
import { ToastContainer, useToast } from "../components/common/ToastNotification";
import EmptyState from "../components/common/EmptyState";
import { useTasks, useDeleteTask } from "../hooks/useTasks";
import { SELECTED_EVENT_KEY, DEFAULT_FILTERS } from "../constants/task.constants";
import type { Task, TaskFilters } from "../Task.types";

export default function TaskManagementPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { toasts, addToast, dismiss } = useToast();

  const { data: events = [] } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    () => localStorage.getItem(SELECTED_EVENT_KEY)
  );
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);

  const { data: allTasks = [] } = useTasks(selectedEventId, DEFAULT_FILTERS);
  const { data: tasks = [], isLoading, isError, refetch } = useTasks(selectedEventId, filters);

  const deleteTask = useDeleteTask();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    if (params.get("created") === "1") {
      addToast("success", "Task created!", "Your new task is now live in the list.");
      setParams((p) => { p.delete("created"); return p; }, { replace: true });
    }
    if (params.get("updated") === "1") {
      addToast("success", "Task updated!", "Your changes have been saved.");
      setParams((p) => { p.delete("updated"); return p; }, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setFilters(DEFAULT_FILTERS); }, [selectedEventId]);

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask.mutateAsync(taskToDelete.id);
      addToast("success", "Task deleted", `"${taskToDelete.title}" was removed.`);
    } catch {
      addToast("error", "Delete failed", "Something went wrong.");
    } finally {
      setTaskToDelete(null);
    }
  };

  const hasActiveFilters =
    filters.status !== "all" || filters.priority !== "all" ||
    filters.time !== "all" || filters.members.length > 0 || filters.search !== "";

  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const handleCreate = () => navigate(`/org/tasks/create?eventId=${selectedEventId}`);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[#F5F5F5]">
      <TaskHeader selectedEventId={selectedEventId} tasks={allTasks} />

      {/* Event selector bar */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide shrink-0">Event</span>
        <EventDropdown selectedEventId={selectedEventId} onSelect={setSelectedEventId} />
        {selectedEventId && (
          <button onClick={() => void refetch()} title="Refresh"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {!selectedEventId ? (
          <div className="flex-1 flex items-center justify-center p-4">
            {events.length === 0 ? (
              <EmptyState
                variant="no-event"
                title="No events yet"
                description="You haven't created any events. Create your first event to start managing tasks."
                action={
                  <button
                    onClick={() => navigate("/org/create-event")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
                  >
                    Create First Event
                  </button>
                }
              />
            ) : (
              <EmptyState variant="no-event" title="No event selected"
                description="Select an event from the dropdown above to view and manage its tasks." />
            )}
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <EmptyState variant="error" title="Failed to load tasks" description="Something went wrong."
              action={<button onClick={() => void refetch()}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition">
                <RefreshCw size={14} /> Retry
              </button>} />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            <TaskFiltersBar filters={filters} onChange={setFilters}
              totalCount={allTasks.length} filteredCount={tasks.length} />
            <div className="flex-1 overflow-auto">
              {/* Desktop: table | Mobile: card list */}
              <div className="hidden md:block h-full">
                <TaskTable tasks={tasks} isLoading={isLoading} onDelete={setTaskToDelete}
                  onCreateTask={handleCreate} hasFilters={hasActiveFilters} onResetFilters={resetFilters} />
              </div>
              <div className="block md:hidden h-full">
                <TaskCardList tasks={tasks} isLoading={isLoading} onDelete={setTaskToDelete}
                  onCreateTask={handleCreate} hasFilters={hasActiveFilters} onResetFilters={resetFilters} />
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!taskToDelete} title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? All submissions will be permanently lost.`}
        confirmLabel="Yes, Delete" onConfirm={() => void handleDelete()}
        onCancel={() => setTaskToDelete(null)} isLoading={deleteTask.isPending} danger />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}