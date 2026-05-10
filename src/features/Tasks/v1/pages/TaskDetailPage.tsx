import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Pencil, Trash2, CalendarDays, Users, Flag,
  UploadCloud, Star, Clock, Activity, ChevronRight,
  CheckCircle2, Circle, Zap,
} from "lucide-react";
import { formatDistanceToNow, format, isPast, parseISO } from "date-fns";
import { useTaskDetail, useTaskActivity } from "../hooks/useTaskDetail";
import { useSubmissions } from "../hooks/useSubmissions";
import { useDeleteTask, useUpdateTask } from "../hooks/useTasks";
import { useEvents } from "../hooks/useEvents";
import SkeletonLoader from "../components/common/SkeletonLoader";
import Avatar from "../components/common/Avatar";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import TechBadge from "../components/common/TechBadge";
import SubmissionList from "../components/submission/SubmissionList";
import ReviewPanel from "../components/submission/ReviewPanel";
import ConfirmModal from "../components/common/ConfirmModal";
import CommentsSection from "../components/common/CommentsSection";
import { ToastContainer, useToast } from "../components/common/ToastNotification";
import {
  SUBMISSION_STATUS_CONFIG,
  SUBMISSION_TYPE_CONFIG,
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
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--cd-bg)" }}
      >
        <div className="text-center flex flex-col items-center gap-4">
          <p className="text-lg font-semibold" style={{ color: "var(--cd-text)" }}>
            Task not found
          </p>
          <button
            onClick={() => navigate("/org/tasks")}
            className="cd-btn cd-btn-primary"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--cd-bg)" }}
    >
      {/* ── Top bar (Events-style header) ─────────────────────────────────────── */}
      <div
        className="border-b px-5 sm:px-[3vw] py-3.5 flex items-center justify-between gap-4 flex-wrap shrink-0"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: "var(--cd-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl transition-all hover:bg-[var(--cd-hover)] text-[var(--cd-text-muted)] hover:text-[var(--cd-text)] active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs text-[var(--cd-text-muted)]"
            aria-label="Breadcrumb"
          >
            <Link
              to="/org/tasks"
              className="font-medium hover:text-[var(--cd-primary)] transition-colors"
            >
              Tasks
            </Link>
            <ChevronRight size={12} className="opacity-50" />
            <span
              className="font-bold truncate max-w-[200px] text-[var(--cd-text)]"
            >
              {isLoading ? "Loading…" : task?.title}
            </span>
          </nav>
        </div>

        {task && (
          <div className="flex items-center gap-2">
            <Link
              to={`/org/tasks/${task.id}/edit`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--cd-border)] text-[var(--cd-text-2)] hover:text-[var(--cd-text)] hover:bg-[var(--cd-hover)] text-xs font-bold transition-all active:scale-95"
            >
              <Pencil size={13} /> Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--cd-danger-subtle)] text-[var(--cd-danger)] hover:bg-[var(--cd-danger-subtle)] text-xs font-bold transition-all active:scale-95"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <SkeletonLoader type="detail" />
      ) : task ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

          {/* ── LEFT panel: task info ──────────────────────────────────────────── */}
          <div
            className="lg:w-[420px] xl:w-[460px] shrink-0 flex flex-col gap-5 p-5 border-r overflow-y-auto"
            style={{
              backgroundColor: "var(--cd-surface)",
              borderColor: "var(--cd-border)",
            }}
          >
            {/* Event link + title + description */}
            <div className="flex flex-col gap-3">
              <Link
                to="/org/events"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cd-primary)] hover:opacity-75 transition-opacity"
              >
                <CalendarDays size={12} />
                {eventName ?? "Unknown Event"}
              </Link>
              <h1
                className="text-2xl font-black leading-tight text-[var(--cd-text)]"
              >
                {task.title}
              </h1>
              <p
                className="text-sm leading-relaxed text-[var(--cd-text-2)]"
              >
                {task.description}
              </p>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {subCfg && (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${subCfg.bg} ${subCfg.text}`}
                >
                  {subCfg.label}
                </span>
              )}
              {task.isMandatory && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--cd-primary-subtle)",
                    color: "var(--cd-primary-text)",
                  }}
                >
                  <Flag size={10} /> Mandatory
                </span>
              )}
            </div>

            {/* Change Status */}
            <div className="flex flex-col gap-3">
              <p
                className="text-[10px] font-bold uppercase tracking-widest text-[var(--cd-text-muted)]"
              >
                Change Status
              </p>
              <div className="flex gap-2 p-1.5 rounded-2xl bg-[var(--cd-surface-2)] border border-[var(--cd-border-subtle)]">
                {(["todo", "in-progress", "completed"] as const).map((s) => {
                  const isActive = task.status === s;
                  const icons = {
                    "todo":        <Circle size={12} />,
                    "in-progress": <Zap size={12} />,
                    "completed":   <CheckCircle2 size={12} />,
                  };
                  return (
                    <button
                      key={s}
                      onClick={() => void handleStatusChange(s)}
                      disabled={isActive || updateTask.isPending}
                      className={`
                        flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all
                        ${isActive 
                          ? "bg-[var(--cd-surface)] text-[var(--cd-primary)] shadow-sm border border-[var(--cd-border)]" 
                          : "text-[var(--cd-text-2)] hover:text-[var(--cd-text)] hover:bg-[var(--cd-hover)] border border-transparent"}
                        disabled:opacity-40 disabled:cursor-not-allowed
                      `}
                    >
                      {icons[s]}
                      {s === "todo" ? "Todo" : s === "in-progress" ? "Working" : "Done"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Deadline */}
              <div
                className="flex flex-col gap-1 p-4 rounded-2xl border"
                style={{
                  backgroundColor:
                    isDeadlinePast && task.status !== "completed"
                      ? "var(--cd-danger-subtle)"
                      : "var(--cd-surface-2)",
                  borderColor:
                    isDeadlinePast && task.status !== "completed"
                      ? "var(--cd-danger)"
                      : "var(--cd-border)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--cd-text-muted)" }}
                >
                  <Clock size={11} /> Deadline
                </div>
                <p
                  className="text-sm font-bold mt-0.5"
                  style={{
                    color:
                      isDeadlinePast && task.status !== "completed"
                        ? "var(--cd-danger)"
                        : "var(--cd-text)",
                  }}
                >
                  {format(parseISO(task.deadline), "MMM d, yyyy")}
                </p>
                <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                  {formatDistanceToNow(parseISO(task.deadline), { addSuffix: true })}
                </p>
                {isDeadlinePast && task.status !== "completed" && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md self-start animate-pulse"
                    style={{
                      color: "var(--cd-danger)",
                      backgroundColor: "var(--cd-danger-subtle)",
                    }}
                  >
                    OVERDUE
                  </span>
                )}
              </div>

              {/* Points */}
              {task.points !== undefined && (
                <div
                  className="flex flex-col gap-1 p-4 rounded-2xl border"
                  style={{
                    backgroundColor: "rgba(251,191,36,0.08)",
                    borderColor: "rgba(251,191,36,0.25)",
                  }}
                >
                  <div
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--cd-warning)" }}
                  >
                    <Star size={11} /> Points
                  </div>
                  <p className="text-2xl font-extrabold leading-none mt-0.5" style={{ color: "var(--cd-warning)" }}>
                    {task.points}
                  </p>
                  <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                    hackathon pts
                  </p>
                </div>
              )}

              {/* Submission type */}
              <div
                className="flex flex-col gap-1 p-4 rounded-2xl border"
                style={{
                  backgroundColor: "var(--cd-surface-2)",
                  borderColor: "var(--cd-border)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--cd-text-muted)" }}
                >
                  <UploadCloud size={11} /> Submission
                </div>
                <p className="text-sm font-bold mt-0.5" style={{ color: "var(--cd-text)" }}>
                  {SUBMISSION_TYPE_CONFIG[task.submissionType]?.label ?? task.submissionType}
                </p>
                <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                  {task.allowLateSubmission ? "Late allowed" : "On-time only"}
                </p>
              </div>

              {/* Last updated */}
              <div
                className="flex flex-col gap-1 p-4 rounded-2xl border"
                style={{
                  backgroundColor: "var(--cd-surface-2)",
                  borderColor: "var(--cd-border)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--cd-text-muted)" }}
                >
                  <Activity size={11} /> Updated
                </div>
                <p className="text-sm font-bold mt-0.5" style={{ color: "var(--cd-text)" }}>
                  {formatDistanceToNow(parseISO(task.updatedAt), { addSuffix: true })}
                </p>
                <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                  by {task.createdBy}
                </p>
              </div>
            </div>

            {/* Technologies */}
            {task.technologies && task.technologies.length > 0 && (
              <div className="flex flex-col gap-2">
                <p
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--cd-text-muted)" }}
                >
                  Technologies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {task.technologies.map((tech) => (
                    <TechBadge key={tech.id} tech={tech} />
                  ))}
                </div>
              </div>
            )}

            {/* Assignees */}
            <div className="flex flex-col gap-3">
              <div
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--cd-text-muted)]"
              >
                <Users size={12} />
                Assigned To ({task.assignedTo.length})
              </div>
              <div className="flex flex-col gap-2.5">
                {task.assignedTo.map((m, idx) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--cd-border)] bg-[var(--cd-surface-2)] hover:border-[var(--cd-primary)] hover:bg-[var(--cd-primary-subtle)] transition-all duration-200 group cursor-default"
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        name={m.name}
                        src={m.avatar}
                        role={m.role}
                        size="md"
                        showTooltip={false}
                        ring
                        ringColor="ring-[var(--cd-surface)]"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--cd-surface)] shadow-sm ${
                          idx % 3 === 0 ? "bg-emerald-400" : idx % 3 === 1 ? "bg-amber-400" : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate text-[var(--cd-text)]">
                        {m.name}
                      </p>
                      <p className="text-xs truncate text-[var(--cd-text-muted)]">
                        {m.role}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[var(--cd-surface)] text-[var(--cd-text-muted)] transition-colors truncate max-w-[120px] border border-[var(--cd-border-subtle)]"
                      >
                        {m.email}
                      </span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          idx % 3 === 0
                            ? "bg-[var(--cd-success-subtle)] text-[var(--cd-success)]"
                            : idx % 3 === 1
                            ? "bg-[var(--cd-warning-subtle)] text-[var(--cd-warning)]"
                            : "bg-[var(--cd-surface-3)] text-[var(--cd-text-muted)]"
                        }`}
                      >
                        {idx % 3 === 0 ? "Online" : idx % 3 === 1 ? "Away" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT panel: submissions + activity ────────────────────────────── */}
          <div
            className="flex-1 flex flex-col overflow-hidden min-h-0"
            style={{ backgroundColor: "var(--cd-bg)" }}
          >
            {/* Tab bar (Events-style) */}
            <div
              className="border-b px-5 flex gap-0 shrink-0"
              style={{
                backgroundColor: "var(--cd-surface)",
                borderColor: "var(--cd-border)",
              }}
            >
              {(["submissions", "activity", "comments"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-bold border-b-2 transition-colors capitalize whitespace-nowrap"
                  style={{
                    color: activeTab === tab ? "var(--cd-primary)" : "var(--cd-text-2)",
                    borderColor: activeTab === tab ? "var(--cd-primary)" : "transparent",
                  }}
                >
                  {tab}
                  {tab === "submissions" && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors"
                      style={{
                        backgroundColor: activeTab === tab ? "var(--cd-primary-subtle)" : "var(--cd-surface-3)",
                        color: activeTab === tab ? "var(--cd-primary-text)" : "var(--cd-text-muted)",
                      }}
                    >
                      {submissions.length}
                    </span>
                  )}
                  {tab === "activity" && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors"
                      style={{
                        backgroundColor: activeTab === tab ? "var(--cd-primary-subtle)" : "var(--cd-surface-3)",
                        color: activeTab === tab ? "var(--cd-primary-text)" : "var(--cd-text-muted)",
                      }}
                    >
                      {activity.length}
                    </span>
                  )}
                  {tab === "comments" && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors"
                      style={{
                        backgroundColor: activeTab === tab ? "var(--cd-primary-subtle)" : "var(--cd-surface-3)",
                        color: activeTab === tab ? "var(--cd-primary-text)" : "var(--cd-text-muted)",
                      }}
                    >
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
                  <h3 className="text-sm font-bold mb-5" style={{ color: "var(--cd-text)" }}>
                    Activity Timeline
                  </h3>

                  {activity.length === 0 ? (
                    <p
                      className="text-sm text-center py-10"
                      style={{ color: "var(--cd-text-muted)" }}
                    >
                      No activity recorded yet.
                    </p>
                  ) : (
                    <ol
                      className="relative ml-4 border-l-2"
                      style={{ borderColor: "var(--cd-border)" }}
                    >
                      {activity.map((event) => {
                        const iconCls  = ACTIVITY_COLOR[event.type] ?? "bg-gray-100 text-gray-500";
                        const iconChar = ACTIVITY_ICON[event.type]  ?? "•";
                        return (
                          <li key={event.id} className="mb-5 ml-5">
                            {/* Icon node */}
                            <span
                              className={`absolute -left-3.5 flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold border-2 shadow-sm ${iconCls}`}
                              style={{ borderColor: "var(--cd-surface)" }}
                            >
                              {iconChar}
                            </span>

                            {/* Card */}
                            <div
                              className="ml-1 p-4 rounded-xl border shadow-sm"
                              style={{
                                backgroundColor: "var(--cd-surface)",
                                borderColor: "var(--cd-border)",
                              }}
                            >
                              <p className="text-sm font-semibold" style={{ color: "var(--cd-text)" }}>
                                {event.description}
                              </p>
                              <div
                                className="flex items-center gap-2 mt-1.5 flex-wrap"
                                style={{ color: "var(--cd-text-muted)" }}
                              >
                                <span className="text-xs font-medium">{event.actor}</span>
                                <span>·</span>
                                <span className="text-xs">
                                  {formatDistanceToNow(parseISO(event.timestamp), { addSuffix: true })}
                                </span>
                                <span>·</span>
                                <span className="text-[10px]">
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
