import { CalendarClock, PencilLine, Rocket, ShieldCheck, Trash2, XCircle } from "lucide-react";

import { Button } from "@/shadcnComponet/ui/button";
import { cn } from "@/lib/utils";

import type { ProjectPermissions, ProjectRecord, UserRole, ViewerContext } from "../types";

type HeaderProps = {
  project: ProjectRecord;
  viewer: ViewerContext;
  permissions: ProjectPermissions;
  isWorking: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
};

const statusTheme: Record<ProjectRecord["status"], string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  submitted: "bg-amber-100 text-amber-800 ring-amber-200",
  under_review: "bg-sky-100 text-sky-800 ring-sky-200",
  approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  rejected: "bg-rose-100 text-rose-800 ring-rose-200",
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
  permissions,
  isWorking,
  onEdit,
  onDelete,
  onSubmit,
  onApprove,
  onReject,
}: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.5)] backdrop-blur xl:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-amber-400" />
      <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-cyan-100 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-amber-100 blur-3xl" />

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset",
                statusTheme[project.status],
              )}
            >
              {getStatusLabel(project.status)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
              <ShieldCheck className="size-4" />
              {roleLabel[viewer.role]} view
            </span>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{project.eventType}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 xl:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <CalendarClock className="size-4" />
              {project.eventName}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
          {permissions.canSubmit && (
            <Button className="bg-teal-600 hover:bg-teal-700" disabled={isWorking} onClick={onSubmit}>
              <Rocket className="size-4" />
              Submit
            </Button>
          )}

          {permissions.canEdit && (
            <Button variant="outline" disabled={isWorking} onClick={onEdit}>
              <PencilLine className="size-4" />
              Edit
            </Button>
          )}

          {(permissions.canDeleteDraft || permissions.canDeleteAny) && (
            <Button variant="destructive" disabled={isWorking} onClick={onDelete}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}

          {permissions.canModerate && (
            <>
              <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={isWorking} onClick={onApprove}>
                <ShieldCheck className="size-4" />
                Approve
              </Button>
              <Button variant="outline" disabled={isWorking} onClick={onReject}>
                <XCircle className="size-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
