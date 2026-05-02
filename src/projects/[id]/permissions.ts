import { isAfter, parseISO } from "date-fns";

import type { ProjectPermissions, ProjectRecord, ViewerContext } from "./types";

function isProjectInReviewLifecycle(project: ProjectRecord) {
  return project.status === "submitted" || project.status === "under_review";
}

export function getProjectPermissions(
  project: ProjectRecord,
  viewer: ViewerContext,
  now = new Date(),
): ProjectPermissions {
  if (project.deletedAt) {
    return {
      canView: false,
      canEdit: false,
      canDeleteDraft: false,
      canSubmit: false,
      canScore: false,
      canEditScore: false,
      canModerate: false,
      canDeleteAny: false,
      denialReason: "This project has been deleted.",
    };
  }

  const isOwner = project.ownerId === viewer.userId;
  const isAssignedJudge =
    viewer.role === "judge" &&
    project.assignedJudgeIds.includes(viewer.userId) &&
    viewer.assignedProjectIds.includes(project.id);
  const isCommunityOrganizer =
    viewer.role === "organizer" && viewer.communityIds.includes(project.communityId);
  const isAdmin = viewer.role === "admin";

  const canView =
    isOwner || isAssignedJudge || isCommunityOrganizer || isAdmin;

  if (!canView) {
    const denialReason =
      viewer.role === "judge"
        ? "You are not assigned to evaluate this project."
        : "You do not have access to this project.";

    return {
      canView: false,
      canEdit: false,
      canDeleteDraft: false,
      canSubmit: false,
      canScore: false,
      canEditScore: false,
      canModerate: false,
      canDeleteAny: false,
      denialReason,
    };
  }

  const deadlinePassed = isAfter(now, parseISO(project.judgingDeadline));
  const existingScore = project.judgeScores.find((entry) => entry.judgeId === viewer.userId);
  const reviewLifecycleActive = isProjectInReviewLifecycle(project);

  return {
    canView: true,
    canEdit: isOwner && project.status === "draft",
    canDeleteDraft: isOwner && project.status === "draft",
    canSubmit: isOwner && project.status === "draft",
    canScore: isAssignedJudge && reviewLifecycleActive && !deadlinePassed,
    canEditScore: Boolean(isAssignedJudge && existingScore && reviewLifecycleActive && !deadlinePassed),
    canModerate: (isCommunityOrganizer || isAdmin) && reviewLifecycleActive,
    canDeleteAny: isCommunityOrganizer || isAdmin,
  };
}
