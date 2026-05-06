import { AlertTriangle, RefreshCcw, ShieldAlert } from "lucide-react";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { matchPath, useLocation, useParams, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  deleteProject,
  fetchProject,
  getMockViewer,
  getScoreSummary,
  moderateProject,
  ProjectApiError,
  submitJudgeScore,
  submitProject,
  updateProjectDraft,
} from "@/features/Projects/services/project.service";
import { getProjectPermissions } from "@/features/Projects/utils/permissions";
import type {
  JudgeScoreInput,
  ProjectRecord,
  ProjectUpdateInput,
  ViewerContext,
} from "@/features/Projects/types/project.types";
import Header from "@/features/Projects/components/Header";
import ModerationPanel from "@/features/Projects/components/ModerationPanel";
import Overview from "@/features/Projects/components/Overview";
import ScorePanel from "@/features/Projects/components/ScorePanel";
import Submission from "@/features/Projects/components/Submission";
import Team from "@/features/Projects/components/Team";
import Timeline from "@/features/Projects/components/Timeline";
import { Button } from "@/shadcnComponet/ui/button";

type PageState = "loading" | "ready" | "error" | "not-found" | "unauthorized" | "deleted";

type PendingAction = "save" | "submit" | "score" | "approve" | "reject" | "delete" | null;

