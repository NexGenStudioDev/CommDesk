import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Pencil,
  Star,
  Trash2,
  UploadCloud,
  Users,
  Zap,
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
  const navigate = useNavigate();
  const { toasts, addToast, dismiss } = useToast();

  const { data: task, isLoading, isError } = useTaskDetail(taskId);
  const { data: submissions = [], isLoading: subLoading } = useSubmissions(taskId);
  const { data: activity = [] } = useTaskActivity(taskId);
  const { data: events = [] } = useEvents();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const [activeTab, setActiveTab] = useState<"submissions" | "activity" | "comments">("submissions");
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const eventName = events.find((e) => e.id === task?.eventId)?.name;
  const subCfg = task ? SUBMISSION_STATUS_CONFIG[task.submissionStatus] : null;
  const isDeadlinePast = task ? isPast(parseISO(task.deadline)) : false;
  const isOverdue = Boolean(isDeadlinePast && task?.status !== "completed");

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

  if (isError) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center"
        style={{ backgroundColor: "var(--cd-bg)" }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold" style={{ color: "var(--cd-text)" }}>
            Task not found
          </p>
          <button onClick={() => navigate("/org/tasks")} className="cd-btn cd-btn-primary">
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen w-full flex-col"
      style={{ backgroundColor: "var(--cd-bg)" }}
    >
      <header
        className="border-b px-5 py-4 sm:px-8 lg:px-10"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: "var(--cd-border-subtle)",
        }}
      >
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--cd-text-muted)] transition-colors hover:bg-[var(--cd-hover)] hover:text-[var(--cd-text)]"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <nav
                className="mb-1 flex items-center gap-2 text-xs"
                style={{ color: "var(--cd-text-muted)" }}
                aria-label="Breadcrumb"
              >
                <Link to="/org/tasks" className="font-medium transition-colors hover:text-[var(--cd-primary)]">
                  Tasks
                </Link>
                <ChevronRight size={12} className="opacity-50" />
                <span className="truncate">{eventName ?? "Task detail"}</span>
              </nav>
              <h1
                className="truncate text-base font-semibold leading-tight sm:text-lg"
                style={{ color: "var(--cd-text)" }}
              >
                {isLoading ? "Loading..." : task?.title}
              </h1>
            </div>
          </div>

          {task && (
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to={`/org/tasks/${task.id}/edit`}
                className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium text-[var(--cd-text-2)] transition-colors hover:bg-[var(--cd-hover)] hover:text-[var(--cd-text)]"
                style={{ borderColor: "var(--cd-border)" }}
              >
                <Pencil size={14} /> Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium text-[var(--cd-danger)] transition-colors hover:bg-[var(--cd-danger-subtle)]"
                style={{ borderColor: "var(--cd-danger-subtle)" }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {isLoading ? (
        <SkeletonLoader type="detail" />
      ) : task ? (
        <main className="flex-1 overflow-auto px-5 py-6 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5">
            <section
              className="rounded-xl border p-5 sm:p-6"
              style={{
                backgroundColor: "var(--cd-surface)",
                borderColor: "var(--cd-border-subtle)",
              }}
            >
              <Link
                to="/org/events"
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--cd-primary-text)] transition-colors hover:text-[var(--cd-primary)]"
              >
                <CalendarDays size={14} />
                {eventName ?? "Unknown Event"}
              </Link>

              <h2
                className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
                style={{ color: "var(--cd-text)" }}
              >
                {task.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6" style={{ color: "var(--cd-text-2)" }}>
                {task.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {subCfg && (
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${subCfg.bg} ${subCfg.text}`}
                  >
                    {subCfg.label}
                  </span>
                )}
                {task.isMandatory && (
                  <span
                    className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "var(--cd-surface-2)",
                      color: "var(--cd-text-2)",
                    }}
                  >
                    Required
                  </span>
                )}
              </div>
            </section>

            <section
              className="rounded-xl border p-4 sm:p-5"
              style={{
                backgroundColor: "var(--cd-surface)",
                borderColor: "var(--cd-border-subtle)",
              }}
            >
              <p
                className="mb-3 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--cd-text-muted)" }}
              >
                Change Status
              </p>
              <div className="grid gap-2 rounded-2xl border p-1.5 sm:grid-cols-3" style={{ backgroundColor: "var(--cd-surface-2)", borderColor: "rgba(255,255,255,0.05)" }}>
                {(["todo", "in-progress", "completed"] as const).map((status) => {
                  const isActive = task.status === status;
                  const iconClass = isActive ? "!text-[#3B82F6] drop-shadow-[0_0_6px_rgba(59,130,246,0.45)]"
                  : "text-current";
                  const icons = {
                    todo: <Circle size={14} className={iconClass} />,
                    "in-progress": <Zap size={14} className={iconClass} />,
                    completed: <CheckCircle2 size={14} className={iconClass} />,
                  };
                  return (
                    <button
                      key={status}
                      onClick={() => void handleStatusChange(status)}
                      disabled={isActive || updateTask.isPending}
                      className={`flex items-center justify-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 disabled:cursor-not-allowed ${
                        isActive
                          ? "bg-[var(--cd-surface-3)] text-[var(--cd-primary)] font-bold shadow-lg shadow-[var(--cd-primary-subtle)] border border-[var(--cd-border-subtle)]"
                          : "text-[var(--cd-text-2)] font-medium hover:bg-[var(--cd-hover)] hover:text-[var(--cd-text)]"
                      }`}
                    >
                      {icons[status]}
                      {status === "todo" ? "Todo" : status === "in-progress" ? "Working" : "Done"}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetaCard
                icon={<Clock size={12} />}
                label="Deadline"
                value={format(parseISO(task.deadline), "MMM d, yyyy")}
                detail={formatDistanceToNow(parseISO(task.deadline), { addSuffix: true })}
                danger={isOverdue}
              />

              {task.points !== undefined && (
                <MetaCard
                  icon={<Star size={12} />}
                  label="Points"
                  value={String(task.points)}
                  detail="hackathon pts"
                />
              )}

              <MetaCard
                icon={<UploadCloud size={12} />}
                label="Submission"
                value={SUBMISSION_TYPE_CONFIG[task.submissionType]?.label ?? task.submissionType}
                detail={task.allowLateSubmission ? "Late allowed" : "On-time only"}
              />

              <MetaCard
                icon={<Activity size={12} />}
                label="Updated"
                value={formatDistanceToNow(parseISO(task.updatedAt), { addSuffix: true })}
                detail={`by ${task.createdBy}`}
              />
            </section>

            <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div
                className="rounded-xl border p-5"
                style={{
                  backgroundColor: "var(--cd-surface)",
                  borderColor: "var(--cd-border-subtle)",
                }}
              >
                <div
                  className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--cd-text-muted)" }}
                >
                  <Users size={13} />
                  Assigned To ({task.assignedTo.length})
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {task.assignedTo.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                      style={{
                        backgroundColor: "var(--cd-surface-2)",
                        borderColor: "var(--cd-border-subtle)",
                      }}
                    >
                      <Avatar
                        name={member.name}
                        src={member.avatar}
                        role={member.role}
                        size="md"
                        showTooltip={false}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium" style={{ color: "var(--cd-text)" }}>
                          {member.name}
                        </p>
                        <p className="truncate text-xs" style={{ color: "var(--cd-text-muted)" }}>
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {task.technologies && task.technologies.length > 0 && (
                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: "var(--cd-surface)",
                    borderColor: "var(--cd-border-subtle)",
                  }}
                >
                  <p
                    className="mb-4 text-[11px] font-semibold uppercase tracking-wider"
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
            </section>

            <section
              className="overflow-hidden rounded-xl border"
              style={{
                backgroundColor: "var(--cd-surface)",
                borderColor: "var(--cd-border-subtle)",
              }}
            >
              <div
                className="flex gap-1 overflow-x-auto border-b px-3"
                style={{ borderColor: "var(--cd-border-subtle)" }}
              >
                {(["submissions", "activity", "comments"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative flex items-center gap-2 px-3 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors"
                    style={{ color: activeTab === tab ? "var(--cd-text)" : "var(--cd-text-2)" }}
                  >
                    {tab}
                    {tab !== "comments" && (
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[11px] font-medium"
                        style={{
                          backgroundColor: activeTab === tab ? "var(--cd-primary-subtle)" : "var(--cd-surface-2)",
                          color: activeTab === tab ? "var(--cd-primary-text)" : "var(--cd-text-muted)",
                        }}
                      >
                        {tab === "submissions" ? submissions.length : activity.length}
                      </span>
                    )}
                    {activeTab === tab && (
                      <span
                        className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                        style={{ backgroundColor: "var(--cd-primary)" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-5">
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
                  <ActivityTimeline activity={activity} />
                )}
              </div>
            </section>
          </div>
        </main>
      ) : null}

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

function MetaCard({
  icon,
  label,
  value,
  detail,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  danger?: boolean;
}) {
  return (
    <div
      className="flex min-h-28 flex-col rounded-xl border p-4"
      style={{
        backgroundColor: danger ? "var(--cd-danger-subtle)" : "var(--cd-surface)",
        borderColor: danger ? "var(--cd-danger-subtle)" : "var(--cd-border-subtle)",
      }}
    >
      <div
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: danger ? "var(--cd-danger)" : "var(--cd-text-muted)" }}
      >
        {icon}
        {label}
      </div>
      <p
        className="mt-2 text-base font-semibold"
        style={{ color: danger ? "var(--cd-danger)" : "var(--cd-text)" }}
      >
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--cd-text-muted)" }}>
        {detail}
      </p>
      {danger && (
        <span
          className="mt-2 w-fit rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            backgroundColor: "var(--cd-danger-subtle)",
            color: "var(--cd-danger)",
          }}
        >
          OVERDUE
        </span>
      )}
    </div>
  );
}

function ActivityTimeline({
  activity,
}: {
  activity: ReturnType<typeof useTaskActivity>["data"];
}) {
  if (!activity || activity.length === 0) {
    return (
      <p className="py-10 text-center text-sm" style={{ color: "var(--cd-text-muted)" }}>
        No activity recorded yet.
      </p>
    );
  }

  return (
    <ol className="relative ml-3 border-l" style={{ borderColor: "var(--cd-border-subtle)" }}>
      {activity.map((event) => {
        const iconCls = ACTIVITY_COLOR[event.type] ?? "bg-gray-100 text-gray-500";
        const iconChar = ACTIVITY_ICON[event.type] ?? "*";
        return (
          <li key={event.id} className="mb-4 ml-5">
            <span
              className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${iconCls}`}
              style={{ borderColor: "var(--cd-surface)" }}
            >
              {iconChar}
            </span>

            <div
              className="rounded-lg border p-3"
              style={{
                backgroundColor: "var(--cd-surface-2)",
                borderColor: "var(--cd-border-subtle)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--cd-text)" }}>
                {event.description}
              </p>
              <div
                className="mt-1.5 flex flex-wrap items-center gap-2 text-xs"
                style={{ color: "var(--cd-text-muted)" }}
              >
                <span>{event.actor}</span>
                <span>·</span>
                <span>{formatDistanceToNow(parseISO(event.timestamp), { addSuffix: true })}</span>
                <span>·</span>
                <span>{format(parseISO(event.timestamp), "MMM d, h:mm a")}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
