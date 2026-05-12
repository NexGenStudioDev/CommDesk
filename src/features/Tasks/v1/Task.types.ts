export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type SubmissionType = "file" | "github" | "link" | "all";
export type SubmissionStatus = "not-submitted" | "submitted" | "reviewed";
export type ReviewDecision = "approved" | "rejected" | "pending";
export type EventType = "hackathon" | "workshop" | "internal" | "community";

// ─── Technology tag ───────────────────────────────────────────────────────────
export interface TechTag {
  id: string;
  label: string;
  color: string; // Tailwind bg class e.g. "bg-sky-100 text-sky-700"
}

export interface EventOption {
  id: string;
  name: string;
  subtitle: string;
  type: EventType;
  status: "Live" | "Upcoming" | "Completed";
  startDate: string;
  endDate: string;
}

export interface MemberOption {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  assignedTo: MemberOption[];
  submissionType: SubmissionType;
  submissionStatus: SubmissionStatus;
  isMandatory: boolean;
  points?: number;
  allowLateSubmission: boolean;
  maxSubmissions?: number;
  attachments?: string[];
  technologies?: TechTag[]; // NEW
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Submission {
  id: string;
  taskId: string;
  submittedBy: MemberOption;
  fileUrl?: string;
  githubUrl?: string;
  linkUrl?: string;
  notes?: string;
  submittedAt: string;
  review?: SubmissionReview;
}

export interface SubmissionReview {
  decision: ReviewDecision;
  score?: number;
  feedback?: string;
  reviewedBy: string;
  reviewedAt: string;
}

export interface ActivityEvent {
  id: string;
  type: "created" | "updated" | "submitted" | "reviewed" | "commented";
  actor: string;
  description: string;
  timestamp: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface TaskFilters {
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  time: "all" | "upcoming" | "past" | "completed";
  members: string[];
  search: string;
}

export interface CreateTaskPayload {
  eventId: string;
  title: string;
  description: string;
  assignedTo: string[];
  deadline: string;
  priority: TaskPriority;
  submissionType: SubmissionType;
  isMandatory: boolean;
  points?: number;
  allowLateSubmission: boolean;
  maxSubmissions?: number;
  technologies?: TechTag[];
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  status?: TaskStatus;
}

export interface ReviewSubmissionPayload {
  decision: ReviewDecision;
  score?: number;
  feedback?: string;
}