function StatePanel({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon: typeof AlertTriangle;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100">
          <Icon className="size-6 text-slate-700" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.18),transparent_25%),#f8fafc] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="h-52 animate-pulse rounded-[28px] bg-white/80" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <div className="h-72 animate-pulse rounded-[24px] bg-white/80" />
            <div className="h-64 animate-pulse rounded-[24px] bg-white/80" />
            <div className="h-80 animate-pulse rounded-[24px] bg-white/80" />
          </div>
          <div className="space-y-6">
            <div className="h-72 animate-pulse rounded-[24px] bg-white/80" />
            <div className="h-96 animate-pulse rounded-[24px] bg-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [viewer, setViewer] = useState<ViewerContext | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [editingOverview, setEditingOverview] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const loadSequenceRef = useRef(0);

  const searchParamString = searchParams.toString();
  const resolvedProjectId = useMemo(() => {
    const routeMatch = matchPath("/projects/:projectId", location.pathname);
    return (projectId ?? routeMatch?.params.projectId ?? "").trim();
  }, [location.pathname, projectId]);

  const loadProject = useCallback(async () => {
    const requestId = ++loadSequenceRef.current;

    if (!resolvedProjectId) {
      console.error("[Projects] Missing project route parameter.", {
        pathname: location.pathname,
        params: { projectId },
      });
      setPageState("not-found");
      return;
    }

    setPageState("loading");
    setErrorMessage(null);
    setFlashMessage(null);

    try {
      const [projectResponse, viewerResponse] = await Promise.all([
        fetchProject(resolvedProjectId),
        getMockViewer(new URLSearchParams(searchParamString)),
      ]);

      if (requestId !== loadSequenceRef.current) {
        return;
      }

      const nextPermissions = getProjectPermissions(projectResponse, viewerResponse);

      startTransition(() => {
        setProject(projectResponse);
        setViewer(viewerResponse);
        setValidationErrors([]);
        setEditingOverview(false);
        setPageState(nextPermissions.canView ? "ready" : "unauthorized");
        setErrorMessage(nextPermissions.denialReason ?? null);
      });
    } catch (error) {
      if (requestId !== loadSequenceRef.current) {
        return;
      }

      if (error instanceof ProjectApiError) {
        if (error.code === "DELETED") {
          setPageState("deleted");
          return;
        }

        if (error.code === "NOT_FOUND") {
          setPageState("not-found");
          return;
        }
      }

      console.error("[Projects] Unexpected project load failure.", {
        projectId: resolvedProjectId,
        roleQuery: searchParamString,
        error,
      });
      setPageState("error");
      setErrorMessage("We could not load the project right now.");
    }
  }, [location.pathname, projectId, resolvedProjectId, searchParamString]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  const permissions = useMemo(() => {
    if (!project || !viewer) return null;
    return getProjectPermissions(project, viewer);
  }, [project, viewer]);

  const scoreSummary = useMemo(() => (project ? getScoreSummary(project) : null), [project]);

  async function runAction(
    action: Exclude<PendingAction, null>,
    operation: () => Promise<ProjectRecord>,
    options?: { successMessage?: string; deletedState?: boolean; preserveEditing?: boolean },
  ) {
    setPendingAction(action);
    setErrorMessage(null);
    setValidationErrors([]);

    try {
      const result = await operation();

      if (options?.deletedState) {
        setProject(null);
        setPageState("deleted");
      } else {
        setProject(result);
        setPageState("ready");
      }

      if (!options?.preserveEditing) {
        setEditingOverview(false);
      }

      setFlashMessage(options?.successMessage ?? null);
    } catch (error) {
      if (error instanceof ProjectApiError) {
        if (error.code === "DELETED") {
          setPageState("deleted");
          return;
        }

        if (error.code === "NOT_FOUND") {
          setPageState("not-found");
          return;
        }

        setErrorMessage(error.message);
        setValidationErrors(error.details ?? []);
        if (action === "save") {
          setEditingOverview(true);
        }
        return;
      }

      setErrorMessage("Something went wrong while updating the project.");
    } finally {
      setPendingAction(null);
    }
  }

  if (pageState === "loading") {
    return <LoadingSkeleton />;
  }

  if (pageState === "not-found") {
    return (
      <StatePanel
        title="Project not found"
        description="The project may have been removed, or the link is no longer valid."
        icon={AlertTriangle}
        action={
          <Button variant="outline" onClick={() => void loadProject()}>
            <RefreshCcw className="size-4" />
            Retry
          </Button>
        }
      />
    );
  }

  if (pageState === "deleted") {
    return (
      <StatePanel
        title="Project deleted"
        description="This project was removed while you were viewing it, so lifecycle actions are no longer available."
        icon={ShieldAlert}
      />
    );
  }

  if (pageState === "error") {
    return (
      <StatePanel
        title="Unable to load project"
        description={errorMessage ?? "A temporary issue blocked the project detail page."}
        icon={AlertTriangle}
        action={
          <Button variant="outline" onClick={() => void loadProject()}>
            <RefreshCcw className="size-4" />
            Retry
          </Button>
        }
      />
    );
  }

  if (pageState === "unauthorized") {
    return (
      <StatePanel
        title="Access denied"
        description={
          errorMessage ?? "Your current role does not have permission to view this project."
        }
        icon={ShieldAlert}
      />
    );
  }

  if (!project || !viewer || !permissions || !scoreSummary) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.18),transparent_25%),#f8fafc] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Header
          project={project}
          viewer={viewer}
          permissions={permissions}
          isWorking={pendingAction !== null}
          onEdit={() => {
            setValidationErrors([]);
            setEditingOverview(true);
          }}
          onDelete={() =>
            void runAction("delete", () => deleteProject(project.id, viewer), {
              deletedState: true,
              successMessage: "Project deleted successfully.",
            })
          }
          onSubmit={() =>
            void runAction("submit", () => submitProject(project.id, viewer), {
              successMessage: "Project submitted successfully. Editing is now locked.",
            })
          }
          onApprove={() =>
            void runAction("approve", () => moderateProject(project.id, viewer, "approve"), {
              successMessage: "Project approved.",
            })
          }
          onReject={() =>
            void runAction("reject", () => moderateProject(project.id, viewer, "reject"), {
              successMessage: "Project rejected.",
            })
          }
        />

        {(flashMessage || errorMessage) && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm shadow-sm",
              errorMessage
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700",
            )}
          >
            {errorMessage ?? flashMessage}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <Overview
              key={`${project.id}-${project.updatedAt}-${editingOverview ? "editing" : "view"}`}
              project={project}
              canEdit={permissions.canEdit}
              isEditing={editingOverview}
              isSaving={pendingAction === "save"}
              validationErrors={validationErrors}
              onEditingChange={setEditingOverview}
              onSave={(values: ProjectUpdateInput) =>
                runAction("save", () => updateProjectDraft(project.id, viewer, values), {
                  successMessage: "Draft updated.",
                })
              }
            />
            <Submission project={project} scoreSummary={scoreSummary} />
            <Timeline events={project.timeline} />
          </div>

          <div className="space-y-6">
            <Team project={project} />

            {viewer.role === "judge" && (
              <ScorePanel
                key={`${project.id}-${viewer.userId}-${project.updatedAt}`}
                project={project}
                viewer={viewer}
                permissions={permissions}
                isSubmitting={pendingAction === "score"}
                onSubmit={async (values: JudgeScoreInput) => {
                  if (!permissions.canScore) {
                    setErrorMessage(
                      "Scoring is only allowed when the project is submitted for review.",
                    );
                    setValidationErrors([]);
                    return;
                  }

                  await runAction("score", () => submitJudgeScore(project.id, viewer, values), {
                    successMessage: "Judge score submitted.",
                  });
                }}
              />
            )}

            {(viewer.role === "organizer" || viewer.role === "admin") &&
              permissions.canModerate && (
                <ModerationPanel
                  project={project}
                  scoreSummary={scoreSummary}
                  isWorking={
                    pendingAction === "approve" ||
                    pendingAction === "reject" ||
                    pendingAction === "delete"
                  }
                  onApprove={() =>
                    void runAction(
                      "approve",
                      () => moderateProject(project.id, viewer, "approve"),
                      {
                        successMessage: "Project approved.",
                      },
                    )
                  }
                  onReject={() =>
                    void runAction("reject", () => moderateProject(project.id, viewer, "reject"), {
                      successMessage: "Project rejected.",
                    })
                  }
                  onDelete={() =>
                    void runAction("delete", () => deleteProject(project.id, viewer), {
                      deletedState: true,
                      successMessage: "Project deleted successfully.",
                    })
                  }
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
