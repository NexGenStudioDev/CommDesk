import type { TechTag } from "../../Task.types";
import { techBadgeStyle } from "../../utils/techBadgeStyle";

export default function TechBadge({ tech, size = "sm" }: { tech: TechTag; size?: "xs" | "sm" }) {
  const cls = size === "xs" ? "text-[10px] px-1.5" : "text-[11px] px-2";

  return (
    <span
      className={`inline-flex items-center rounded-md border py-0.5 font-semibold ${cls}`}
      style={techBadgeStyle(tech.id)}
    >
      {tech.label}
    </span>
  );
}
