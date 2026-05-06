import type { PermissionSchemaType } from "./permission.types";

export type ProjectStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected";

export type UserRole = "participant" | "judge" | "organizer" | "admin";

export type TimelineEventType =
  | "created"
  | "edited"
  | "submitted"
  | "scored"
  | "approved"
  | "rejected"
  | "deleted";

export type ProjectMember = {
  id: string;
  name: string;
  role: string;
  avatarLabel: string;
};

export type JudgeScoreInput = {
  innovation: number;
  technicalComplexity: number;
  designUx: number;
  impact: number;
  feedback: string;
};

export type JudgeScore = JudgeScoreInput & {
  judgeId: string;
  judgeName: string;
  submittedAt: string;
  updatedAt?: string;
};

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
  message: string;
};

export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  eventName: string;
  eventType: string;
  status: ProjectStatus;
  teamName?: string;
  members: ProjectMember[];
  techStack: string[];
  repositoryUrl: string;
  demoUrl: string;
  communityId: string;
  ownerId: string;
  version: "draft" | "final";
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  judgingDeadline: string;
  assignedJudgeIds: string[];
  judgeScores: JudgeScore[];
  ranking?: number;
  timeline: TimelineEvent[];
  deletedAt?: string;
};


export type ViewerContext = {
  userId: string;
  name: string;
  role: UserRole;
  assignedProjectIds: string[];
  ownedProjectIds: string[];
  communityIds: string[];
  permissions: PermissionSchemaType[];
};

export type ProjectPermissions = {
  canView: boolean;
  canEdit: boolean;
  canDeleteDraft: boolean;
  canSubmit: boolean;
  canScore: boolean;
  canEditScore: boolean;
  canModerate: boolean;
  canDeleteAny: boolean;
  denialReason?: string;
};

export type ProjectUpdateInput = {
  title: string;
  description: string;
  techStack: string[];
  repositoryUrl: string;
  demoUrl: string;
};

export type ScoreSummary = {
  averageScore: number | null;
  judgeCount: number;
  ranking?: number;
};
