import type { Event, Task, Submission, Comment } from "../types/task.types";

export const mockEvents: Event[] = [
  { id: "evt-1", name: "HackFest 2026" },
  { id: "evt-2", name: "Spring Bootcamp" },
  { id: "evt-3", name: "Open Source Day" },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Build Landing Page",
    description: "Design and implement the event landing page with responsive layout.",
    status: "in-progress",
    priority: "high",
    eventId: "evt-1",
    assignedTo: "user-1",
    assignedToName: "Arjun Mehta",
    createdBy: "user-2",
    deadline: "2026-08-10",
    createdAt: "2026-07-01",
    tags: ["frontend", "design"],
  },
  {
    id: "task-2",
    title: "Fix Auth Bug",
    description: "Resolve the JWT token expiry issue causing silent logouts.",
    status: "todo",
    priority: "urgent",
    eventId: "evt-1",
    assignedTo: "user-1",
    assignedToName: "Arjun Mehta",
    createdBy: "user-2",
    deadline: "2026-08-05",
    createdAt: "2026-07-02",
    tags: ["backend", "auth"],
  },
  {
    id: "task-3",
    title: "Design System Setup",
    description: "Establish component library and token system for the hackathon UI.",
    status: "completed",
    priority: "medium",
    eventId: "evt-1",
    assignedTo: "user-3",
    assignedToName: "Priya Sharma",
    createdBy: "user-1",
    deadline: "2026-07-20",
    createdAt: "2026-07-01",
    tags: ["design"],
  },
  {
    id: "task-4",
    title: "API Integration",
    description: "Connect frontend to backend REST APIs for participant data.",
    status: "review",
    priority: "high",
    eventId: "evt-2",
    assignedTo: "user-1",
    assignedToName: "Arjun Mehta",
    createdBy: "user-2",
    deadline: "2026-08-15",
    createdAt: "2026-07-05",
    tags: ["backend", "api"],
  },
  {
    id: "task-5",
    title: "Write Documentation",
    description: "Document all API endpoints and component usage.",
    status: "todo",
    priority: "low",
    eventId: "evt-2",
    assignedTo: "user-3",
    assignedToName: "Priya Sharma",
    createdBy: "user-1",
    deadline: "2026-08-20",
    createdAt: "2026-07-06",
    tags: ["docs"],
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: "sub-1",
    taskId: "task-1",
    submittedBy: "user-1",
    submittedByName: "Arjun Mehta",
    content: "Completed the landing page. Deployed at staging URL.",
    submittedAt: "2026-08-08T10:30:00Z",
    status: "pending",
  },
  {
    id: "sub-2",
    taskId: "task-4",
    submittedBy: "user-1",
    submittedByName: "Arjun Mehta",
    content: "All endpoints integrated. Tests passing.",
    submittedAt: "2026-08-12T14:00:00Z",
    status: "approved",
    reviewNote: "Great work! Clean implementation.",
  },
];

export const mockComments: Comment[] = [
  {
    id: "cmt-1",
    taskId: "task-1",
    authorId: "user-2",
    authorName: "Rahul Verma",
    content: "Please make sure the mobile breakpoints are tested.",
    createdAt: "2026-08-07T09:00:00Z",
  },
  {
    id: "cmt-2",
    taskId: "task-1",
    authorId: "user-1",
    authorName: "Arjun Mehta",
    content: "Done, tested on 375px and 768px.",
    createdAt: "2026-08-07T11:00:00Z",
  },
];

export const mockMembers = [
  { id: "user-1", name: "Arjun Mehta" },
  { id: "user-2", name: "Rahul Verma" },
  { id: "user-3", name: "Priya Sharma" },
  { id: "user-4", name: "Sneha Patel" },
];
