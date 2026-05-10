import { Rewards } from "@/features/Dashboard/types/dashboard";
import { Gift, Star, Wallet } from "lucide-react";
import { useTheme } from "@/theme";

interface Props {
  data: Rewards;
}

export default function BudgetCard({ data }: Props) {
  const { theme } = useTheme();
  const progress = data.nextReward > 0 ? (data.points / data.nextReward) * 100 : 0;

  return (
    <div className="cd-card cd-card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="cd-section-title" style={{ marginBottom: 0 }}>
          Rewards & Earnings
        </h3>
        <Gift size={18} style={{ color: theme.primary.default }} />
      </div>

      {/* Points */}
      <div
        className="p-4 rounded-xl mb-4 transition-transform hover:scale-[1.01]"
        style={{ backgroundColor: theme.primary.subtle }}
      >
        <p className="text-xs" style={{ color: theme.text.secondary }}>
          Your Points
        </p>
        <div className="flex items-center gap-2">
          <Star size={18} style={{ color: theme.primary.default }} />
          <p className="text-3xl font-bold" style={{ color: theme.primary.default }}>
            {data.points}
          </p>
        </div>
        <div className="mt-3">
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: theme.border.default }}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: theme.primary.default,
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
            {data.nextReward - data.points} pts to next reward
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {data.stipend !== undefined && (
          <div
            className="p-3 rounded-xl flex items-center gap-2 hover:scale-[1.02] transition"
            style={{ backgroundColor: theme.success.subtle }}
          >
            <Wallet size={15} style={{ color: theme.success.default }} />
            <div>
              <p className="text-xs" style={{ color: theme.text.secondary }}>
                Stipend
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.success.default }}>
                ₹{data.stipend}
              </p>
            </div>
          </div>
        )}
        {data.rewardsEarned !== undefined && (
          <div
            className="p-3 rounded-xl flex items-center gap-2 hover:scale-[1.02] transition"
            style={{ backgroundColor: theme.warning.subtle }}
          >
            <Gift size={15} style={{ color: theme.warning.default }} />
            <div>
              <p className="text-xs" style={{ color: theme.text.secondary }}>
                Rewards
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.warning.default }}>
                {data.rewardsEarned}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Next reward */}
      <div
        className="p-3 rounded-xl flex justify-between items-center transition-colors cursor-pointer"
        style={{ backgroundColor: theme.bg.surfaceSecondary }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.backgroundColor = theme.interactive.hover)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.backgroundColor = theme.bg.surfaceSecondary)
        }
      >
        <div>
          <p className="text-xs" style={{ color: theme.text.secondary }}>
            Next Reward
          </p>
          <div className="flex items-center gap-2">
            <Gift size={15} style={{ color: theme.primary.default }} />
            <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
              Amazon Voucher
            </p>
          </div>
        </div>
        <span className="text-xs" style={{ color: theme.primary.default }}>
          {data.nextReward} pts
        </span>
      </div>
    </div>
  );
}
