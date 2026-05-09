import { PRIORITY_CONFIG } from "../../constants/task.constants";
import type { TaskPriority } from "../../Task.types";

interface Props {
  priority: TaskPriority;
  size?: "sm" | "md";
}

export default function PriorityBadge({ priority, size = "md" }: Props) {
  const cfg = PRIORITY_CONFIG[priority];
  const cls = size === "sm"
    ? "px-2 py-0.5 text-[10px] gap-1"
    : "px-2.5 py-1 text-xs gap-1.5";
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${cls} ${cfg.badgeBg} ${cfg.badgeText}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}