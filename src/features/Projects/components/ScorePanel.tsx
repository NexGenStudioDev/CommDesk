import { formatDistanceToNowStrict } from "date-fns";
import { CheckCircle2, Clock3, MessageSquareText, Star } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  JudgeScoreInput,
  ProjectPermissions,
  ProjectRecord,
  ViewerContext,
} from "@/features/Projects/types/project.types";
import { Button } from "@/shadcnComponet/ui/button";

type ScorePanelProps = {
  project: ProjectRecord;
  viewer: ViewerContext;
  permissions: ProjectPermissions;
  isSubmitting: boolean;
  onSubmit: (values: JudgeScoreInput) => Promise<void>;
};

const criteria: Array<{
  key: keyof Omit<JudgeScoreInput, "feedback">;
  label: string;
  helper: string;
}> = [
  { key: "innovation", label: "Innovation", helper: "Novelty, differentiation, and ambition." },
  {
    key: "technicalComplexity",
    label: "Technical Complexity",
    helper: "Engineering depth, architecture, and execution difficulty.",
  },
  { key: "designUx", label: "Design / UX", helper: "Clarity, usability, and polish." },
  { key: "impact", label: "Impact", helper: "Practical value, reach, and event relevance." },
];

function clamp(value: number) {
  return Math.max(0, Math.min(10, value));
}

export default function ScorePanel({
  project,
  viewer,
  permissions,
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

  const canWrite = permissions.canScore || permissions.canEditScore;

  const lockMessage = existingScore
    ? "You already scored this project. Editing remains open until the judging deadline."
    : "Submit one scorecard for this assigned project before the judging deadline.";

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Judge panel</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">Evaluation scorecard</h2>
        </div>
        <div className="rounded-2xl bg-slate-900 px-4 py-3 text-right text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Total score</p>
          <p className="mt-1 text-2xl font-semibold">{total} / 40</p>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <Clock3 className="size-4 text-amber-500" />
          Deadline closes {formatDistanceToNowStrict(new Date(project.judgingDeadline), { addSuffix: true })}
        </p>
        <p className="mt-2 flex items-start gap-2">
          {existingScore ? (
            <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
          ) : (
            <Star className="mt-0.5 size-4 text-sky-600" />
          )}
          {lockMessage}
        </p>
      </div>

      <div className="grid gap-4">
        {criteria.map((criterion) => (
          <label key={criterion.key} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">{criterion.label}</p>
                <p className="mt-1 text-sm text-slate-600">{criterion.helper}</p>
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
                className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-right text-lg font-semibold outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:bg-slate-100"
              />
            </div>
          </label>
        ))}
      </div>

      <label className="mt-5 grid gap-2 text-sm font-medium text-slate-700">
        <span className="flex items-center gap-2">
          <MessageSquareText className="size-4" />
          Feedback
        </span>
        <textarea
          className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:bg-slate-100"
          disabled={!canWrite || isSubmitting}
          value={form.feedback}
          onChange={(event) => setForm((current) => ({ ...current, feedback: event.target.value }))}
          placeholder="Summarize the strongest areas, product risks, and next improvements."
        />
      </label>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {canWrite
            ? existingScore
              ? "Your existing scorecard will be updated."
              : "Submitting will create your first scorecard."
            : "Scoring is locked because the deadline has passed or you are not assigned."}
        </p>
        <Button
          className="bg-slate-900 hover:bg-slate-800"
          disabled={!canWrite || isSubmitting}
          onClick={() => onSubmit(form)}
        >
          {existingScore ? "Update score" : "Submit score"}
        </Button>
      </div>
    </section>
  );
}
