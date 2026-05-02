import { Users, Activity, Trophy } from "lucide-react";

type Community = {
  totalMembers: number;
  activeMembers: number;
  rank: number;
};

export default function CommunitySection({ data }: { data: Community }) {
  const activePercent = Math.round((data.activeMembers / data.totalMembers) * 100);

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>
        👥 Community Insights
      </h2>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
      >
        {/* Total Members */}
        <div
          style={{
            background: "#f1f5f9",
            padding: "12px",
            borderRadius: "10px",
          }}
        >
          <Users size={18} />
          <p style={{ fontSize: "12px" }}>Total Members</p>
          <strong>{data.totalMembers}</strong>
        </div>

        {/* Active Members */}
        <div
          style={{
            background: "#ecfeff",
            padding: "12px",
            borderRadius: "10px",
          }}
        >
          <Activity size={18} />
          <p style={{ fontSize: "12px" }}>Active Members</p>
          <strong>{data.activeMembers}</strong>
        </div>

        {/* Rank */}
        <div
          style={{
            background: "#fef3c7",
            padding: "12px",
            borderRadius: "10px",
          }}
        >
          <Trophy size={18} />
          <p style={{ fontSize: "12px" }}>Your Rank</p>
          <strong>#{data.rank}</strong>
        </div>
      </div>

      {/* Engagement Bar */}
      <div style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "12px", marginBottom: "6px" }}>
          Community Engagement ({activePercent}% active)
        </p>

        <div
          style={{
            height: "6px",
            background: "#f0f0f0",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${activePercent}%`,
              height: "100%",
              background: "#3b82f6",
            }}
          />
        </div>
      </div>
      <p
        style={{
          fontSize: "12px",
          marginTop: "8px",
          color: "#555",
        }}
      >
        You are in top {Math.round((data.rank / data.totalMembers) * 100)}% of members
      </p>
    </div>
  );
}
