import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Pencil, Trash2, CalendarDays, Users, Flag,
  UploadCloud, Star, Clock, Activity, ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format, isPast, parseISO } from "date-fns";
import { useTaskDetail, useTaskActivity } from "../hooks/useTaskDetail";
import { useSubmissions } from "../hooks/useSubmissions";
import { useDeleteTask , useUpdateTask } from "../hooks/useTasks";
import { useEvents } from "../hooks/useEvents";
import SkeletonLoader from "../components/common/SkeletonLoader";
import Avatar from "../components/common/Avatar";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import SubmissionList from "../components/submission/SubmissionList";
import ReviewPanel from "../components/submission/ReviewPanel";
import ConfirmModal from "../components/common/ConfirmModal";
import CommentsSection from "../components/common/CommentsSection";
import { ToastContainer, useToast } from "../components/common/ToastNotification";
import {
  SUBMISSION_STATUS_CONFIG,
  ACTIVITY_ICON,
  ACTIVITY_COLOR,
} from "../constants/task.constants";

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate   = useNavigate();
  const { toasts, addToast, dismiss } = useToast();

  const { data: task, isLoading, isError } = useTaskDetail(taskId);
  const { data: submissions = [], isLoading: subLoading } = useSubmissions(taskId);
  const { data: activity = [] }  = useTaskActivity(taskId);
  const { data: events = [] }    = useEvents();
  const deleteTask               = useDeleteTask();
  const updateTask               = useUpdateTask();
  const [activeTab, setActiveTab]                     = useState<"submissions" | "activity" | "comments">("submissions");
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal]         = useState(false);

  const eventName   = events.find((e) => e.id === task?.eventId)?.name;
  const subCfg      = task ? SUBMISSION_STATUS_CONFIG[task.submissionStatus] : null;
  const isDeadlinePast = task ? isPast(parseISO(task.deadline)) : false;

  const handleDelete = async () => {
    if (!task) return;
    try {
      await deleteTask.mutateAsync(task.id);
      addToast("success", "Task deleted", `"${task.title}" was removed.`);
      setTimeout(() => navigate(`/org/tasks?eventId=${task.eventId}`), 800);
    } catch {
      addToast("error", "Delete failed", "Please try again.");
    } finally {
      setShowDeleteModal(false);
    }
  };
  const handleStatusChange = async (newStatus: "todo" | "in-progress" | "completed") => {
    if (!task) return;
    try {
      await updateTask.mutateAsync({ id: task.id, payload: { status: newStatus } });
      addToast("success", "Status updated!", `Task marked as ${newStatus}.`);
    } catch {
      addToast("error", "Update failed", "Please try again.");
    }
  };

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="w-full min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-semibold">Task not found</p>
          <button
            onClick={() => navigate("/org/tasks")}
            className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* ── Top bar ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400" aria-label="Breadcrumb">
            <Link to="/org/tasks" className="hover:text-indigo-600 transition">Tasks</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-semibold truncate max-w-[200px]">
              {isLoading ? "Loading…" : task?.title}
            </span>
          </nav>
        </div>

        {task && (
          <div className="flex items-center gap-2">
            <Link
              to={`/org/tasks/${task.id}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <Pencil size={13} />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 text-xs font-bold text-red-500 hover:bg-red-50 transition"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <SkeletonLoader type="detail" />
      ) : task ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-auto">

          {/* ── LEFT panel: task info ─────────────────────────────────────────── */}
          <div className="lg:w-[420px] xl:w-[460px] shrink-0 flex flex-col gap-5 p-5 border-r bg-white overflow-y-auto">

            {/* Event link + title + description */}
            <div className="flex flex-col gap-2">
              <Link
                to="/org/events"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-semibold"
              >
                <CalendarDays size={12} />
                {eventName ?? "Unknown Event"}
              </Link>
              <h1 className="text-xl font-extrabold text-gray-900 leading-snug">
                {task.title}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">{task.description}</p>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {subCfg && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${subCfg.bg} ${subCfg.text}`}>
                  {subCfg.label}
                </span>
              )}
              {task.isMandatory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                  <Flag size={10} />
                  Mandatory
                </span>
              )}
            </div>

            {/* Change Status */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Change Status</p>
              <div className="flex gap-2">
                {(["todo", "in-progress", "completed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => void handleStatusChange(s)}
                    disabled={task.status === s || updateTask.isPending}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                      ${task.status === s
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                  >
                    {s === "todo" ? "Todo" : s === "in-progress" ? "In Progress" : "Completed"}
                  </button>
                ))}
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Deadline */}
              <div
                className={`flex flex-col gap-1 p-4 rounded-2xl border ${
                  isDeadlinePast && task.status !== "completed"
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Clock size={11} />
                  Deadline
                </div>
                <p className={`text-sm font-bold mt-0.5 ${
                  isDeadlinePast && task.status !== "completed" ? "text-red-600" : "text-gray-900"
                }`}>
                  {format(parseISO(task.deadline), "MMM d, yyyy")}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(parseISO(task.deadline), { addSuffix: true })}
                </p>
                {isDeadlinePast && task.status !== "completed" && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-md self-start animate-pulse">
                    OVERDUE
                  </span>
                )}
              </div>

              {/* Points */}
              {task.points !== undefined && (
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                    <Star size={11} />
                    Points
                  </div>
                  <p className="text-2xl font-extrabold text-amber-700 leading-none mt-0.5">
                    {task.points}
                  </p>
                  <p className="text-xs text-amber-400">hackathon pts</p>
                </div>
              )}

              {/* Submission type */}
              <div className="flex flex-col gap-1 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <UploadCloud size={11} />
                  Submission
                </div>
                <p className="text-sm font-bold text-gray-900 mt-0.5 capitalize">
                  {task.submissionType === "both" ? "File + GitHub" : task.submissionType}
                </p>
                <p className="text-xs text-gray-400">
                  {task.allowLateSubmission ? "Late allowed" : "On-time only"}
                </p>
              </div>

              {/* Last updated */}
              <div className="flex flex-col gap-1 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Activity size={11} />
                  Updated
                </div>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {formatDistanceToNow(parseISO(task.updatedAt), { addSuffix: true })}
                </p>
                <p className="text-xs text-gray-400">by {task.createdBy}</p>
              </div>
            </div>

            {/* Assignees */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Users size={12} />
                Assigned To ({task.assignedTo.length})
              </div>
              <div className="flex flex-col gap-2">
                {task.assignedTo.map((m, idx) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-indigo-50 transition-colors rounded-xl border border-gray-100 hover:border-indigo-100 group"
                  >
                    <div className="relative shrink-0">
                      <Avatar name={m.name} src={m.avatar} role={m.role} size="md" showTooltip={false} ring ringColor="ring-white" />
                      {/* Online status dot — alternating for demo */}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                        idx % 3 === 0 ? "bg-emerald-400" : idx % 3 === 1 ? "bg-amber-400" : "bg-gray-300"
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 px-2 py-0.5 rounded-md transition-colors truncate max-w-[120px]">
                        {m.email}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        idx % 3 === 0 ? "bg-emerald-50 text-emerald-600" : idx % 3 === 1 ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        {idx % 3 === 0 ? "● Online" : idx % 3 === 1 ? "● Away" : "● Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT panel: submissions + activity ───────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Tab bar */}
            <div className="bg-white border-b px-5 flex gap-0 shrink-0">
              {(["submissions", "activity", "comments"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {tab === "submissions" && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">
                      {submissions.length}
                    </span>
                  )}
                  {tab === "activity" && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
                      {activity.length}
                    </span>
                  )}
                  {tab === "comments" && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
                      💬
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto p-5">
              {activeTab === "submissions" ? (
                <div className="flex flex-col gap-5">
                  {reviewingSubmissionId && (
                    <ReviewPanel
                      submissionId={reviewingSubmissionId}
                      taskId={task.id}
                      currentTaskStatus={task.status}
                      onSuccess={() => {
                        setReviewingSubmissionId(null);
                        addToast("success", "Review submitted!", "The submission has been reviewed.");
                      }}
                      onCancel={() => setReviewingSubmissionId(null)}
                    />
                  )}
                  <SubmissionList
                    submissions={submissions}
                    isLoading={subLoading}
                    onReview={setReviewingSubmissionId}
                  />
                </div>
              ) : activeTab === "comments" ? (
                <CommentsSection taskId={task.id} />
              ) : (
                /* Activity timeline */
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-5">Activity Timeline</h3>

                  {activity.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">
                      No activity recorded yet.
                    </p>
                  ) : (
                    <ol className="relative ml-4 border-l-2 border-gray-100">
                      {activity.map((event) => {
                        const iconCls  = ACTIVITY_COLOR[event.type] ?? "bg-gray-100 text-gray-500";
                        const iconChar = ACTIVITY_ICON[event.type]  ?? "•";
                        return (
                          <li key={event.id} className="mb-5 ml-5">
                            {/* Icon node */}
                            <span
                              className={`absolute -left-3.5 flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold border-2 border-white shadow-sm ${iconCls}`}
                            >
                              {iconChar}
                            </span>

                            {/* Card */}
                            <div className="ml-1 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <p className="text-sm font-semibold text-gray-900">
                                {event.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="text-xs font-medium text-gray-500">
                                  {event.actor}
                                </span>
                                <span className="text-gray-300">·</span>
                                <span className="text-xs text-gray-400">
                                  {formatDistanceToNow(parseISO(event.timestamp), { addSuffix: true })}
                                </span>
                                <span className="text-gray-300">·</span>
                                <span className="text-[10px] text-gray-400">
                                  {format(parseISO(event.timestamp), "MMM d, h:mm a")}
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Task"
        message={`Are you sure you want to delete "${task?.title}"? All submissions and reviews will be permanently lost.`}
        confirmLabel="Yes, Delete"
        onConfirm={() => void handleDelete()}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleteTask.isPending}
        danger
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}