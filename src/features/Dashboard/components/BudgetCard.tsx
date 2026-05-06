import { Rewards } from "@/features/Dashboard/types/dashboard";
import { Gift, Star, Wallet } from "lucide-react";

interface Props {
  data: Rewards;
}

export default function BudgetCard({ data }: Props) {
  const progress = data.nextReward > 0 ? (data.points / data.nextReward) * 100 : 0;

  return (
    <div className="cd-card cd-card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="cd-section-title" style={{ marginBottom: 0 }}>
          Rewards & Earnings
        </h3>
        <Gift size={18} style={{ color: "var(--cd-primary)" }} />
      </div>

      <div
        className="p-4 rounded-xl mb-4 transition-transform hover:scale-[1.01]"
        style={{ backgroundColor: "var(--cd-primary-subtle)" }}
      >
        <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
          Your Points
        </p>
        <div className="flex items-center gap-2">
          <Star size={18} style={{ color: "var(--cd-primary)" }} />
          <p className="text-3xl font-bold" style={{ color: "var(--cd-primary)" }}>
            {data.points}
          </p>
        </div>
        <div className="mt-3">
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--cd-border)" }}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: "var(--cd-primary)",
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--cd-text-muted)" }}>
            {data.nextReward - data.points} pts to next reward
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {data.stipend !== undefined && (
          <div
            className="p-3 rounded-xl flex items-center gap-2 hover:scale-[1.02] transition"
            style={{ backgroundColor: "var(--cd-success-subtle)" }}
          >
            <Wallet size={15} style={{ color: "var(--cd-success)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
                Stipend
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--cd-success)" }}>
                ₹{data.stipend}
              </p>
            </div>
          </div>
        )}
        {data.rewardsEarned !== undefined && (
          <div
            className="p-3 rounded-xl flex items-center gap-2 hover:scale-[1.02] transition"
            style={{ backgroundColor: "var(--cd-warning-subtle)" }}
          >
            <Gift size={15} style={{ color: "var(--cd-warning)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
                Rewards
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--cd-warning)" }}>
                {data.rewardsEarned}
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className="p-3 rounded-xl flex justify-between items-center transition-colors"
        style={{ backgroundColor: "var(--cd-surface-2)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--cd-hover)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--cd-surface-2)")
        }
      >
        <div>
          <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
            Next Reward
          </p>
          <div className="flex items-center gap-2">
            <Gift size={15} style={{ color: "var(--cd-primary)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--cd-text)" }}>
              Amazon Voucher
            </p>
          </div>
        </div>
        <span className="text-xs" style={{ color: "var(--cd-primary)" }}>
          {data.nextReward} pts
        </span>
      </div>
    </div>
  );
}
