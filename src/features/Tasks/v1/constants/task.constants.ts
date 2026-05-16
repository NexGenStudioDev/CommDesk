import type {
  TaskFilters,
  TaskPriority,
  TaskStatus,
  SubmissionStatus,
  EventType,
  ReviewDecision,
} from "../Task.types";

// ─── Storage ──────────────────────────────────────────────────────────────────
export const SELECTED_EVENT_KEY = "commdesk_selected_event_id";

// ─── Default filter state ─────────────────────────────────────────────────────
export const DEFAULT_FILTERS: TaskFilters = {
  status: "all",
  priority: "all",
  time: "all",
  members: [],
  search: "",
};

// ─── Priority ─────────────────────────────────────────────────────────────────
export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; borderClass: string; badgeBg: string; badgeText: string; dot: string }
> = {
  high: {
    label: "High",
    borderClass: "border-l-red-500",
    badgeBg: "bg-[var(--cd-danger-subtle)]",
    badgeText: "text-[var(--cd-danger)]",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    borderClass: "border-l-amber-400",
    badgeBg: "bg-[var(--cd-warning-subtle)]",
    badgeText: "text-[var(--cd-warning)]",
    dot: "bg-amber-400",
  },
  low: {
    label: "Low",
    borderClass: "border-l-sky-400",
    badgeBg: "bg-[var(--cd-primary-subtle)]",
    badgeText: "text-[var(--cd-primary-text)]",
    dot: "bg-sky-400",
  },
};

// ─── Status ───────────────────────────────────────────────────────────────────
export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  todo: {
    label: "Todo",
    bg: "bg-[var(--cd-surface-2)]",
    text: "text-[var(--cd-text-2)]",
    dot: "bg-gray-400",
  },
  "in-progress": {
    label: "In Progress",
    bg: "bg-[var(--cd-primary-subtle)]",
    text: "text-[var(--cd-primary-text)]",
    dot: "bg-indigo-500",
  },
  completed: {
    label: "Completed",
    bg: "bg-[var(--cd-success-subtle)]",
    text: "text-[var(--cd-success)]",
    dot: "bg-emerald-500",
  },
};

// ─── Submission status ────────────────────────────────────────────────────────
export const SUBMISSION_STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; bg: string; text: string }
> = {
  "not-submitted": {
    label: "Not Submitted",
    bg: "bg-[var(--cd-surface-2)]",
    text: "text-[var(--cd-text-2)]",
  },
  submitted: {
    label: "Submitted",
    bg: "bg-[var(--cd-primary-subtle)]",
    text: "text-[var(--cd-primary-text)]",
  },
  reviewed: {
    label: "Reviewed",
    bg: "bg-[var(--cd-success-subtle)]",
    text: "text-[var(--cd-success)]",
  },
};

// ─── Event type ───────────────────────────────────────────────────────────────
export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; bg: string; text: string; dot: string }
> = {
  hackathon: {
    label: "Hackathon",
    bg: "bg-[var(--cd-danger-subtle)]",
    text: "text-[var(--cd-danger)]",
    dot: "bg-rose-500",
  },
  workshop: {
    label: "Workshop",
    bg: "bg-[var(--cd-primary-subtle)]",
    text: "text-[var(--cd-secondary)]",
    dot: "bg-violet-500",
  },
  internal: {
    label: "Internal",
    bg: "bg-[var(--cd-primary-subtle)]",
    text: "text-[var(--cd-primary-text)]",
    dot: "bg-sky-500",
  },
  community: {
    label: "Community",
    bg: "bg-[var(--cd-success-subtle)]",
    text: "text-[var(--cd-success)]",
    dot: "bg-emerald-500",
  },
};

// ─── Event status ─────────────────────────────────────────────────────────────
export const EVENT_STATUS_CONFIG: Record<
  "Live" | "Upcoming" | "Completed",
  { bg: string; text: string; dot: string; pulse: boolean }
> = {
  Live: {
    bg: "bg-[var(--cd-success-subtle)]",
    text: "text-[var(--cd-success)]",
    dot: "bg-emerald-500",
    pulse: true,
  },
  Upcoming: {
    bg: "bg-[var(--cd-warning-subtle)]",
    text: "text-[var(--cd-warning)]",
    dot: "bg-amber-400",
    pulse: false,
  },
  Completed: {
    bg: "bg-[var(--cd-surface-2)]",
    text: "text-[var(--cd-text-2)]",
    dot: "bg-gray-400",
    pulse: false,
  },
};

// ─── Review decision ──────────────────────────────────────────────────────────
export const REVIEW_DECISION_CONFIG: Record<
  ReviewDecision,
  { label: string; bg: string; text: string; border: string }
> = {
  approved: {
    label: "Approved",
    bg: "bg-[var(--cd-success-subtle)]",
    text: "text-[var(--cd-success)]",
    border: "border-[var(--cd-success)]",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-[var(--cd-danger-subtle)]",
    text: "text-[var(--cd-danger)]",
    border: "border-[var(--cd-danger)]",
  },
  pending: {
    label: "Pending",
    bg: "bg-[var(--cd-warning-subtle)]",
    text: "text-[var(--cd-warning)]",
    border: "border-[var(--cd-warning)]",
  },
};

// ─── Activity timeline ────────────────────────────────────────────────────────
export const ACTIVITY_ICON: Record<string, string> = {
  created: "✦",
  updated: "↻",
  submitted: "↑",
  reviewed: "✓",
  commented: "◎",
};

export const ACTIVITY_COLOR: Record<string, string> = {
  created: "bg-[var(--cd-primary-subtle)] text-[var(--cd-primary)]",
  updated: "bg-[var(--cd-warning-subtle)] text-[var(--cd-warning)]",
  submitted: "bg-[var(--cd-secondary-subtle)] text-[var(--cd-secondary)]",
  reviewed: "bg-[var(--cd-success-subtle)] text-[var(--cd-success)]",
  commented: "bg-[var(--cd-surface-3)] text-[var(--cd-text-2)]",
};

// ─── Submission status colors (legacy alias) ──────────────────────────────────
export const SUBMISSION_STATUS_COLORS = SUBMISSION_STATUS_CONFIG;
export const ACTIVITY_ICONS = ACTIVITY_ICON;

// ─── Submission type ──────────────────────────────────────────────────────────
export const SUBMISSION_TYPE_CONFIG = {
  file: { label: "File Upload", icon: "FileUp" },
  github: { label: "GitHub Repository", icon: "Github" },
  link: { label: "External Link", icon: "Link" },
  all: { label: "Any Submission", icon: "Layers" },
};
