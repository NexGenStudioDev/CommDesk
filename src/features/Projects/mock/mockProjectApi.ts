import { addMinutes } from "date-fns";

import type {
  JudgeScoreInput,
  ProjectRecord,
  ProjectUpdateInput,
  ScoreSummary,
  TimelineEvent,
  UserRole,
  ViewerContext,
} from "@/features/Projects/types/project.types";

const NETWORK_DELAY_MS = 450;

export class ProjectApiError extends Error {
  code: "NOT_FOUND" | "UNAUTHORIZED" | "CONFLICT" | "VALIDATION" | "DELETED";
  details?: string[];

  constructor(
    code: ProjectApiError["code"],
    message: string,
    details?: string[],
  ) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

const viewerDirectory: Record<string, ViewerContext> = {
  "participant-owner": {
    userId: "participant-owner",
    name: "Aarav Sharma",
    role: "participant",
    assignedProjectIds: [],
    ownedProjectIds: ["project-nebula"],
    communityIds: ["community-01"],
  },
  "participant-guest": {
    userId: "participant-guest",
    name: "Nina Kapoor",
    role: "participant",
    assignedProjectIds: [],
    ownedProjectIds: [],
    communityIds: ["community-02"],
  },
  "judge-01": {
    userId: "judge-01",
    name: "Sana Malik",
    role: "judge",
    assignedProjectIds: ["project-nebula", "project-orbit"],
    ownedProjectIds: [],
    communityIds: [],
  },
  "judge-02": {
    userId: "judge-02",
    name: "Noah Bennett",
    role: "judge",
    assignedProjectIds: ["project-orbit"],
    ownedProjectIds: [],
    communityIds: [],
  },
  "organizer-01": {
    userId: "organizer-01",
    name: "Maya Torres",
    role: "organizer",
    assignedProjectIds: [],
    ownedProjectIds: [],
    communityIds: ["community-01"],
  },
  "admin-01": {
    userId: "admin-01",
    name: "Jordan Lee",
    role: "admin",
    assignedProjectIds: [],
    ownedProjectIds: [],
    communityIds: [],
  },
};

const defaultViewerByRole: Record<UserRole, string> = {
  participant: "participant-owner",
  judge: "judge-01",
  organizer: "organizer-01",
  admin: "admin-01",
};

function isProjectInReviewLifecycle(project: ProjectRecord) {
  return project.status === "submitted" || project.status === "under_review";
}

function buildEvent(
  type: TimelineEvent["type"],
  actorName: string,
  actorRole: UserRole,
  message: string,
): TimelineEvent {
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 10)}`,
    type,
    actorName,
    actorRole,
    message,
    timestamp: new Date().toISOString(),
  };
}

const projectStore = new Map<string, ProjectRecord>([
  [
    "project-nebula",
    {
      id: "project-nebula",
      title: "Nebula Forge",
      description:
        "A collaborative hackathon workspace that turns event briefs into scoped tasks, live mentor loops, and ship-ready deliverables for student teams.",
      eventName: "BuildSphere Hackathon 2026",
      eventType: "AI + Productivity",
      status: "draft",
      teamName: "Nebula Crew",
      members: [
        { id: "participant-owner", name: "Aarav Sharma", role: "Frontend Engineer", avatarLabel: "AS" },
        { id: "member-02", name: "Riya Mehta", role: "ML Engineer", avatarLabel: "RM" },
        { id: "member-03", name: "Dev Khanna", role: "Product Designer", avatarLabel: "DK" },
      ],
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "OpenAI API"],
      repositoryUrl: "https://github.com/commdesk/nebula-forge",
      demoUrl: "https://nebula-forge.demo.app",
      communityId: "community-01",
      ownerId: "participant-owner",
      version: "draft",
      createdAt: "2026-04-20T08:00:00.000Z",
      updatedAt: "2026-04-24T16:30:00.000Z",
      judgingDeadline: addMinutes(new Date(), 180).toISOString(),
      assignedJudgeIds: ["judge-01"],
      judgeScores: [],
      ranking: undefined,
      timeline: [
        {
          id: "created-nebula",
          type: "created",
          actorName: "Aarav Sharma",
          actorRole: "participant",
          timestamp: "2026-04-20T08:00:00.000Z",
          message: "Project created from the participant workspace.",
        },
        {
          id: "edited-nebula",
          type: "edited",
          actorName: "Aarav Sharma",
          actorRole: "participant",
          timestamp: "2026-04-24T16:30:00.000Z",
          message: "Updated description, demo URL, and tech stack before submission.",
        },
      ],
    },
  ],
  [
    "project-orbit",
    {
      id: "project-orbit",
      title: "Orbit Relay",
      description:
        "An event operations platform that automates mentorship routing, sponsor booth lead capture, and post-demo follow-up for hackathon communities.",
      eventName: "BuildSphere Hackathon 2026",
      eventType: "Community Ops",
      status: "under_review",
      teamName: "Orbit Labs",
      members: [
        { id: "member-11", name: "Anika Das", role: "Founder", avatarLabel: "AD" },
        { id: "member-12", name: "Samir Joshi", role: "Backend Engineer", avatarLabel: "SJ" },
      ],
      techStack: ["React", "Go", "gRPC", "Redis", "Docker"],
      repositoryUrl: "https://github.com/commdesk/orbit-relay",
      demoUrl: "https://orbit-relay.demo.app",
      communityId: "community-01",
      ownerId: "member-11",
      version: "final",
      createdAt: "2026-04-18T07:10:00.000Z",
      updatedAt: "2026-04-24T10:45:00.000Z",
      submittedAt: "2026-04-24T10:45:00.000Z",
      judgingDeadline: addMinutes(new Date(), 90).toISOString(),
      assignedJudgeIds: ["judge-01", "judge-02"],
      judgeScores: [
        {
          judgeId: "judge-01",
          judgeName: "Sana Malik",
          innovation: 8,
          technicalComplexity: 9,
          designUx: 7,
          impact: 8,
          feedback: "Strong event ops framing with clear system thinking.",
          submittedAt: "2026-04-24T12:15:00.000Z",
        },
      ],
      ranking: 3,
      timeline: [
        {
          id: "created-orbit",
          type: "created",
          actorName: "Anika Das",
          actorRole: "participant",
          timestamp: "2026-04-18T07:10:00.000Z",
          message: "Project created from the participant workspace.",
        },
        {
          id: "submitted-orbit",
          type: "submitted",
          actorName: "Anika Das",
          actorRole: "participant",
          timestamp: "2026-04-24T10:45:00.000Z",
          message: "Final submission sent for judging.",
        },
        {
          id: "scored-orbit",
          type: "scored",
          actorName: "Sana Malik",
          actorRole: "judge",
          timestamp: "2026-04-24T12:15:00.000Z",
          message: "Submitted judge evaluation and feedback.",
        },
      ],
    },
  ],
]);

function cloneProject(project: ProjectRecord): ProjectRecord {
  return structuredClone(project);
}

function validateProject(project: ProjectUpdateInput) {
  const issues: string[] = [];

  if (!project.title.trim()) issues.push("Project title is required.");
  if (project.description.trim().length < 40)
    issues.push("Description must be at least 40 characters.");
  if (project.techStack.length === 0) issues.push("Add at least one technology.");
  if (!project.repositoryUrl.trim()) issues.push("GitHub repository URL is required.");
  if (!project.demoUrl.trim()) issues.push("Live demo URL is required.");

  return issues;
}

function totalScore(input: JudgeScoreInput) {
  return input.innovation + input.technicalComplexity + input.designUx + input.impact;
}

function ensureProject(projectId: string) {
  const project = projectStore.get(projectId);

  if (!project) {
    throw new ProjectApiError("NOT_FOUND", "Project not found.");
  }

  if (project.deletedAt) {
    throw new ProjectApiError("DELETED", "This project has been deleted.");
  }

  return project;
}

function wait(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function fetchProject(projectId: string) {
  await wait();
  return cloneProject(ensureProject(projectId));
}

export async function getMockViewer(searchParams: URLSearchParams) {
  await wait(150);

  const requestedRole = searchParams.get("role") as UserRole | null;
  const requestedViewer = searchParams.get("viewer");

  if (requestedViewer && viewerDirectory[requestedViewer]) {
    return structuredClone(viewerDirectory[requestedViewer]);
  }

  if (requestedRole && defaultViewerByRole[requestedRole]) {
    return structuredClone(viewerDirectory[defaultViewerByRole[requestedRole]]);
  }

  return structuredClone(viewerDirectory[defaultViewerByRole.participant]);
}

export async function updateProjectDraft(
  projectId: string,
  actor: ViewerContext,
  payload: ProjectUpdateInput,
) {
  await wait();

  const project = ensureProject(projectId);

  if (project.ownerId !== actor.userId || project.status !== "draft") {
    throw new ProjectApiError(
      "UNAUTHORIZED",
      "Only the project owner can edit a draft project.",
    );
  }

  const issues = validateProject(payload);
  if (issues.length > 0) {
    throw new ProjectApiError("VALIDATION", "Please resolve the validation issues.", issues);
  }

  project.title = payload.title.trim();
  project.description = payload.description.trim();
  project.techStack = payload.techStack;
  project.repositoryUrl = payload.repositoryUrl.trim();
  project.demoUrl = payload.demoUrl.trim();
  project.updatedAt = new Date().toISOString();
  project.timeline.unshift(
    buildEvent("edited", actor.name, actor.role, "Saved draft changes to the project."),
  );

  return cloneProject(project);
}

export async function submitProject(projectId: string, actor: ViewerContext) {
  await wait();

  const project = ensureProject(projectId);

  if (project.ownerId !== actor.userId || project.status !== "draft") {
    throw new ProjectApiError(
      "UNAUTHORIZED",
      "Only the project owner can submit a draft project.",
    );
  }

  const issues = validateProject({
    title: project.title,
    description: project.description,
    techStack: project.techStack,
    repositoryUrl: project.repositoryUrl,
    demoUrl: project.demoUrl,
  });

  if (issues.length > 0) {
    throw new ProjectApiError("VALIDATION", "Project validation failed.", issues);
  }

  const now = new Date().toISOString();
  project.status = "submitted";
  project.version = "final";
  project.submittedAt = now;
  project.updatedAt = now;
  project.timeline.unshift(
    buildEvent("submitted", actor.name, actor.role, "Final project submission completed."),
  );

  return cloneProject(project);
}

export async function submitJudgeScore(
  projectId: string,
  actor: ViewerContext,
  payload: JudgeScoreInput,
) {
  await wait();

  const project = ensureProject(projectId);

  const isAssignedJudge =
    actor.role === "judge" &&
    project.assignedJudgeIds.includes(actor.userId) &&
    actor.assignedProjectIds.includes(projectId);

  if (!isAssignedJudge) {
    throw new ProjectApiError(
      "UNAUTHORIZED",
      "This judge is not assigned to the selected project.",
    );
  }

  if (!isProjectInReviewLifecycle(project)) {
    throw new ProjectApiError(
      "CONFLICT",
      "Scoring is only allowed after a project has been submitted for review.",
    );
  }

  if (new Date(project.judgingDeadline).getTime() < Date.now()) {
    throw new ProjectApiError(
      "CONFLICT",
      "Judging is closed. Scores can no longer be edited.",
    );
  }

  const values = [
    payload.innovation,
    payload.technicalComplexity,
    payload.designUx,
    payload.impact,
  ];
  const invalidValue = values.some((value) => value < 0 || value > 10 || Number.isNaN(value));

  if (invalidValue) {
    throw new ProjectApiError(
      "VALIDATION",
      "Each score must be between 0 and 10.",
    );
  }

  if (!payload.feedback.trim()) {
    throw new ProjectApiError("VALIDATION", "Feedback is required.");
  }

  const existingEntry = project.judgeScores.find((score) => score.judgeId === actor.userId);
  const now = new Date().toISOString();

  if (existingEntry) {
    existingEntry.innovation = payload.innovation;
    existingEntry.technicalComplexity = payload.technicalComplexity;
    existingEntry.designUx = payload.designUx;
    existingEntry.impact = payload.impact;
    existingEntry.feedback = payload.feedback.trim();
    existingEntry.updatedAt = now;
  } else {
    project.judgeScores.push({
      judgeId: actor.userId,
      judgeName: actor.name,
      submittedAt: now,
      ...payload,
      feedback: payload.feedback.trim(),
    });
  }

  if (project.status === "submitted") {
    project.status = "under_review";
  }

  project.updatedAt = now;
  project.timeline.unshift(
    buildEvent(
      "scored",
      actor.name,
      actor.role,
      `${existingEntry ? "Updated" : "Submitted"} evaluation with a total score of ${totalScore(payload)}/40.`,
    ),
  );

  return cloneProject(project);
}

export async function moderateProject(
  projectId: string,
  actor: ViewerContext,
  decision: "approve" | "reject",
) {
  await wait();

  const project = ensureProject(projectId);
  const canModerate =
    actor.role === "admin" ||
    (actor.role === "organizer" && actor.communityIds.includes(project.communityId));

  if (!canModerate) {
    throw new ProjectApiError("UNAUTHORIZED", "You cannot moderate this project.");
  }

  if (!isProjectInReviewLifecycle(project)) {
    throw new ProjectApiError(
      "CONFLICT",
      "Moderation is only allowed after a project has been submitted for review.",
    );
  }

  project.status = decision === "approve" ? "approved" : "rejected";
  project.updatedAt = new Date().toISOString();
  project.timeline.unshift(
    buildEvent(
      decision === "approve" ? "approved" : "rejected",
      actor.name,
      actor.role,
      decision === "approve"
        ? "Approved the project for the event showcase."
        : "Rejected the project during moderation review.",
    ),
  );

  return cloneProject(project);
}

export async function deleteProject(projectId: string, actor: ViewerContext) {
  await wait();

  const project = ensureProject(projectId);
  const isOwnerDraftDelete = actor.userId === project.ownerId && project.status === "draft";
  const isModeratorDelete =
    actor.role === "admin" ||
    (actor.role === "organizer" && actor.communityIds.includes(project.communityId));

  if (!isOwnerDraftDelete && !isModeratorDelete) {
    throw new ProjectApiError("UNAUTHORIZED", "You cannot delete this project.");
  }

  project.deletedAt = new Date().toISOString();
  project.updatedAt = project.deletedAt;
  project.timeline.unshift(
    buildEvent("deleted", actor.name, actor.role, "Deleted the project record."),
  );

  return cloneProject(project);
}

export function getScoreSummary(project: ProjectRecord): ScoreSummary {
  if (project.judgeScores.length === 0) {
    return {
      averageScore: null,
      judgeCount: 0,
      ranking: project.ranking,
    };
  }

  const totals = project.judgeScores.map((score) => totalScore(score));
  const averageScore =
    totals.reduce((sum, score) => sum + score, 0) / totals.length;

  return {
    averageScore,
    judgeCount: project.judgeScores.length,
    ranking: project.ranking,
  };
}
