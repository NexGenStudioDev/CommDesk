import { AlertTriangle, RefreshCcw, ShieldAlert, Rocket, Search, Ghost } from "lucide-react";
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
import { Project_Permissions } from "@/features/Projects/constants/permission.constants";
import { hasPermission } from "@/features/Projects/utils/permission.utils";
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
  variant = "default"
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon: typeof AlertTriangle;
  variant?: "default" | "error" | "warning" | "premium";
}) {
  const themes = {
    default: "bg-slate-50 border-slate-200 text-slate-900",
    error: "bg-rose-50 border-rose-200 text-rose-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    premium: "bg-indigo-50 border-indigo-200 text-indigo-900",
  };

  const iconColors = {
    default: "text-slate-600 bg-white shadow-sm",
    error: "text-rose-600 bg-white shadow-sm shadow-rose-100",
    warning: "text-amber-600 bg-white shadow-sm shadow-amber-100",
    premium: "text-indigo-600 bg-white shadow-sm shadow-indigo-100",
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className={cn(
        "w-full max-w-lg rounded-[40px] border-2 p-10 text-center shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.02]",
        themes[variant]
      )}>
        <div className={cn("mx-auto flex size-20 items-center justify-center rounded-[24px]", iconColors[variant])}>
          <Icon className="size-10" />
        </div>
        <h1 className="mt-8 text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-4 text-sm font-bold leading-relaxed opacity-60 uppercase tracking-widest">{description}</p>
        {action ? <div className="mt-10 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <div className="h-64 animate-pulse rounded-[40px] bg-white shadow-sm" />
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.95fr)]">
          <div className="space-y-10">
            <div className="h-[500px] animate-pulse rounded-[40px] bg-white shadow-sm" />
            <div className="h-96 animate-pulse rounded-[40px] bg-white shadow-sm" />
          </div>
          <div className="space-y-10">
            <div className="h-72 animate-pulse rounded-[40px] bg-white shadow-sm" />
            <div className="h-[600px] animate-pulse rounded-[40px] bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
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
    const routeMatch = matchPath("/org/projects/:id", location.pathname);
    return (id ?? routeMatch?.params.id ?? "").trim();
  }, [location.pathname, id]);

  const loadProject = useCallback(async () => {
    const requestId = ++loadSequenceRef.current;

    if (!resolvedProjectId) {
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

      if (requestId !== loadSequenceRef.current) return;

      const canView = hasPermission(viewerResponse.permissions, Project_Permissions.VIEW_PROJECT);

      startTransition(() => {
        setProject(projectResponse);
        setViewer(viewerResponse);
        setValidationErrors([]);
        setEditingOverview(false);
        setPageState(canView ? "ready" : "unauthorized");
      });
    } catch (error) {
      if (requestId !== loadSequenceRef.current) return;

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
      setPageState("error");
      setErrorMessage("System synchronization failed. Please try again.");
    }
  }, [resolvedProjectId, searchParamString]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

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
      
      // Auto-clear flash message
      setTimeout(() => setFlashMessage(null), 5000);
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
        if (action === "save") setEditingOverview(true);
        return;
      }
      setErrorMessage("A technical error occurred while processing your request.");
    } finally {
      setPendingAction(null);
    }
  }

  if (pageState === "loading") return <LoadingSkeleton />;

  if (pageState === "not-found") {
    return (
      <StatePanel
        title="Project Vanished"
        description="The project you are looking for has been moved or purged from our systems."
        icon={Search}
        action={
          <Button 
            className="h-14 rounded-2xl bg-slate-950 px-10 font-black shadow-xl transition-all hover:scale-[1.05]" 
            onClick={() => void loadProject()}
          >
            <RefreshCcw className="mr-2 size-5" />
            Force Sync
          </Button>
        }
      />
    );
  }

  if (pageState === "deleted") {
    return (
      <StatePanel
        title="Project Terminated"
        description="This project record was deleted during your session and is no longer accessible."
        icon={Ghost}
        variant="error"
      />
    );
  }

  if (pageState === "error") {
    return (
      <StatePanel
        title="Connection Failure"
        description={errorMessage ?? "Our servers are having trouble retrieving this project's heartbeat."}
        icon={AlertTriangle}
        variant="warning"
        action={
          <Button 
            className="h-14 rounded-2xl bg-amber-600 px-10 font-black shadow-xl transition-all hover:scale-[1.05]" 
            onClick={() => void loadProject()}
          >
            <RefreshCcw className="mr-2 size-5" />
            Reconnect
          </Button>
        }
      />
    );
  }

  if (pageState === "unauthorized") {
    return (
      <StatePanel
        title="Restricted Access"
        description="Your security clearance level is insufficient to view this project record."
        icon={ShieldAlert}
        variant="error"
      />
    );
  }

  if (!project || !viewer || !scoreSummary) return null;

  const canScore = hasPermission(viewer.permissions, Project_Permissions.SCORE_PROJECT);
  const canModerate = hasPermission(viewer.permissions, Project_Permissions.APPROVE_PROJECT);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <Header
          project={project}
          viewer={viewer}
          isWorking={pendingAction !== null}
          onEdit={() => {
            setValidationErrors([]);
            setEditingOverview(true);
          }}
          onDelete={() =>
            void runAction("delete", () => deleteProject(project.id, viewer), {
              deletedState: true,
              successMessage: "Project record has been permanently removed.",
            })
          }
          onSubmit={() =>
            void runAction("submit", () => submitProject(project.id, viewer), {
              successMessage: "Project successfully promoted to final status.",
            })
          }
          onApprove={() =>
            void runAction("approve", () => moderateProject(project.id, viewer, "approve"), {
              successMessage: "Project status updated to Approved.",
            })
          }
          onReject={() =>
            void runAction("reject", () => moderateProject(project.id, viewer, "reject"), {
              successMessage: "Project status updated to Rejected.",
            })
          }
        />

        {(flashMessage || errorMessage) && (
          <div
            className={cn(
              "flex items-center gap-4 rounded-[24px] border-2 px-6 py-4 text-sm font-black uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-4 duration-500",
              errorMessage
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700",
            )}
          >
            <div className={cn("flex size-8 items-center justify-center rounded-xl", errorMessage ? "bg-rose-600" : "bg-emerald-600")}>
              {errorMessage ? <ShieldAlert className="size-4 text-white" /> : <Rocket className="size-4 text-white" />}
            </div>
            {errorMessage ?? flashMessage}
          </div>
        )}

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.95fr)]">
          <div className="space-y-10">
            <Overview
              key={`${project.id}-${project.updatedAt}-${editingOverview ? "editing" : "view"}`}
              project={project}
              canEdit={hasPermission(viewer.permissions, Project_Permissions.UPDATE_PROJECT) && project.status === "draft"}
              isEditing={editingOverview}
              isSaving={pendingAction === "save"}
              validationErrors={validationErrors}
              onEditingChange={setEditingOverview}
              onSave={(values: ProjectUpdateInput) =>
                runAction("save", () => updateProjectDraft(project.id, viewer, values), {
                  successMessage: "Draft record synchronized.",
                })
              }
            />
            <Submission project={project} scoreSummary={scoreSummary} />
            <Timeline events={project.timeline} />
          </div>

          <div className="space-y-10">
            <Team project={project} />

            {canScore && (
              <ScorePanel
                key={`${project.id}-${viewer.userId}-${project.updatedAt}`}
                project={project}
                viewer={viewer}
                isSubmitting={pendingAction === "score"}
                onSubmit={async (values: JudgeScoreInput) => {
                  await runAction("score", () => submitJudgeScore(project.id, viewer, values), {
                    successMessage: "Evaluation record submitted.",
                  });
                }}
              />
            )}

            {canModerate && (
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
                      successMessage: "Project status: Approved.",
                    },
                  )
                }
                onReject={() =>
                  void runAction("reject", () => moderateProject(project.id, viewer, "reject"), {
                    successMessage: "Project status: Rejected.",
                  })
                }
                onDelete={() =>
                  void runAction("delete", () => deleteProject(project.id, viewer), {
                    deletedState: true,
                    successMessage: "Project record purged.",
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
