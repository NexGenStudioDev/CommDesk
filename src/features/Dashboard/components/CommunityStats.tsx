import { CommunityStats } from "@/features/Dashboard/types/dashboard";

interface Props {
  data: CommunityStats;
}

export default function CommunityStatsCard({ data }: Props) {
  const activityPercent =
    data.totalMembers > 0 ? Math.round((data.activeMembers / data.totalMembers) * 100) : 0;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
      {/* Header */}
      <h3 className="font-semibold text-lg mb-4">Community Insights</h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Members */}
        <div
          className="
            p-3 rounded-xl bg-gray-50 cursor-pointer
            hover:bg-gray-100 hover:-translate-y-[1px] hover:shadow-sm
            transition
          "
          onClick={() => alert("View members")}
        >
          <p className="text-xs text-gray-500">Members</p>
          <p className="text-lg font-semibold text-gray-800">{data.totalMembers}</p>
        </div>

        {/* Active members */}
        <div
          className="
            p-3 rounded-xl bg-emerald-50 cursor-pointer
            hover:bg-emerald-100 hover:-translate-y-[1px] hover:shadow-sm
            transition
          "
          onClick={() => alert("View active users")}
        >
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-lg font-semibold text-emerald-600">{data.activeMembers}</p>
        </div>
      </div>

      {/* Engagement */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Engagement</span>
          <span>{activityPercent}%</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${activityPercent}%` }}
          />
        </div>
      </div>

      {/* Rank */}
      {data.rank !== undefined && (
        <div
          className="
            mt-3 p-3 rounded-xl bg-indigo-50 cursor-pointer
            flex justify-between items-center
            hover:bg-indigo-100 hover:-translate-y-[1px] hover:shadow-sm
            transition
          "
          onClick={() => alert("View leaderboard")}
        >
          <span className="text-xs text-gray-500">Your Rank</span>
          <span className="font-semibold text-indigo-600">#{data.rank}</span>
        </div>
      )}
    </div>
  );
}
