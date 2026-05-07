import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdAdd, MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import type { Task, TaskStatus, TaskPriority } from "../../types/task.types";
import { usePermissions } from "../../context/PermissionContext";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import ConfirmModal from "../common/ConfirmModal";
import SkeletonLoader from "../common/SkeletonLoader";

interface Props {
  tasks: Task[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "In Review" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS: { value: TaskPriority | "all"; label: string }[] = [
  { value: "all", label: "All Priority" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function TaskTable({ tasks, isLoading, onDelete }: Props) {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        !search || t.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  if (isLoading) return <SkeletonLoader rows={6} />;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "all")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
        >
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasPermission("CREATE_TASK") && (
          <button
            onClick={() => navigate("/org/tasks/create")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#306ee8] text-white rounded-lg hover:bg-[#2558c9] transition-colors ml-auto"
          >
            <MdAdd className="text-base" />
            New Task
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No tasks found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Task</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Assigned To</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Deadline</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((task) => (
                  <tr
                    key={task.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      task.priority === "urgent" ? "border-l-2 border-l-red-400" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{task.title}</div>
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {task.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{task.assignedToName}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(task.deadline).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => navigate(`/org/tasks/${task.id}`)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#306ee8] hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <MdVisibility />
                        </button>
                        {hasPermission("EDIT_TASK") && (
                          <button
                            onClick={() => navigate(`/org/tasks/${task.id}/edit`)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                            title="Edit"
                          >
                            <MdEdit />
                          </button>
                        )}
                        {hasPermission("DELETE_TASK") && (
                          <button
                            onClick={() => setDeleteTarget(task.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <MdDelete />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Task"
          message="This action cannot be undone. Are you sure you want to delete this task?"
          confirmLabel="Delete"
          onConfirm={() => {
            onDelete(deleteTarget);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
