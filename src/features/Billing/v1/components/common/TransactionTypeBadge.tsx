import type { CreditTransactionType } from "../../Billing.types";

const STYLES: Record<CreditTransactionType, { bg: string; color: string; label: string }> = {
  CREDIT_PURCHASE: {
    bg: "var(--cd-success-subtle)",
    color: "var(--cd-success)",
    label: "Purchase",
  },
  USAGE_DEDUCTION: {
    bg: "var(--cd-danger-subtle)",
    color: "var(--cd-danger)",
    label: "Usage",
  },
  BONUS_CREDIT: {
    bg: "var(--cd-primary-subtle)",
    color: "var(--cd-primary)",
    label: "Bonus",
  },
  REFUND: { bg: "var(--cd-warning-subtle)", color: "var(--cd-warning)", label: "Refund" },
  PAYOUT_HOLD: { bg: "var(--cd-surface-3)", color: "var(--cd-text-muted)", label: "Hold" },
  PAYOUT_RELEASE: {
    bg: "var(--cd-surface-3)",
    color: "var(--cd-text-2)",
    label: "Release",
  },
  ADMIN_ADJUSTMENT: {
    bg: "var(--cd-surface-3)",
    color: "var(--cd-text-2)",
    label: "Admin",
  },
};

export default function TransactionTypeBadge({ type }: { type: CreditTransactionType }) {
  const style = STYLES[type];
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}
