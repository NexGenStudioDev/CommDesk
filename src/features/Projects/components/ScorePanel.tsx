import { formatDistanceToNowStrict } from "date-fns";
import { CheckCircle2, Clock3, MessageSquareText, Sparkles, Star, Zap } from "lucide-react";
import { useMemo, useState } from "react";

import { Project_Permissions } from "@/features/Projects/constants/permission.constants";
import type {
  JudgeScoreInput,
  ProjectRecord,
  ViewerContext,
} from "@/features/Projects/types/project.types";
import { hasPermission } from "@/features/Projects/utils/permission.utils";
import { Button } from "@/shadcnComponet/ui/button";
import { cn } from "@/lib/utils";

type ScorePanelProps = {
  project: ProjectRecord;
  viewer: ViewerContext;
  isSubmitting: boolean;
  onSubmit: (values: JudgeScoreInput) => Promise<void>;
};

const criteria: Array<{
  key: keyof Omit<JudgeScoreInput, "feedback">;
  label: string;
  helper: string;
  icon: typeof Sparkles;
  color: string;
}> = [
  { key: "innovation", label: "Innovation", helper: "Novelty and ambition.", icon: Sparkles, color: "text-amber-500 bg-amber-50" },
  {
    key: "technicalComplexity",
    label: "Tech Depth",
    helper: "Engineering difficulty.",
    icon: Zap,
    color: "text-indigo-500 bg-indigo-50",
  },
  { key: "designUx", label: "Design / UX", helper: "Clarity and polish.", icon: Star, color: "text-rose-500 bg-rose-50" },
  { key: "impact", label: "Impact", helper: "Practical value.", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
];

function clamp(value: number) {
  return Math.max(0, Math.min(10, value));
}

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-rose-600";
}

export default function ScorePanel({
  project,
  viewer,
  isSubmitting,
  onSubmit,
}: ScorePanelProps) {
  const existingScore = project.judgeScores.find((entry) => entry.judgeId === viewer.userId);

  const [form, setForm] = useState<JudgeScoreInput>({
    innovation: existingScore?.innovation ?? 0,
    technicalComplexity: existingScore?.technicalComplexity ?? 0,
    designUx: existingScore?.designUx ?? 0,
    impact: existingScore?.impact ?? 0,
    feedback: existingScore?.feedback ?? "",
  });

  const total = useMemo(
    () => form.innovation + form.technicalComplexity + form.designUx + form.impact,
    [form],
  );

  const canScore = hasPermission(viewer.permissions, Project_Permissions.SCORE_PROJECT);
  const isReviewable = project.status === "submitted" || project.status === "under_review";
  const canWrite = canScore && isReviewable;

  const lockMessage = existingScore
    ? "You already scored this project. Editing remains open until the deadline."
    : "Submit one scorecard for this assigned project before the deadline.";

  return (
    <section className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
      <div className="bg-slate-950 p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Project Evaluation</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Judge Scorecard</h2>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-indigo-400">{total}</span>
              <span className="text-sm font-bold text-slate-500">/ 40</span>
            </div>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Points</p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Clock3 className="size-5 text-white" />
          </div>
          <div className="flex-1">
             <p className="text-xs font-bold text-slate-300">
               Closes {formatDistanceToNowStrict(new Date(project.judgingDeadline), { addSuffix: true })}
             </p>
             <p className="mt-0.5 text-[10px] font-medium text-slate-400 leading-tight">
               {lockMessage}
             </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-4">
          {criteria.map((criterion) => (
            <div key={criterion.key} className="relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-indigo-200 hover:bg-white hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className={cn("flex size-8 items-center justify-center rounded-lg shadow-sm", criterion.color)}>
                  <criterion.icon className="size-4" />
                </div>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={form[criterion.key]}
                  disabled={!canWrite || isSubmitting}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [criterion.key]: clamp(Number(event.target.value)),
                    }))
                  }
                  className={cn(
                    "w-12 bg-transparent text-right text-xl font-black outline-none transition-colors",
                    getScoreColor(form[criterion.key]),
                    (!canWrite || isSubmitting) && "opacity-50 cursor-not-allowed"
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{criterion.label}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{criterion.helper}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
            <MessageSquareText className="size-3.5 text-indigo-500" />
            Detailed Feedback
          </label>
          <textarea
            className="min-h-[120px] w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 disabled:opacity-50"
            disabled={!canWrite || isSubmitting}
            value={form.feedback}
            onChange={(event) => setForm((current) => ({ ...current, feedback: event.target.value }))}
            placeholder="Summarize the strongest areas, product risks, and next improvements..."
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-100 pt-8">
           {!canWrite && (
             <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 ring-1 ring-rose-200">
               <Zap className="size-3.5 fill-rose-600" />
               Judging is currently locked
             </div>
           )}
          <Button
            className="h-14 w-full rounded-2xl bg-slate-950 text-base font-black shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] hover:bg-indigo-600 active:scale-[0.98]"
            disabled={!canWrite || isSubmitting}
            onClick={() => onSubmit(form)}
          >
            {existingScore ? "Update Evaluation" : "Complete Scorecard"}
          </Button>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Final score will be {total}/40
          </p>
        </div>
      </div>
    </section>
  );
}
