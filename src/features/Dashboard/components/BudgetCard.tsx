import { Rewards } from "@/features/Dashboard/types/dashboard";
import { Gift, Star, Wallet } from "lucide-react";

interface Props {
  data: Rewards;
}

export default function BudgetCard({ data }: Props) {
  const progress = data.nextReward > 0 ? (data.points / data.nextReward) * 100 : 0;

  return (
    <div className="card hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Rewards & Earnings</h3>
        <Gift className="text-indigo-500" size={18} />
      </div>

      {/*points*/}
      <div className="bg-indigo-50 p-4 rounded-xl mb-4 hover:scale-[1.01] transition">
        <p className="text-xs text-gray-500">Your Points</p>
        <div className="flex items-center gap-2">
          <Star className="text-indigo-500" size={18} />
          <p className="text-3xl font-bold text-indigo-600">{data.points}</p>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {data.nextReward - data.points} pts to next reward
          </p>
        </div>
      </div>

      {/*stats*/}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Stipend */}
        {data.stipend !== undefined && (
          <div className="p-3 rounded-xl bg-green-50 hover:scale-[1.02] transition flex items-center gap-2">
            <Wallet size={16} className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Stipend</p>
              <p className="text-sm font-semibold text-green-600">₹{data.stipend}</p>
            </div>
          </div>
        )}

        {/* Rewardss */}
        {data.rewardsEarned !== undefined && (
          <div className="p-3 rounded-xl bg-yellow-50 hover:scale-[1.02] transition flex items-center gap-2">
            <Gift size={16} className="text-yellow-600" />
            <div>
              <p className="text-xs text-gray-500">Rewards</p>
              <p className="text-sm font-semibold text-yellow-600">{data.rewardsEarned}</p>
            </div>
          </div>
        )}
      </div>

      {/* rewards preview */}
      <div className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Next Reward</p>
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-indigo-500" />
            <p className="text-sm font-medium text-gray-800">Amazon Voucher</p>
          </div>
        </div>

        <span className="text-xs text-indigo-500">{data.nextReward} pts</span>
      </div>
    </div>
  );
}
