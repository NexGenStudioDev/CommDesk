import { useNavigate } from "react-router-dom";
import { Plus, Wallet, ArrowLeft, BarChart3, ReceiptText, Users } from "lucide-react";
import type { Wallet as WalletType } from "../../Billing.types";
import CreditBadge from "../common/CreditBadge";
import { formatCredits } from "../../utils/credits";

interface Props {
  wallet: WalletType | undefined;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddFunds: () => void;
}

const TABS = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "transactions", label: "Transactions", icon: ReceiptText },
  { key: "team", label: "Team Usage", icon: Users },
];

export default function WalletHeader({ wallet, activeTab, onTabChange, onAddFunds }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="border-b transition-all duration-300"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--cd-surface) 96%, transparent), color-mix(in srgb, var(--cd-primary-subtle) 42%, var(--cd-surface)))",
        borderColor: "var(--cd-border-subtle)",
        boxShadow: "0 14px 34px var(--cd-shadow)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => navigate("/org/billing")}
              className="hidden rounded-lg p-2 transition-colors hover:bg-[var(--cd-hover)] sm:block"
              aria-label="Go back to billing hub"
              style={{ color: "var(--cd-text-muted)" }}
            >
              <ArrowLeft size={18} />
            </button>
            <WalletIconBox />
            <WalletTitle wallet={wallet} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/org/billing/usage")}
              className="cd-btn cd-btn-secondary h-10 rounded-lg px-4 text-sm hidden sm:inline-flex"
            >
              Usage
            </button>
            <button
              onClick={onAddFunds}
              className="cd-btn cd-btn-primary h-10 rounded-lg px-4 text-sm font-semibold shadow-none transition-all hover:-translate-y-0.5"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add Funds</span>
            </button>
          </div>
        </div>

        <div
          className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border p-1 sm:w-fit"
          style={{ backgroundColor: "var(--cd-bg)", borderColor: "var(--cd-border-subtle)" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-all whitespace-nowrap sm:px-4"
                style={{
                  backgroundColor: isActive ? "var(--cd-surface)" : "transparent",
                  boxShadow: isActive ? "0 8px 18px var(--cd-shadow)" : "none",
                  color: isActive ? "var(--cd-text)" : "var(--cd-text-muted)",
                }}
              >
                <tab.icon size={15} style={{ color: isActive ? "var(--cd-primary)" : "currentColor" }} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WalletIconBox() {
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{
        backgroundColor: "var(--cd-primary)",
        color: "#ffffff",
        boxShadow: "0 12px 24px color-mix(in srgb, var(--cd-primary) 28%, transparent)",
      }}
    >
      <Wallet size={20} strokeWidth={2.25} />
    </div>
  );
}

function WalletTitle({ wallet }: { wallet: WalletType | undefined }) {
  return (
    <div className="min-w-0">
      <h1
        className="truncate text-xl font-black leading-tight tracking-tight sm:text-2xl"
        style={{ color: "var(--cd-text)" }}
      >
        Community Wallet
      </h1>
      <div className="mt-1 truncate text-sm flex items-center gap-1 flex-wrap" style={{ color: "var(--cd-text-2)" }}>
        {wallet ? (
          <>
            <CreditBadge credits={wallet.availableCredits} size="sm" />
            <span>available - {formatCredits(wallet.reservedCredits)} reserved</span>
          </>
        ) : (
          "Manage credits, billing, and usage"
        )}
      </div>
    </div>
  );
}
