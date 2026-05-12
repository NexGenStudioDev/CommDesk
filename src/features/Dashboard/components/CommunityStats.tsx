import { CommunityStats } from "@/features/Dashboard/Member/v1/Type/dashboard";

interface Props {
  data: CommunityStats;
}

export default function CommunityStatsCard({ data }: Props) {
  const activityPercent =
    data.totalMembers > 0 ? Math.round((data.activeMembers / data.totalMembers) * 100) : 0;

  return (
    <div className="cd-card cd-card-hover">
      <h3 className="cd-section-title">Community Insights</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="cd-metric cursor-pointer hover:-translate-y-[1px] transition-all"
          onClick={() => alert("View members")}
        >
          <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
            Members
          </p>
          <p className="text-lg font-semibold" style={{ color: "var(--cd-text)" }}>
            {data.totalMembers}
          </p>
        </div>

        <div
          className="p-3 rounded-xl cursor-pointer hover:-translate-y-[1px] transition-all"
          style={{ backgroundColor: "var(--cd-success-subtle)" }}
          onClick={() => alert("View active users")}
        >
          <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
            Active
          </p>
          <p className="text-lg font-semibold" style={{ color: "var(--cd-success)" }}>
            {data.activeMembers}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--cd-text-2)" }}>
          <span>Engagement</span>
          <span>{activityPercent}%</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--cd-border)" }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${activityPercent}%`, backgroundColor: "var(--cd-success)" }}
          />
        </div>
      </div>

      {data.rank !== undefined && (
        <div
          className="mt-3 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:-translate-y-[1px] transition-all"
          style={{ backgroundColor: "var(--cd-primary-subtle)" }}
          onClick={() => alert("View leaderboard")}
        >
          <span className="text-xs" style={{ color: "var(--cd-text-2)" }}>
            Your Rank
          </span>
          <span className="font-semibold" style={{ color: "var(--cd-primary)" }}>
            #{data.rank}
          </span>
        </div>
      )}
    </div>
  );
}
