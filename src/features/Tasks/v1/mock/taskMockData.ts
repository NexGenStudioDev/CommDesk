import type {
  EventOption, MemberOption, Task, Submission, ActivityEvent, TaskComment,
} from "../Task.types";

// ─── Avatar helper — initials-based, always loads ────────────────────────────
const av = (name: string, bg: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=96&bold=true&rounded=true`;

// ─── Mock Events ──────────────────────────────────────────────────────────────
export const mockEvents: EventOption[] = [
  { id: "evt-001", name: "Summer AI Hackathon 2026", subtitle: "Sponsored by TechCorp",   type: "hackathon", status: "Live",      startDate: "2026-06-15", endDate: "2026-06-17" },
  { id: "evt-002", name: "Web3 Builders Sprint",     subtitle: "Internal Team Event",     type: "internal",  status: "Upcoming",  startDate: "2026-07-01", endDate: "2026-07-03" },
  { id: "evt-003", name: "Global Open Source Hack",  subtitle: "Public Event",            type: "hackathon", status: "Completed", startDate: "2026-05-10", endDate: "2026-05-12" },
  { id: "evt-004", name: "Speed Code Blitz",         subtitle: "Internal Team Event",     type: "internal",  status: "Completed", startDate: "2026-04-22", endDate: "2026-04-22" },
  { id: "evt-005", name: "Design Systems Workshop",  subtitle: "Design Department",       type: "workshop",  status: "Upcoming",  startDate: "2026-08-05", endDate: "2026-08-07" },
  { id: "evt-006", name: "Community Growth Sprint",  subtitle: "Open to all members",     type: "community", status: "Live",      startDate: "2026-05-01", endDate: "2026-05-31" },
];

// ─── Mock Members ─────────────────────────────────────────────────────────────
export const mockMembers: MemberOption[] = [
  { id: "mem-001", name: "Arjun Mehta",   avatar: av("Arjun Mehta",   "6366f1"), role: "Frontend Developer",   email: "arjun@commdesk.io"  },
  { id: "mem-002", name: "Priya Sharma",  avatar: av("Priya Sharma",  "ec4899"), role: "UI/UX Designer",       email: "priya@commdesk.io"  },
  { id: "mem-003", name: "Rohit Verma",   avatar: av("Rohit Verma",   "f97316"), role: "Backend Developer",    email: "rohit@commdesk.io"  },
  { id: "mem-004", name: "Sneha Patel",   avatar: av("Sneha Patel",   "10b981"), role: "Full Stack Developer", email: "sneha@commdesk.io"  },
  { id: "mem-005", name: "Kiran Joshi",   avatar: av("Kiran Joshi",   "3b82f6"), role: "DevOps Engineer",      email: "kiran@commdesk.io"  },
  { id: "mem-006", name: "Ananya Reddy",  avatar: av("Ananya Reddy",  "8b5cf6"), role: "Data Scientist",       email: "ananya@commdesk.io" },
];

// ─── Mock Tasks ───────────────────────────────────────────────────────────────
export const mockTasks: Task[] = [
  {
    id: "task-001", eventId: "evt-001",
    title: "Build Landing Page for AI Showcase",
    description: "Create a responsive landing page that showcases the AI hackathon projects. Include hero section, project gallery, and registration CTA.",
    status: "in-progress", priority: "high", deadline: "2026-06-10T23:59:00",
    assignedTo: [mockMembers[0], mockMembers[1]],
    submissionType: "github", submissionStatus: "submitted",
    isMandatory: true, points: 100, allowLateSubmission: false,
    technologies: [
      { id: "react", label: "React", color: "bg-sky-100 text-sky-700" },
      { id: "typescript", label: "TypeScript", color: "bg-blue-100 text-blue-700" },
      { id: "tailwind", label: "Tailwind", color: "bg-teal-100 text-teal-700" },
    ],
    createdAt: "2026-05-01T10:00:00", updatedAt: "2026-05-07T14:30:00", createdBy: "Organizer",
  },
  {
    id: "task-002", eventId: "evt-001",
    title: "Design Brand Identity Kit",
    description: "Create complete brand guidelines including logo variations, color palette, typography, and usage examples for the hackathon.",
    status: "todo", priority: "medium", deadline: "2026-05-03T23:59:00",
    assignedTo: [mockMembers[1]],
    submissionType: "file", submissionStatus: "not-submitted",
    isMandatory: true, points: 80, allowLateSubmission: true,
    technologies: [
      { id: "figma", label: "Figma", color: "bg-violet-100 text-violet-700" },
    ],
    createdAt: "2026-05-02T09:00:00", updatedAt: "2026-05-02T09:00:00", createdBy: "Organizer",
  },
  {
    id: "task-003", eventId: "evt-001",
    title: "Set Up CI/CD Pipeline",
    description: "Configure GitHub Actions for automated testing and deployment. Include staging and production environments.",
    status: "completed", priority: "high", deadline: "2026-05-28T23:59:00",
    assignedTo: [mockMembers[2], mockMembers[4]],
    submissionType: "github", submissionStatus: "reviewed",
    isMandatory: true, points: 120, allowLateSubmission: false,
    technologies: [
      { id: "docker", label: "Docker", color: "bg-blue-100 text-blue-800" },
      { id: "github", label: "GitHub", color: "bg-gray-200 text-gray-800" },
      { id: "nodejs", label: "Node.js", color: "bg-green-100 text-green-700" },
    ],
    createdAt: "2026-04-28T11:00:00", updatedAt: "2026-05-27T16:00:00", createdBy: "Organizer",
  },
  {
    id: "task-004", eventId: "evt-001",
    title: "Participant Data Analytics Dashboard",
    description: "Build a real-time analytics dashboard showing participant statistics, submission rates, and leaderboard.",
    status: "todo", priority: "low", deadline: "2026-06-14T23:59:00",
    assignedTo: [mockMembers[3], mockMembers[5]],
    submissionType: "both", submissionStatus: "not-submitted",
    isMandatory: false, points: 150, allowLateSubmission: true,
    technologies: [
      { id: "python", label: "Python", color: "bg-yellow-100 text-yellow-700" },
      { id: "postgres", label: "PostgreSQL", color: "bg-indigo-100 text-indigo-700" },
    ],
    createdAt: "2026-05-05T13:00:00", updatedAt: "2026-05-05T13:00:00", createdBy: "Organizer",
  },
  {
    id: "task-005", eventId: "evt-001",
    title: "Write Technical Documentation",
    description: "Document the API endpoints, system architecture, and developer setup guide for the hackathon platform.",
    status: "in-progress", priority: "medium", deadline: "2026-05-05T23:59:00",
    assignedTo: [mockMembers[0], mockMembers[2]],
    submissionType: "file", submissionStatus: "not-submitted",
    isMandatory: false, allowLateSubmission: true,
    technologies: [],
    createdAt: "2026-05-03T12:00:00", updatedAt: "2026-05-06T10:00:00", createdBy: "Organizer",
  },
  {
    id: "task-006", eventId: "evt-002",
    title: "Smart Contract Development",
    description: "Build and deploy ERC-20 token contracts on test network.",
    status: "todo", priority: "high", deadline: "2026-06-28T23:59:00",
    assignedTo: [mockMembers[2]],
    submissionType: "github", submissionStatus: "not-submitted",
    isMandatory: true, points: 200, allowLateSubmission: false,
    technologies: [{ id: "solidity", label: "Solidity", color: "bg-purple-100 text-purple-700" }],
    createdAt: "2026-05-10T09:00:00", updatedAt: "2026-05-10T09:00:00", createdBy: "Organizer",
  },
  {
    id: "task-007", eventId: "evt-002",
    title: "DApp Frontend Integration",
    description: "Connect React frontend with Metamask and smart contracts.",
    status: "todo", priority: "high", deadline: "2026-06-30T23:59:00",
    assignedTo: [mockMembers[0], mockMembers[3]],
    submissionType: "both", submissionStatus: "not-submitted",
    isMandatory: true, allowLateSubmission: false,
    technologies: [
      { id: "react", label: "React", color: "bg-sky-100 text-sky-700" },
      { id: "solidity", label: "Solidity", color: "bg-purple-100 text-purple-700" },
    ],
    createdAt: "2026-05-10T10:00:00", updatedAt: "2026-05-10T10:00:00", createdBy: "Organizer",
  },
  {
    id: "task-008", eventId: "evt-003",
    title: "Open Source Contribution Report",
    description: "Submit PRs to at least 3 open source repositories.",
    status: "completed", priority: "medium", deadline: "2026-05-11T23:59:00",
    assignedTo: [mockMembers[1], mockMembers[4]],
    submissionType: "github", submissionStatus: "reviewed",
    isMandatory: true, points: 100, allowLateSubmission: false,
    technologies: [{ id: "github", label: "GitHub", color: "bg-gray-200 text-gray-800" }],
    createdAt: "2026-04-30T08:00:00", updatedAt: "2026-05-12T14:00:00", createdBy: "Organizer",
  },
];

// ─── Mock Submissions ─────────────────────────────────────────────────────────
export const mockSubmissions: Submission[] = [
  {
    id: "sub-001", taskId: "task-001", submittedBy: mockMembers[0],
    githubUrl: "https://github.com/arjun/ai-landing-page",
    notes: "Completed responsive design with animations. Mobile tested.",
    submittedAt: "2026-06-08T15:30:00",
    review: { decision: "approved", score: 92, feedback: "Excellent work! Clean code and great animations.", reviewedBy: "Organizer", reviewedAt: "2026-06-09T10:00:00" },
  },
  {
    id: "sub-002", taskId: "task-001", submittedBy: mockMembers[1],
    githubUrl: "https://github.com/priya/ai-landing-page-designs",
    notes: "Added Figma components and updated CSS variables.",
    submittedAt: "2026-06-09T11:00:00",
  },
  {
    id: "sub-003", taskId: "task-003", submittedBy: mockMembers[2],
    githubUrl: "https://github.com/rohit/hackathon-cicd",
    notes: "Set up GitHub Actions with matrix testing on Node 18 & 20.",
    submittedAt: "2026-05-27T14:00:00",
    review: { decision: "approved", score: 98, feedback: "Perfect pipeline setup.", reviewedBy: "Organizer", reviewedAt: "2026-05-28T09:00:00" },
  },
];

// ─── Mock Activity ────────────────────────────────────────────────────────────
export const mockActivity: Record<string, ActivityEvent[]> = {
  "task-001": [
    { id: "act-001", type: "created",   actor: "Organizer",   description: "Task created and assigned to Arjun & Priya",      timestamp: "2026-05-01T10:00:00" },
    { id: "act-002", type: "updated",   actor: "Arjun Mehta", description: "Status changed from Todo → In Progress",          timestamp: "2026-05-15T09:30:00" },
    { id: "act-003", type: "submitted", actor: "Arjun Mehta", description: "Submitted GitHub repository link",                timestamp: "2026-06-08T15:30:00" },
    { id: "act-004", type: "reviewed",  actor: "Organizer",   description: "Submission approved · Score: 92/100",             timestamp: "2026-06-09T10:00:00" },
    { id: "act-005", type: "submitted", actor: "Priya Sharma", description: "Submitted design assets",                       timestamp: "2026-06-09T11:00:00" },
  ],
  "task-003": [
    { id: "act-006", type: "created",   actor: "Organizer",   description: "Task created and assigned to Rohit & Kiran",     timestamp: "2026-04-28T11:00:00" },
    { id: "act-007", type: "submitted", actor: "Rohit Verma", description: "Submitted CI/CD pipeline implementation",        timestamp: "2026-05-27T14:00:00" },
    { id: "act-008", type: "reviewed",  actor: "Organizer",   description: "Submission approved · Score: 98/100",            timestamp: "2026-05-28T09:00:00" },
  ],
};

// ─── Mock Comments ────────────────────────────────────────────────────────────
export const mockComments: Record<string, TaskComment[]> = {
  "task-001": [
    {
      id: "cmt-001", taskId: "task-001",
      author: "Organizer",
      avatar: av("Organizer", "6366f1"),
      text: "Please make sure the hero section is mobile-first.",
      createdAt: "2026-05-02T10:00:00",
    },
    {
      id: "cmt-002", taskId: "task-001",
      author: "Arjun Mehta",
      avatar: av("Arjun Mehta", "6366f1"),
      text: "Got it! I'll start with the mobile layout and scale up.",
      createdAt: "2026-05-02T11:30:00",
    },
  ],
  "task-003": [
    {
      id: "cmt-003", taskId: "task-003",
      author: "Organizer",
      avatar: av("Organizer", "6366f1"),
      text: "Make sure the pipeline covers both staging and production environments.",
      createdAt: "2026-04-29T09:00:00",
    },
  ],
};