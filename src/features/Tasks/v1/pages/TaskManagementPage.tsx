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

const TAB_STATUS_MAP: Record<string, string> = {
  all:          "all",
  todo:         "todo",
  "in-progress": "in-progress",
  completed:    "completed",
};

export default function TaskManagementPage() {
  const navigate                = useNavigate();
  const [params, setParams]     = useSearchParams();
  const { toasts, addToast, dismiss } = useToast();

  const { data: events = [] } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    () => localStorage.getItem(SELECTED_EVENT_KEY)
  );

  // Active header tab (all / todo / in-progress / completed)
  const [activeTab, setActiveTab] = useState("all");

  // Filters — tab selection drives the status filter
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);

  // Sync tab → status filter
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilters((prev) => ({
      ...prev,
      status: TAB_STATUS_MAP[tab] as TaskFilters["status"],
    }));
  };

  // Sync status filter change back to tab
  const handleFiltersChange = (f: TaskFilters) => {
    setFilters(f);
    const reverseMap: Record<string, string> = {
      all:          "all",
      todo:         "todo",
      "in-progress": "in-progress",
      completed:    "completed",
    };
    setActiveTab(reverseMap[f.status] ?? "all");
  };

  const { data: allTasks = [] } = useTasks(selectedEventId, DEFAULT_FILTERS);
  const { data: tasks = [], isLoading, isError, refetch } = useTasks(selectedEventId, filters);

  const deleteTask = useDeleteTask();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Toast on create/update query params
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

  const handleEventSelect = (eventId: string | null) => {
    setSelectedEventId(eventId);
    setFilters(DEFAULT_FILTERS);
    setActiveTab("all");
  };

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

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveTab("all");
  };

  const handleCreate = () => navigate(`/org/tasks/create?eventId=${selectedEventId}`);

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--cd-bg)" }}
    >
      {/* ── Page header (Events-style) ──────────────────────────── */}
      <TaskHeader
        selectedEventId={selectedEventId}
        tasks={allTasks}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* ── Event selector bar ──────────────────────────────────── */}
      <div
        className="border-b px-6 sm:px-10 py-4 flex items-center gap-4 flex-wrap sticky top-0 z-30"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)", backdropFilter: "blur(12px)" }}
      >
        <span
          className="text-[10px] font-black uppercase tracking-widest shrink-0"
          style={{ color: "var(--cd-text-muted)" }}
        >
          Selected Event
        </span>
        <EventDropdown selectedEventId={selectedEventId} onSelect={handleEventSelect} />
        {selectedEventId && (
          <button
            onClick={() => void refetch()}
            title="Refresh tasks"
            className="p-2 rounded-xl transition-all hover:bg-[var(--cd-hover)] text-[var(--cd-text-muted)] hover:text-[var(--cd-text)] active:scale-95"
          >
            <RefreshCw size={15} />
          </button>
        )}
      </div>

      {/* ── Main content area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--cd-bg)" }}>
        {!selectedEventId ? (
          /* No event selected */
          <div className="min-h-[60vh] flex items-center justify-center p-4">
            {events.length === 0 ? (
              <EmptyState
                variant="no-event"
                title="No events yet"
                description="You haven't created any events. Create your first event to start managing tasks."
                action={
                  <button
                    onClick={() => navigate("/org/create-event")}
                    className="cd-btn cd-btn-primary"
                  >
                    Create First Event
                  </button>
                }
              />
            ) : (
              <EmptyState
                variant="no-event"
                title="No event selected"
                description="Select an event from the dropdown above to view and manage its tasks."
              />
            )}
          </div>
        ) : isError ? (
          /* Error state */
          <div className="min-h-[60vh] flex items-center justify-center p-4">
            <EmptyState
              variant="error"
              title="Failed to load tasks"
              description="Something went wrong while fetching tasks."
              action={
                <button
                  onClick={() => void refetch()}
                  className="cd-btn cd-btn-secondary flex items-center gap-2"
                >
                  <RefreshCw size={14} /> Retry
                </button>
              }
            />
          </div>
        ) : (
          /* Task list */
          <div className="flex flex-col">
            <TaskFiltersBar
              filters={filters}
              onChange={handleFiltersChange}
              totalCount={allTasks.length}
              filteredCount={tasks.length}
              tasks={allTasks}
            />
            <div className="p-6 sm:p-10" style={{ backgroundColor: "var(--cd-bg)" }}>
              {/* Desktop: table */}
              <div className="hidden md:block">
                <TaskTable
                  tasks={tasks}
                  isLoading={isLoading}
                  onDelete={setTaskToDelete}
                  onCreateTask={handleCreate}
                  hasFilters={hasActiveFilters}
                  onResetFilters={resetFilters}
                />
              </div>
              {/* Mobile: card list */}
              <div className="block md:hidden pb-10">
                <TaskCardList
                  tasks={tasks}
                  isLoading={isLoading}
                  onDelete={setTaskToDelete}
                  onCreateTask={handleCreate}
                  hasFilters={hasActiveFilters}
                  onResetFilters={resetFilters}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Confirm delete modal ────────────────────────────────── */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? All submissions will be permanently lost.`}
        confirmLabel="Yes, Delete"
        onConfirm={() => void handleDelete()}
        onCancel={() => setTaskToDelete(null)}
        isLoading={deleteTask.isPending}
        danger
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
