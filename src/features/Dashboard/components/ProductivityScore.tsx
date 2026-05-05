import { calculateProductivityScore } from "@/utils/productivity";
import { Performance } from "@/features/Dashboard/types/dashboard";

interface Props {
  data: Performance;
}

export default function ProductivityScore({ data }: Props) {
  const score = calculateProductivityScore(data);

  return (
    <div className="card hover:shadow-md transition">
      {/* Header */}
      <h3 className="section-title">Productivity Score</h3>

      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24 flex items-center justify-center group cursor-pointer">
          {/* Yellow activity ring */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-40 group-hover:scale-105 transition" />

          <div className="w-full h-full rounded-full border-4 border-indigo-500 flex items-center justify-center shadow-inner group-hover:shadow-md transition">
            <span className="text-2xl font-bold text-indigo-600">{score}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Completion */}
        <div
          className="
            p-3 rounded-xl bg-indigo-50 cursor-pointer
            hover:bg-indigo-100 hover:-translate-y-[1px] hover:shadow-sm
            transition
          "
          onClick={() => alert("View completion details")}
        >
          <p className="text-xs text-gray-500">Completion</p>
          <p className="text-sm font-semibold text-indigo-600">{data.completionRate}%</p>
        </div>

        {/* Streaks */}
        <div
          className="
            p-3 rounded-xl bg-yellow-50 cursor-pointer
            hover:bg-yellow-100 hover:-translate-y-[1px] hover:shadow-sm
            transition
          "
          onClick={() => alert("View streak details")}
        >
          <p className="text-xs text-gray-500">Streak</p>
          <p className="text-sm font-semibold text-yellow-600">{data.streak} days</p>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Weekly Tasks</span>
          <span>{data.weeklyCompleted}</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 bg-indigo-500 rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(data.weeklyCompleted * 10, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
