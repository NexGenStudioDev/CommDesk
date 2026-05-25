import { Coins } from "lucide-react";
import { formatCredits } from "../../utils/credits";

interface Props {
  credits: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function CreditBadge({ credits, size = "md", showIcon = true }: Props) {
  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
    lg: "text-2xl gap-2 font-black",
  };

  const iconSizes = { sm: 12, md: 14, lg: 20 };

  return (
    <span
      className={`inline-flex items-center font-semibold ${sizeClasses[size]}`}
      style={{ color: "var(--cd-primary)" }}
    >
      {showIcon && <Coins size={iconSizes[size]} />}
      {formatCredits(credits)}
      <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">cr</span>
    </span>
  );
}
