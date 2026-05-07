export type Permission =
  | "CREATE_TASK"
  | "ASSIGN_TASK"
  | "UPDATE_STATUS"
  | "EDIT_TASK"
  | "DELETE_TASK"
  | "MULTIPLE_SUBMISSION"
  | "LATE_SUBMISSION"
  | "VIEW_ALL_TASKS";

export type TaskStatus = "todo" | "in-progress" | "completed" | "review";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  eventId: string;
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  deadline: string;
  createdAt: string;
  tags?: string[];
}

export interface Submission {
  id: string;
  taskId: string;
  submittedBy: string;
  submittedByName: string;
  content: string;
  fileUrl?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewNote?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  eventId: string;
  assignedTo: string;
  deadline: string;
  tags?: string;
}
