import { STATUS_CONFIG } from "../../constants/task.constants";
import type { TaskStatus } from "../../Task.types";

interface Props {
  status: TaskStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: Props) {
  const cfg = STATUS_CONFIG[status];
  const cls = size === "sm"
    ? "px-1.5 py-0.5 text-[10px] gap-1"
    : "px-2 py-1 text-xs gap-1.5";
  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${cls} ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
