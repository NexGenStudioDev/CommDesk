import { CalendarClock, PencilLine, Rocket, ShieldCheck, Trash2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Project_Permissions } from "@/features/Projects/constants/permission.constants";
import type { ProjectRecord, UserRole, ViewerContext } from "@/features/Projects/types/project.types";
import { hasPermission } from "@/features/Projects/utils/permission.utils";
import { Button } from "@/shadcnComponet/ui/button";

type HeaderProps = {
  project: ProjectRecord;
  viewer: ViewerContext;
  isWorking: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
};

const statusTheme: Record<ProjectRecord["status"], string> = {
  draft: "bg-slate-100/50 text-slate-700 ring-slate-200/50",
  submitted: "bg-amber-100/50 text-amber-800 ring-amber-200/50",
  under_review: "bg-sky-100/50 text-sky-800 ring-sky-200/50",
  approved: "bg-emerald-100/50 text-emerald-800 ring-emerald-200/50",
  rejected: "bg-rose-100/50 text-rose-800 ring-rose-200/50",
};

const roleLabel: Record<UserRole, string> = {
  participant: "Participant",
  judge: "Judge",
  organizer: "Organizer",
  admin: "Admin",
};

function getStatusLabel(status: ProjectRecord["status"]) {
  return status.replace("_", " ").replace(/\b\w/g, (value) => value.toUpperCase());
}

export default function Header({
  project,
  viewer,
  isWorking,
  onEdit,
  onDelete,
  onSubmit,
  onApprove,
  onReject,
}: HeaderProps) {
  const canSubmit =
    hasPermission(viewer.permissions, Project_Permissions.SUBMIT_PROJECT) &&
    project.status === "draft";
  const canEdit =
    hasPermission(viewer.permissions, Project_Permissions.UPDATE_PROJECT) &&
    project.status === "draft";
  const canDelete =
    hasPermission(viewer.permissions, Project_Permissions.DELETE_PROJECT) &&
    (project.status === "draft" ||
      viewer.role === "admin" ||
      viewer.role === "organizer");
  const canModerate =
    hasPermission(viewer.permissions, Project_Permissions.APPROVE_PROJECT) &&
    (project.status === "submitted" || project.status === "under_review");

  return (
    <header className="group relative overflow-hidden rounded-[32px] border border-white/40 bg-white/60 p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] xl:p-10">
      {/* Decorative Background Elements */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl transition-all duration-700 group-hover:bg-indigo-200/50" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-100/50 blur-3xl transition-all duration-700 group-hover:bg-purple-200/50" />

      <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ring-1 ring-inset backdrop-blur-md",
                statusTheme[project.status],
              )}
            >
              {getStatusLabel(project.status)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
              <ShieldCheck className="size-3.5" />
              {roleLabel[viewer.role]} Mode
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-500">
              <span className="h-px w-8 bg-slate-200" />
              <p className="text-xs font-bold uppercase tracking-[0.3em]">{project.eventType}</p>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <p className="flex items-center gap-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                <div className="flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 shadow-sm">
                  <CalendarClock className="size-4" />
                </div>
                {project.eventName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 xl:mb-2">
          {canSubmit && (
            <Button
              className="h-12 rounded-2xl bg-indigo-600 px-8 font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:shadow-indigo-500/40"
              disabled={isWorking}
              onClick={onSubmit}
            >
              <Rocket className="mr-2 size-4" />
              Submit Project
            </Button>
          )}

          {canEdit && (
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-2 border-slate-200 bg-white/50 px-8 font-bold backdrop-blur-sm hover:bg-slate-50"
              disabled={isWorking}
              onClick={onEdit}
            >
              <PencilLine className="mr-2 size-4" />
              Edit Draft
            </Button>
          )}

          {canModerate && (
            <div className="flex gap-4">
              <Button
                className="h-12 rounded-2xl bg-emerald-600 px-8 font-bold shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] hover:bg-emerald-700 hover:shadow-emerald-500/40"
                disabled={isWorking}
                onClick={onApprove}
              >
                <ShieldCheck className="mr-2 size-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-2 border-slate-200 bg-white/50 px-8 font-bold backdrop-blur-sm hover:bg-slate-50"
                disabled={isWorking}
                onClick={onReject}
              >
                <XCircle className="mr-2 size-4" />
                Reject
              </Button>
            </div>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              className="h-12 rounded-2xl px-8 font-bold shadow-[0_10px_20px_-5px_rgba(239,68,68,0.3)] hover:shadow-red-500/40"
              disabled={isWorking}
              onClick={onDelete}
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
