import { format } from "date-fns";
import type { CreditTransaction } from "../../Billing.types";
import TransactionTypeBadge from "../common/TransactionTypeBadge";
import { formatCredits } from "../../utils/credits";

interface Props {
  transactions: CreditTransaction[];
  isLoading: boolean;
}

export default function TransactionCardList({ transactions, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm" style={{ color: "var(--cd-text-muted)" }}>
        Loading...
      </div>
    );
  }

  if (transactions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((tx) => {
        const isDebit = tx.credits < 0;
        return (
          <div
            key={tx.id}
            className="rounded-xl border p-4"
            style={{
              backgroundColor: "var(--cd-surface)",
              borderColor: "var(--cd-border-subtle)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <TransactionTypeBadge type={tx.transactionType} />
              <span
                className="font-bold tabular-nums"
                style={{ color: isDebit ? "var(--cd-danger)" : "var(--cd-success)" }}
              >
                {isDebit ? "-" : "+"}
                {formatCredits(Math.abs(tx.credits))}
              </span>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--cd-text)" }}>
              {tx.source}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--cd-text-muted)" }}>
              Balance: {formatCredits(tx.balanceAfter)} ·{" "}
              {format(new Date(tx.createdAt), "MMM d, HH:mm")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
