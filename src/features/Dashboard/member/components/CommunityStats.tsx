import { CommunityStats } from "@/features/Dashboard/member/types/dashboard";

interface Props {
  data: CommunityStats;
}

export default function CommunityStatsCard({ data }: Props) {
  const activityPercent =
    data.totalMembers > 0 ? Math.round((data.activeMembers / data.totalMembers) * 100) : 0;

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
        Community Insights
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Members */}
        <div
          className="
            p-4 rounded-2xl

            bg-gray-50
            dark:bg-zinc-800/50

            border border-gray-100
            dark:border-zinc-700

            cursor-pointer

            hover:bg-gray-100
            dark:hover:bg-zinc-800

            hover:-translate-y-[1px]
            hover:shadow-sm

            transition-all duration-200
          "
          onClick={() => alert("View members")}
        >
          <p
            className="
              text-xs mb-1

              text-gray-500
              dark:text-zinc-400
            "
          >
            Members
          </p>

          <p
            className="
              text-xl font-semibold

              text-gray-800
              dark:text-white
            "
          >
            {data.totalMembers}
          </p>
        </div>

        {/* Active Members */}
        <div
          className="
            p-4 rounded-2xl

            bg-emerald-50
            dark:bg-emerald-500/10

            border border-emerald-100
            dark:border-emerald-500/10

            cursor-pointer

            hover:bg-emerald-100
            dark:hover:bg-emerald-500/15

            hover:-translate-y-[1px]
            hover:shadow-sm

            transition-all duration-200
          "
          onClick={() => alert("View active users")}
        >
          <p
            className="
              text-xs mb-1

              text-gray-500
              dark:text-zinc-400
            "
          >
            Active
          </p>

          <p
            className="
              text-xl font-semibold

              text-emerald-600
              dark:text-emerald-400
            "
          >
            {data.activeMembers}
          </p>
        </div>
      </div>

      {/* Engagement */}
      <div className="mb-5">
        <div
          className="
            flex justify-between mb-2

            text-xs font-medium

            text-gray-500
            dark:text-zinc-400
          "
        >
          <span>Engagement</span>

          <span>{activityPercent}%</span>
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

              bg-emerald-500

              transition-all duration-700
            "
            style={{
              width: `${activityPercent}%`,
            }}
          />
        </div>
      </div>

      {/* Rank */}
      {data.rank !== undefined && (
        <div
          className="
            p-4 rounded-2xl

            bg-indigo-50
            dark:bg-indigo-500/10

            border border-indigo-100
            dark:border-indigo-500/10

            cursor-pointer

            flex justify-between items-center

            hover:bg-indigo-100
            dark:hover:bg-indigo-500/15

            hover:-translate-y-[1px]
            hover:shadow-sm

            transition-all duration-200
          "
          onClick={() => alert("View leaderboard")}
        >
          <span
            className="
              text-sm font-medium

              text-gray-600
              dark:text-zinc-300
            "
          >
            Your Rank
          </span>

          <span
            className="
              text-lg font-semibold

              text-indigo-600
              dark:text-indigo-400
            "
          >
            #{data.rank}
          </span>
        </div>
      )}
    </div>
  );
}
