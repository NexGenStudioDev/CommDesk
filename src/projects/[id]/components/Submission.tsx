import { format } from "date-fns";
import { BarChart3, Calendar, FileLock2, Trophy } from "lucide-react";

import type { ProjectRecord, ScoreSummary } from "../types";

type SubmissionProps = {
  project: ProjectRecord;
  scoreSummary: ScoreSummary;
};

function formatDate(value?: string) {
  return value ? format(new Date(value), "dd MMM yyyy, hh:mm a") : "Not available";
}

export default function Submission({ project, scoreSummary }: SubmissionProps) {
  const cards = [
    { label: "Submission status", value: project.status.replace("_", " "), icon: FileLock2 },
    { label: "Submitted at", value: formatDate(project.submittedAt), icon: Calendar },
    { label: "Last updated", value: formatDate(project.updatedAt), icon: Calendar },
    { label: "Version", value: project.version, icon: FileLock2 },
  ];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Submission
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Lifecycle snapshot</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <card.icon className="size-4" />
              {card.label}
            </p>
            <p className="mt-3 text-lg font-semibold capitalize text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
              <BarChart3 className="size-4" />
              Score aggregation
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">Evaluation summary</h3>
          </div>
          {scoreSummary.ranking ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
              <Trophy className="size-4 text-amber-300" />
              Rank #{scoreSummary.ranking}
            </span>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
            <p className="text-sm text-slate-500">Average score</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {scoreSummary.averageScore === null ? "Pending" : `${scoreSummary.averageScore.toFixed(1)} / 40`}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
            <p className="text-sm text-slate-500">Judges scored</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{scoreSummary.judgeCount}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
            <p className="text-sm text-slate-500">Judging status</p>
            <p className="mt-2 text-2xl font-semibold capitalize text-slate-950">
              {project.status === "under_review" || project.status === "approved" || project.status === "rejected"
                ? "Active"
                : "Awaiting"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
