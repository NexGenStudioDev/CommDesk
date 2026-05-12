// ─── Pages ───────────────────────────────────────────────────────────────────
export { default as TaskManagementPage } from "./pages/TaskManagementPage";
export { default as TaskDetailPage }     from "./pages/TaskDetailPage";
export { default as CreateTaskPage }     from "./pages/CreateTaskPage";
export { default as EditTaskPage }       from "./pages/EditTaskPage";

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "./hooks/useTasks";
export { useTaskDetail, useTaskActivity }                        from "./hooks/useTaskDetail";
export { useSubmissions, useReviewSubmission }                   from "./hooks/useSubmissions";
export { useEvents }                                             from "./hooks/useEvents";

// ─── Common components ────────────────────────────────────────────────────────
export { default as StatusBadge }    from "./components/common/StatusBadge";
export { default as PriorityBadge }  from "./components/common/PriorityBadge";
export { default as EmptyState }     from "./components/common/EmptyState";
export { default as SkeletonLoader } from "./components/common/SkeletonLoader";
export { default as ConfirmModal }   from "./components/common/ConfirmModal";
export { ToastContainer, useToast }  from "./components/common/ToastNotification";

// ─── Types ───────────────────────────────────────────────────────────────────
export type {
  Task, TaskStatus, TaskPriority, TaskFilters,
  EventOption, EventType, MemberOption,
  Submission, SubmissionReview, ReviewDecision,
  ActivityEvent, CreateTaskPayload, UpdateTaskPayload,
  ReviewSubmissionPayload,
} from "./Task.types";

// ─── Constants ────────────────────────────────────────────────────────────────
export {
  SELECTED_EVENT_KEY, DEFAULT_FILTERS,
  PRIORITY_CONFIG, STATUS_CONFIG,
  SUBMISSION_STATUS_CONFIG, EVENT_TYPE_CONFIG,
  EVENT_STATUS_CONFIG, REVIEW_DECISION_CONFIG,
  ACTIVITY_ICON, ACTIVITY_COLOR,
} from "./constants/task.constants";