import { Rewards } from "@/features/Dashboard/member/types/dashboard";

import { Gift, Star, Wallet } from "lucide-react";

interface Props {
  data: Rewards;
}

export default function BudgetCard({ data }: Props) {
  const progress = data.nextReward > 0 ? (data.points / data.nextReward) * 100 : 0;

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
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rewards & Earnings</h3>

        <div
          className="
            p-2 rounded-xl

            bg-indigo-100
            dark:bg-indigo-500/15

            text-indigo-600
            dark:text-indigo-400
          "
        >
          <Gift size={16} />
        </div>
      </div>

      {/* Points Section */}
      <div
        className="
          p-4 rounded-2xl mb-5

          bg-gradient-to-br
          from-indigo-50
          to-indigo-100

          dark:from-indigo-500/10
          dark:to-indigo-500/5

          border border-indigo-100
          dark:border-indigo-500/10

          hover:scale-[1.01]

          transition-all duration-300
        "
      >
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">Your Points</p>

        <div className="flex items-center gap-2">
          <Star
            className="
              text-indigo-500
              dark:text-indigo-400
            "
            size={18}
          />

          <p
            className="
              text-3xl font-bold

              text-indigo-600
              dark:text-indigo-300
            "
          >
            {data.points}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div
            className="
              w-full h-2 rounded-full overflow-hidden

              bg-indigo-100
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
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>

          <p
            className="
              text-xs mt-2

              text-gray-500
              dark:text-zinc-400
            "
          >
            {data.nextReward - data.points} pts to next reward
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Stipend */}
        {data.stipend !== undefined && (
          <div
            className="
              p-3 rounded-xl

              bg-green-50
              dark:bg-green-500/10

              border border-green-100
              dark:border-green-500/10

              hover:scale-[1.02]

              transition-all duration-200

              flex items-center gap-3
            "
          >
            <div
              className="
                p-2 rounded-lg

                bg-green-100
                dark:bg-green-500/15

                text-green-600
                dark:text-green-400
              "
            >
              <Wallet size={16} />
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Stipend</p>

              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                ₹{data.stipend}
              </p>
            </div>
          </div>
        )}

        {/* Rewards */}
        {data.rewardsEarned !== undefined && (
          <div
            className="
              p-3 rounded-xl

              bg-yellow-50
              dark:bg-yellow-500/10

              border border-yellow-100
              dark:border-yellow-500/10

              hover:scale-[1.02]

              transition-all duration-200

              flex items-center gap-3
            "
          >
            <div
              className="
                p-2 rounded-lg

                bg-yellow-100
                dark:bg-yellow-500/15

                text-yellow-600
                dark:text-yellow-400
              "
            >
              <Gift size={16} />
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Rewards</p>

              <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                {data.rewardsEarned}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Next Reward */}
      <div
        className="
          p-4 rounded-2xl

          bg-gray-50
          dark:bg-zinc-800/50

          border border-gray-100
          dark:border-zinc-700

          hover:bg-gray-100
          dark:hover:bg-zinc-800

          transition-all duration-200

          flex justify-between items-center gap-4
        "
      >
        <div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Next Reward</p>

          <div className="flex items-center gap-2">
            <Gift
              size={16}
              className="
                text-indigo-500
                dark:text-indigo-400
              "
            />

            <p className="text-sm font-medium text-gray-800 dark:text-white">Amazon Voucher</p>
          </div>
        </div>

        <span
          className="
            text-xs font-medium

            text-indigo-600
            dark:text-indigo-400
          "
        >
          {data.nextReward} pts
        </span>
      </div>
    </div>
  );
}
