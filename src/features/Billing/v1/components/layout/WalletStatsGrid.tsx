import { Activity, Clock, Coins, Lock } from "lucide-react";
import type { Wallet } from "../../Billing.types";
import { formatCredits } from "../../utils/credits";

interface Props {
  wallet: Wallet;
  burnRatePerDay?: number;
}

export default function WalletStatsGrid({ wallet, burnRatePerDay = 52 }: Props) {
  const testIdFor = (label: string) =>
    `wallet-stat-${label.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "")}`;

  const stats = [
    {
      label: "Available",
      val: formatCredits(wallet.availableCredits),
      icon: Coins,
      color: "var(--cd-primary)",
    },
    {
      label: "Reserved",
      val: formatCredits(wallet.reservedCredits),
      icon: Lock,
      color: "var(--cd-warning)",
    },
    {
      label: "Burn Rate / day",
      val: formatCredits(burnRatePerDay),
      icon: Activity,
      color: "var(--cd-text)",
    },
    {
      label: "Lifetime Used",
      val: formatCredits(wallet.lifetimeUsedCredits),
      icon: Clock,
      color: "var(--cd-success)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          data-testid={testIdFor(stat.label)}
          className="group rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
          style={{
            backgroundColor: "var(--cd-surface)",
            borderColor: "var(--cd-border-subtle)",
          }}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--cd-text-muted)] opacity-70">
              {stat.label}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--cd-bg)" }}>
              <stat.icon size={16} style={{ color: stat.color }} />
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span
              data-testid={`${testIdFor(stat.label)}-value`}
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--cd-text)" }}
            >
              {stat.val}
            </span>
            <span className="mb-1 text-xs font-semibold" style={{ color: "var(--cd-text-muted)" }}>credits</span>
          </div>
        </div>
      ))}
    </div>
  );
}

