import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

import { Issues } from "@/features/Dashboard/member/types/dashboard";

interface Props {
  data: Issues;
}

export default function IssuesPanel({ data }: Props) {
  const total = data.open + data.resolved;

  const resolvedPercent = total > 0 ? Math.round((data.resolved / total) * 100) : 0;

  const hasIssues = data.open > 0;

  return (
    <div
      className="
        bg-white/90
        dark:bg-zinc-900

        border border-gray-200
        dark:border-zinc-800

        rounded-2xl
        p-5

        shadow-sm dark:shadow-none

        hover:shadow-md
        dark:hover:border-zinc-700

        transition-all duration-300
      "
    >
      {/* Header */}
      <h3
        className="
          text-lg font-semibold mb-5

          text-gray-900
          dark:text-white
        "
      >
        Issues
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Open */}
        <div
          className="
            p-4 rounded-2xl

            bg-red-50
            dark:bg-red-500/10

            border border-red-100
            dark:border-red-500/10

            flex items-center gap-3

            hover:bg-red-100
            dark:hover:bg-red-500/15

            hover:shadow-sm
            hover:-translate-y-[1px]

            transition-all duration-200

            cursor-pointer
          "
          onClick={() => alert("View open issues")}
        >
          <div
            className="
              p-2 rounded-xl

              bg-red-100
              dark:bg-red-500/15

              text-red-600
              dark:text-red-400
            "
          >
            <AlertCircle size={16} />
          </div>

          <div>
            <p
              className="
                text-xs mb-1

                text-gray-500
                dark:text-zinc-400
              "
            >
              Open
            </p>

            <p
              className="
                text-xl font-semibold

                text-red-600
                dark:text-red-400
              "
            >
              {data.open}
            </p>
          </div>
        </div>

        {/* Resolved */}
        <div
          className="
            p-4 rounded-2xl

            bg-emerald-50
            dark:bg-emerald-500/10

            border border-emerald-100
            dark:border-emerald-500/10

            flex items-center gap-3

            hover:bg-emerald-100
            dark:hover:bg-emerald-500/15

            hover:shadow-sm
            hover:-translate-y-[1px]

            transition-all duration-200

            cursor-pointer
          "
          onClick={() => alert("View resolved issues")}
        >
          <div
            className="
              p-2 rounded-xl

              bg-emerald-100
              dark:bg-emerald-500/15

              text-emerald-600
              dark:text-emerald-400
            "
          >
            <CheckCircle size={16} />
          </div>

          <div>
            <p
              className="
                text-xs mb-1

                text-gray-500
                dark:text-zinc-400
              "
            >
              Resolved
            </p>

            <p
              className="
                text-xl font-semibold

                text-emerald-600
                dark:text-emerald-400
              "
            >
              {data.resolved}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div
          className="
            flex justify-between mb-2

            text-xs font-medium

            text-gray-500
            dark:text-zinc-400
          "
        >
          <span>Resolution Progress</span>

          <span>{resolvedPercent}%</span>
        </div>

        <div
          className="
            w-full h-2 rounded-full overflow-hidden

            bg-gray-100
            dark:bg-zinc-800
          "
        >
          <div
            className="
              h-2 rounded-full

              bg-indigo-500

              transition-all duration-700
            "
            style={{
              width: `${resolvedPercent}%`,
            }}
          />
        </div>
      </div>

      {/* Insights */}
      <div
        className={`
          mt-4 p-4 rounded-2xl border text-sm

          flex items-start gap-3

          cursor-pointer

          transition-all duration-200

          hover:shadow-sm
          hover:-translate-y-[1px]

          ${
            hasIssues
              ? `
                bg-yellow-50
                border-yellow-100
                text-yellow-700

                hover:bg-yellow-100

                dark:bg-yellow-500/10
                dark:border-yellow-500/10
                dark:text-yellow-300
                dark:hover:bg-yellow-500/15
              `
              : `
                bg-emerald-50
                border-emerald-100
                text-emerald-700

                hover:bg-emerald-100

                dark:bg-emerald-500/10
                dark:border-emerald-500/10
                dark:text-emerald-300
                dark:hover:bg-emerald-500/15
              `
          }
        `}
        onClick={() => alert("Review issues")}
      >
        <AlertTriangle size={16} className="mt-[2px]" />

        <span className="leading-relaxed">
          {hasIssues
            ? `${data.open} issue(s) need attention`
            : "All issues are resolved — great job!"}
        </span>
      </div>
    </div>
  );
}
