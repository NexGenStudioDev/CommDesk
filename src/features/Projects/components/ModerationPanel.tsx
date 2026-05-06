import { AlertTriangle, CheckCircle2, ShieldAlert, Trash2, XCircle } from "lucide-react";

import type { ProjectRecord, ScoreSummary } from "@/features/Projects/types/project.types";
import { Button } from "@/shadcnComponet/ui/button";
import { cn } from "@/lib/utils";

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
    <section className="group overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_20px_50px_rgba(244,63,94,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(244,63,94,0.1)]">
      <div className="bg-rose-50/50 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Moderator Suite</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Organizer Controls</h2>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm shadow-rose-200">
            <ShieldAlert className="size-6" />
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-rose-200 bg-white/80 p-6 backdrop-blur-sm">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <AlertTriangle className="size-3.5 text-amber-500" />
            Decision Context
          </p>
          
          <div className="mt-6 grid gap-4">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <span className="text-sm font-bold text-slate-500">Current Status</span>
              <span className="rounded-lg bg-white px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-900 shadow-sm ring-1 ring-slate-200">
                {project.status.replace("_", " ")}
              </span>
            </div>
            
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <span className="text-sm font-bold text-slate-500">Average Score</span>
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-lg font-black",
                  scoreSummary.averageScore !== null ? "text-indigo-600" : "text-slate-400"
                )}>
                  {scoreSummary.averageScore === null ? "Pending" : scoreSummary.averageScore.toFixed(1)}
                </span>
                {scoreSummary.averageScore !== null && <span className="text-[10px] font-bold text-slate-400">/ 40</span>}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <span className="text-sm font-bold text-slate-500">Judges Reviewing</span>
              <span className="text-lg font-black text-slate-900">{scoreSummary.judgeCount}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="h-14 rounded-2xl bg-emerald-600 font-black shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] hover:bg-emerald-700 hover:shadow-emerald-500/40" 
              disabled={isWorking} 
              onClick={onApprove}
            >
              <CheckCircle2 className="mr-2 size-4" />
              Approve
            </Button>
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-2 border-slate-200 bg-white font-black hover:bg-slate-50" 
              disabled={isWorking} 
              onClick={onReject}
            >
              <XCircle className="mr-2 size-4" />
              Reject
            </Button>
          </div>
          <Button 
            variant="destructive" 
            className="h-14 rounded-2xl font-black shadow-[0_10px_20px_-5px_rgba(239,68,68,0.3)] hover:shadow-rose-500/40" 
            disabled={isWorking} 
            onClick={onDelete}
          >
            <Trash2 className="mr-2 size-4" />
            Permanent Delete
          </Button>
        </div>
      </div>
    </section>
  );
}
