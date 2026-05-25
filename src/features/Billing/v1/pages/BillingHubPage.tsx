import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, CreditCard, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import CreditBadge from "../components/common/CreditBadge";
import { formatCredits } from "../utils/credits";
import QuickRecharge from "../components/layout/QuickRecharge";
import PayoutAccountDetails from "../components/layout/PayoutAccountDetails";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";

const LINKS = [
  {
    title: "Community Wallet",
    description: "View balance, transactions, and team usage",
    path: "/org/billing/wallet",
    icon: Wallet,
  },
  {
    title: "Add Funds",
    description: "Purchase credits with UPI, cards, or net banking",
    path: "/org/billing/add-funds",
    icon: CreditCard,
  },
  {
    title: "Usage Analytics",
    description: "Burn rate, forecasts, and feature breakdown",
    path: "/org/billing/usage",
    icon: BarChart3,
  },
];

export default function BillingHubPage() {
  const navigate = useNavigate();
  const { data: wallet } = useWallet();
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="w-full min-h-screen p-5 sm:p-8 lg:p-10"
      style={{
        background:
          "radial-gradient(circle at top left, var(--cd-primary-subtle), transparent 34rem), var(--cd-bg)",
      }}
    >
      <div className="mx-auto max-w-[1440px]">
        <section
          className="mb-6 overflow-hidden rounded-2xl border p-6 sm:p-8"
          style={{
            backgroundColor: "color-mix(in srgb, var(--cd-surface) 92%, transparent)",
            borderColor: "var(--cd-border-subtle)",
            boxShadow: "0 18px 48px var(--cd-shadow)",
          }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div
                className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--cd-accent-subtle)",
                  borderColor: "color-mix(in srgb, var(--cd-accent) 28%, transparent)",
                  color: "var(--cd-text)",
                }}
              >
                <Sparkles size={14} style={{ color: "var(--cd-accent)" }} />
                Credits command center
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl" style={{ color: "var(--cd-text)" }}>
                Billing & Credits
              </h1>
              <p className="mt-3 text-sm leading-6 sm:text-base" style={{ color: "var(--cd-text-2)" }}>
                Manage your community wallet, add funds, and track usage. Rs. 10 = 100 credits.
              </p>
            </div>

            <div
              className="grid min-w-[260px] gap-3 rounded-xl border p-4"
              style={{
                backgroundColor: "var(--cd-bg)",
                borderColor: "var(--cd-border-subtle)",
              }}
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--cd-text-muted)" }}>
                <ShieldCheck size={15} style={{ color: "var(--cd-success)" }} />
                Secure wallet
              </div>
              {wallet ? <CreditBadge credits={wallet.availableCredits} size="lg" /> : null}
              <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                Fast recharge, usage visibility, and payout details in one place.
              </p>
            </div>
          </div>
        </section>

        {wallet && (
          <div
            className="rounded-2xl border p-5 mb-6 sm:p-6"
            style={{
              backgroundColor: "color-mix(in srgb, var(--cd-surface) 94%, transparent)",
              borderColor: "var(--cd-border-subtle)",
              boxShadow: "0 12px 34px var(--cd-shadow)",
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--cd-text-muted)" }}>
                  Available balance
                </p>
                <CreditBadge credits={wallet.availableCredits} size="lg" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["Pending", wallet.pendingCredits],
                  ["Reserved", wallet.reservedCredits],
                  ["Locked", wallet.lockedCredits],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg px-3 py-2" style={{ backgroundColor: "var(--cd-surface-2)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--cd-text-muted)" }}>
                      {label}
                    </p>
                    <p className="text-sm font-bold" style={{ color: "var(--cd-text)" }}>
                      {formatCredits(Number(value))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="group rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{
                backgroundColor: "var(--cd-surface)",
                borderColor: "var(--cd-border-subtle)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" }}
                >
                  <link.icon size={22} />
                </span>
                <ArrowRight
                  size={18}
                  className="translate-x-0 opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  style={{ color: "var(--cd-primary)" }}
                />
              </div>
              <h2 className="font-bold mt-5" style={{ color: "var(--cd-text)" }}>
                {link.title}
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--cd-text-muted)" }}>
                {link.description}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PayoutAccountDetails />
          <QuickRecharge />
        </div>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
