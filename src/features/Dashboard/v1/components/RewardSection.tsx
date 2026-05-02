import { DollarSign, Star, Trophy } from "lucide-react";

type Rewards = {
  points: number;
  rewardsEarned: number;
  stipend: string;
};

export default function RewardsSection({ data }: { data: Rewards }) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>💰 Rewards</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
      >
        {/* Points */}
        <div
          style={{
            background: "#fef9c3",
            padding: "12px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Star size={18} />
          <p style={{ fontSize: "12px", margin: 0 }}>Points</p>
          <strong>{data.points}</strong>
        </div>

        {/* Rewards */}
        <div
          style={{
            background: "#DCFCE7",
            padding: "12px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Trophy size={18} />
          <p style={{ fontSize: "12px", margin: 0 }}>Rewards</p>
          <strong>{data.rewardsEarned}</strong>
        </div>

        {/* Stipend */}
        <div
          style={{
            background: "#E0F2FE",
            padding: "12px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <DollarSign size={18} />
          <p style={{ fontSize: "12px", margin: 0 }}>Stipend</p>
          <strong>{data.stipend}</strong>
        </div>
      </div>
    </div>
  );
}
