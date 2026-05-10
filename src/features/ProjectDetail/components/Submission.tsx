import { Project } from "../types";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function Submission({ project }: { project: Project }) {
  const isSubmitted = project.status !== "Draft";

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">Submission Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-slate-400">Status</p>
          <div className="flex items-center gap-2">
            {isSubmitted ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-sm font-medium text-white">{isSubmitted ? "Submitted" : "Not Submitted (Draft)"}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-slate-400">Version</p>
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <span>v{project.version}.0</span>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-slate-800 rounded-sm text-slate-400 border border-slate-700">
              {isSubmitted ? "Final" : "Draft"}
            </span>
          </div>
        </div>

        {project.submittedAt && (
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Submitted At</p>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{new Date(project.submittedAt).toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-sm text-slate-400">Last Updated</p>
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{new Date(project.lastUpdatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
