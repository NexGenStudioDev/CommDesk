import { AlertTriangle, CheckCircle2, Trash2, XCircle } from "lucide-react";

import { Button } from "@/shadcnComponet/ui/button";

import type { ProjectRecord, ScoreSummary } from "../types";

type ModerationPanelProps = {
  project: ProjectRecord;
  scoreSummary: ScoreSummary;
  isWorking: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
};

export default function ModerationPanel({
  project,
  scoreSummary,
  isWorking,
  onApprove,
  onReject,
  onDelete,
}: ModerationPanelProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Moderation
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Organizer controls</h2>
      </div>

      <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">
          <AlertTriangle className="size-4" />
          Review context
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-4">
            <p className="text-sm text-slate-500">Current status</p>
            <p className="mt-2 text-lg font-semibold capitalize text-slate-950">
              {project.status.replace("_", " ")}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4">
            <p className="text-sm text-slate-500">Average score</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {scoreSummary.averageScore === null ? "Pending" : `${scoreSummary.averageScore.toFixed(1)} / 40`}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4">
            <p className="text-sm text-slate-500">Judges completed</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{scoreSummary.judgeCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={isWorking} onClick={onApprove}>
          <CheckCircle2 className="size-4" />
          Approve project
        </Button>
        <Button variant="outline" disabled={isWorking} onClick={onReject}>
          <XCircle className="size-4" />
          Reject project
        </Button>
        <Button variant="destructive" disabled={isWorking} onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete project
        </Button>
      </div>
    </section>
  );
}
