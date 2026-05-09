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
    badgeBg: "bg-red-50",
    badgeText: "text-red-600",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    borderClass: "border-l-amber-400",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
    dot: "bg-amber-400",
  },
  low: {
    label: "Low",
    borderClass: "border-l-sky-400",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-600",
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
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },
  "in-progress": {
    label: "In Progress",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    dot: "bg-indigo-500",
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
};

// ─── Submission status ────────────────────────────────────────────────────────
export const SUBMISSION_STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; bg: string; text: string }
> = {
  "not-submitted": { label: "Not Submitted", bg: "bg-gray-100",    text: "text-gray-500" },
  submitted:       { label: "Submitted",      bg: "bg-sky-50",      text: "text-sky-600"  },
  reviewed:        { label: "Reviewed",       bg: "bg-emerald-50",  text: "text-emerald-600" },
};

// ─── Event type ───────────────────────────────────────────────────────────────
export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; bg: string; text: string; dot: string }
> = {
  hackathon: { label: "Hackathon", bg: "bg-rose-50",    text: "text-rose-600",    dot: "bg-rose-500"    },
  workshop:  { label: "Workshop",  bg: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-500"  },
  internal:  { label: "Internal",  bg: "bg-sky-50",     text: "text-sky-600",     dot: "bg-sky-500"     },
  community: { label: "Community", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
};

// ─── Event status ─────────────────────────────────────────────────────────────
export const EVENT_STATUS_CONFIG: Record<
  "Live" | "Upcoming" | "Completed",
  { bg: string; text: string; dot: string; pulse: boolean }
> = {
  Live:      { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", pulse: true  },
  Upcoming:  { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400",   pulse: false },
  Completed: { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400",    pulse: false },
};

// ─── Review decision ──────────────────────────────────────────────────────────
export const REVIEW_DECISION_CONFIG: Record<
  ReviewDecision,
  { label: string; bg: string; text: string; border: string }
> = {
  approved: { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  rejected: { label: "Rejected", bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200"     },
  pending:  { label: "Pending",  bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200"   },
};

// ─── Activity timeline ────────────────────────────────────────────────────────
export const ACTIVITY_ICON: Record<string, string> = {
  created:   "✦",
  updated:   "↻",
  submitted: "↑",
  reviewed:  "✓",
  commented: "◎",
};

export const ACTIVITY_COLOR: Record<string, string> = {
  created:   "bg-indigo-100 text-indigo-600",
  updated:   "bg-amber-100 text-amber-600",
  submitted: "bg-sky-100 text-sky-600",
  reviewed:  "bg-emerald-100 text-emerald-600",
  commented: "bg-purple-100 text-purple-600",
};

// ─── Submission status colors (legacy alias) ──────────────────────────────────
export const SUBMISSION_STATUS_COLORS = SUBMISSION_STATUS_CONFIG;
export const ACTIVITY_ICONS = ACTIVITY_ICON;