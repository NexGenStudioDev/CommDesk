import { Issues } from "@/features/Dashboard/types/dashboard";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface Props {
  data: Issues;
}

export default function IssuesPanel({ data }: Props) {
  const total = data.open + data.resolved;

  const resolvedPercent = total > 0 ? Math.round((data.resolved / total) * 100) : 0;

  const hasIssues = data.open > 0;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
      {/* Header */}
      <h3 className="font-semibold text-lg mb-4">Issues</h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Open */}
        <div
          className="
            p-3 rounded-xl bg-red-50 border border-red-100
            flex items-center gap-2
            hover:bg-red-100 hover:shadow-sm hover:-translate-y-[1px]
            transition cursor-pointer
          "
          onClick={() => alert("View open issues")}
        >
          <AlertCircle size={18} className="text-red-600" />

          <div>
            <p className="text-xs text-gray-500">Open</p>
            <p className="text-lg font-semibold text-red-600">{data.open}</p>
          </div>
        </div>

        {/* Resolved*/}
        <div
          className="
            p-3 rounded-xl bg-emerald-50 border border-emerald-100
            flex items-center gap-2
            hover:bg-emerald-100 hover:shadow-sm hover:-translate-y-[1px]
            transition cursor-pointer
          "
          onClick={() => alert("View resolved issues")}
        >
          <CheckCircle size={18} className="text-emerald-600" />

          <div>
            <p className="text-xs text-gray-500">Resolved</p>
            <p className="text-lg font-semibold text-emerald-600">{data.resolved}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Resolution Progress</span>
          <span>{resolvedPercent}%</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${resolvedPercent}%` }}
          />
        </div>
      </div>

      {/* Insights*/}
      <div
        className={`
          mt-4 p-3 rounded-xl border text-sm
          flex items-start gap-2 cursor-pointer transition

          ${
            hasIssues
              ? "bg-yellow-50 border-yellow-100 text-yellow-700 hover:bg-yellow-100"
              : "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
          }
        `}
        onClick={() => alert("Review issues")}
      >
        <AlertTriangle size={16} className="mt-[2px]" />

        <span>
          {hasIssues
            ? `${data.open} issue(s) need attention`
            : "All issues are resolved — great job!"}
        </span>
      </div>
    </div>
  );
}
