export type ProjectStatus = "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface Score {
  id: string;
  projectId: string;
  judgeId: string;
  judgeName: string;
  innovation: number;
  technical: number;
  design: number;
  impact: number;
  totalScore: number;
  feedback: string;
  submittedAt: string;
}

export interface TimelineEvent {
  id: string;
  type: "created" | "edited" | "submitted" | "scored" | "approved" | "rejected";
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "document" | "image" | "link";
}

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  eventName: string;
  eventType: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  teamName: string;
  isSolo: boolean;
  members: TeamMember[];
  submittedAt?: string;
  lastUpdatedAt: string;
  version: number;
  attachments: Attachment[];
  scores: Score[];
  timeline: TimelineEvent[];
  participantId: string; // The owner ID
}
