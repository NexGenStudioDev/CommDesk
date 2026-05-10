import { calculateProductivityScore } from "@/utils/productivity";
import { Performance } from "../member/types/dashboard";

interface Props {
  data: Performance;
}

export default function ProductivityScore({ data }: Props) {
  const score = calculateProductivityScore(data);

  return (
    <div className="cd-card cd-card-hover">
      <h3 className="cd-section-title">Productivity Score</h3>

      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24 flex items-center justify-center group cursor-pointer">
          <div
            className="absolute inset-0 rounded-full border-4 opacity-30 group-hover:scale-105 transition"
            style={{ borderColor: "var(--cd-warning)" }}
          />
          <div
            className="w-full h-full rounded-full border-4 flex items-center justify-center group-hover:shadow-md transition"
            style={{ borderColor: "var(--cd-primary)" }}
          >
            <span className="text-2xl font-bold" style={{ color: "var(--cd-primary)" }}>
              {score}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div
          className="p-3 rounded-xl cursor-pointer hover:-translate-y-[1px] transition-all"
          style={{ backgroundColor: "var(--cd-primary-subtle)" }}
          onClick={() => alert("View completion details")}
        >
          <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
            Completion
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--cd-primary)" }}>
            {data.completionRate}%
          </p>
        </div>

        <div
          className="p-3 rounded-xl cursor-pointer hover:-translate-y-[1px] transition-all"
          style={{ backgroundColor: "var(--cd-warning-subtle)" }}
          onClick={() => alert("View streak details")}
        >
          <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
            Streak
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--cd-warning)" }}>
            {data.streak} days
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--cd-text-2)" }}>
          <span>Weekly Tasks</span>
          <span>{data.weeklyCompleted}</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--cd-border)" }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(data.weeklyCompleted * 10, 100)}%`,
              backgroundColor: "var(--cd-primary)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
