import { format } from "date-fns";
import type { CreditTransaction } from "../../Billing.types";
import TransactionTypeBadge from "../common/TransactionTypeBadge";
import { formatCredits } from "../../utils/credits";

interface Props {
  transactions: CreditTransaction[];
  isLoading: boolean;
}

export default function TransactionTable({ transactions, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--cd-text-muted)" }}>
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) return null;

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr
            className="border-b"
            style={{
              borderColor: "var(--cd-border-subtle)",
              backgroundColor: "var(--cd-surface-2)",
            }}
          >
            <th className="px-5 py-4 font-semibold" style={{ color: "var(--cd-text-muted)" }}>
              Type
            </th>
            <th className="px-5 py-4 font-semibold" style={{ color: "var(--cd-text-muted)" }}>
              Source
            </th>
            <th className="px-5 py-4 font-semibold text-right" style={{ color: "var(--cd-text-muted)" }}>
              Credits
            </th>
            <th className="px-5 py-4 font-semibold text-right" style={{ color: "var(--cd-text-muted)" }}>
              Balance
            </th>
            <th className="px-5 py-4 font-semibold" style={{ color: "var(--cd-text-muted)" }}>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isDebit = tx.credits < 0;
            return (
              <tr
                key={tx.id}
                className="border-b transition-colors hover:bg-[var(--cd-hover)]"
                style={{ borderColor: "var(--cd-border-subtle)" }}
              >
                <td className="px-5 py-4">
                  <TransactionTypeBadge type={tx.transactionType} />
                </td>
                <td className="px-5 py-4 font-medium" style={{ color: "var(--cd-text)" }}>
                  {tx.source}
                </td>
                <td
                  className="px-5 py-4 text-right font-semibold tabular-nums"
                  style={{ color: isDebit ? "var(--cd-danger)" : "var(--cd-success)" }}
                >
                  {isDebit ? "" : "+"}
                  {formatCredits(Math.abs(tx.credits))}
                </td>
                <td
                  className="px-5 py-4 text-right tabular-nums"
                  style={{ color: "var(--cd-text-muted)" }}
                >
                  {formatCredits(tx.balanceAfter)}
                </td>
                <td className="px-5 py-4 text-xs" style={{ color: "var(--cd-text-muted)" }}>
                  {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
