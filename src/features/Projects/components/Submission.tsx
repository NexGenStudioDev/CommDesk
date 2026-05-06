import { format } from "date-fns";
import { BarChart3, Calendar, FileLock2, Globe, History, Trophy } from "lucide-react";

import type { ProjectRecord, ScoreSummary } from "@/features/Projects/types/project.types";
import { cn } from "@/lib/utils";

type SubmissionProps = {
  project: ProjectRecord;
  scoreSummary: ScoreSummary;
};

function formatDate(value?: string) {
  return value ? format(new Date(value), "dd MMM yyyy, hh:mm a") : "Not available";
}

export default function Submission({ project, scoreSummary }: SubmissionProps) {
  const stats = [
    { label: "Status", value: project.status.replace("_", " "), icon: FileLock2, color: "text-amber-600 bg-amber-50" },
    { label: "Submitted", value: formatDate(project.submittedAt), icon: Globe, color: "text-sky-600 bg-sky-50" },
    { label: "Version", value: project.version, icon: History, color: "text-purple-600 bg-purple-50" },
    { label: "Last Edit", value: formatDate(project.updatedAt), icon: Calendar, color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <section className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Project Lifecycle</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Submission Snapshot</h2>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <FileLock2 className="size-6" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-50 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md">
              <div className={cn("flex size-10 items-center justify-center rounded-xl shadow-sm", stat.color)}>
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className="mt-0.5 text-sm font-black capitalize text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 p-6 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <BarChart3 className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950">Score Aggregation</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Global Review Summary</p>
              </div>
            </div>
            {scoreSummary.ranking ? (
              <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-2.5 text-white shadow-xl shadow-slate-200">
                <Trophy className="size-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-widest">Rank #{scoreSummary.ranking}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group/card flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-indigo-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Avg. Points</p>
              <div className="mt-2 flex items-baseline gap-1">
                <p className={cn(
                  "text-3xl font-black",
                  scoreSummary.averageScore !== null ? "text-indigo-600" : "text-slate-300"
                )}>
                  {scoreSummary.averageScore === null ? "PENDING" : scoreSummary.averageScore.toFixed(1)}
                </p>
                {scoreSummary.averageScore !== null && <span className="text-sm font-bold text-slate-400">/ 40</span>}
              </div>
            </div>

            <div className="group/card flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-indigo-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Evaluations</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{scoreSummary.judgeCount}</p>
              <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Judges</p>
            </div>

            <div className="group/card flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-indigo-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cycle Status</p>
              <div className="mt-2 flex items-center gap-2">
                <div className={cn(
                  "size-2.5 rounded-full animate-pulse",
                  (project.status === "under_review" || project.status === "approved" || project.status === "rejected")
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                )} />
                <p className="text-xl font-black text-slate-900">
                  {project.status === "under_review" || project.status === "approved" || project.status === "rejected"
                    ? "ACTIVE"
                    : "AWAITING"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
