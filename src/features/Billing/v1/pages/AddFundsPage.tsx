import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { RECHARGE_PACKS, MIN_ADD_RUPEES } from "../constants/billing.constants";
import { buildAddFundsPreview, formatCredits, formatRupees, validateMinAddFunds } from "../utils/credits";
import { useAddFunds } from "../hooks/useWallet";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import type { PaymentState } from "../Billing.types";
import Input from "@/Component/ui/Input";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "debit", label: "Debit Card", icon: CreditCard },
  { id: "credit", label: "Credit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
  { id: "wallet", label: "Wallets", icon: Wallet },
] as const;

export default function AddFundsPage() {
  const navigate = useNavigate();
  const { toasts, addToast, dismiss } = useToast();
  const addFunds = useAddFunds();

  const [amountStr, setAmountStr] = useState("500");
  const amount = Number(amountStr) || 0;
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]["id"]>("upi");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [forceFail, setForceFail] = useState(false);

  const preview = buildAddFundsPreview(amount);
  const validation = validateMinAddFunds(amount);

  const handlePay = async () => {
    if (!validation.valid) {
      addToast("error", "Invalid amount", validation.error ?? "Check amount");
      return;
    }

    setPaymentState("processing");
    try {
      await addFunds.mutateAsync({
        amountRupees: amount,
        paymentMethod,
        idempotencyKey: `pay-${crypto.randomUUID()}${forceFail ? "-fail" : ""}`,
      });
      setPaymentState("success");
      addToast("success", "Payment successful", `${formatCredits(preview.totalCredits)} credits added.`);
    } catch {
      setPaymentState("failed");
      addToast("error", "Payment failed", "Please try again or use a different method.");
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(circle at top right, var(--cd-accent-subtle), transparent 32rem), var(--cd-bg)",
      }}
    >
      <div
        className="border-b px-5 py-5 sm:px-8 lg:px-10"
        style={{
          backgroundColor: "color-mix(in srgb, var(--cd-surface) 94%, transparent)",
          borderColor: "var(--cd-border-subtle)",
          boxShadow: "0 10px 28px var(--cd-shadow)",
        }}
      >
        <div className="mx-auto max-w-[1440px] flex items-center gap-4">
          <button
            onClick={() => navigate("/org/billing/wallet")}
            className="p-2 rounded-lg hover:bg-[var(--cd-hover)]"
            aria-label="Back to wallet"
          >
            <ArrowLeft size={18} style={{ color: "var(--cd-text-muted)" }} />
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--cd-primary)", color: "#fff" }}>
            <Wallet size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--cd-text)" }}>
              Add Funds
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cd-text-muted)" }}>
              Choose a pack, confirm credits, and complete payment.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10">
        {paymentState === "success" ? (
          <SuccessState
            credits={preview.totalCredits}
            onDone={() => navigate("/org/billing/wallet")}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div className="flex flex-col gap-6">
              <section>
                <SectionLabel title="Recharge packs" description="Pick a preset or enter a custom amount." />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                  {RECHARGE_PACKS.map((pack) => {
                    const isSelected = amount === pack.amountRupees;
                    return (
                      <button
                        key={pack.id}
                        onClick={() => setAmountStr(pack.amountRupees.toString())}
                        className="group min-h-[142px] rounded-2xl border p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                        style={{
                          backgroundColor: isSelected ? "var(--cd-primary-subtle)" : "var(--cd-surface)",
                          borderColor: isSelected ? "var(--cd-primary)" : "var(--cd-border-subtle)",
                          boxShadow: isSelected ? "0 14px 28px var(--cd-shadow)" : "none",
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--cd-text-muted)" }}>
                            {pack.label}
                          </p>
                          {isSelected ? <BadgeCheck size={18} style={{ color: "var(--cd-primary)" }} /> : null}
                        </div>
                        <p className="text-2xl font-black mt-4" style={{ color: "var(--cd-text)" }}>
                          {formatRupees(pack.amountRupees)}
                        </p>
                        <p className="text-sm font-semibold mt-2" style={{ color: "var(--cd-primary)" }}>
                          {formatCredits(pack.baseCredits + pack.bonusCredits)} cr
                        </p>
                        {pack.bonusCredits > 0 && (
                          <span
                            className="mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold"
                            style={{ backgroundColor: "var(--cd-success-subtle)", color: "var(--cd-success)" }}
                          >
                            +{formatCredits(pack.bonusCredits)} bonus
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section
                className="rounded-2xl border p-5"
                style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
              >
                <Input
                  label={`Custom amount (Rs., min ${MIN_ADD_RUPEES})`}
                  name="amount"
                  type="number"
                  value={amountStr}
                  onChange={(_, val) => {
                    const digitsOnly = val.replace(/\D/g, "");
                    const cleanVal = digitsOnly.replace(/^0+(?=\d)/, "");
                    setAmountStr(cleanVal);
                  }}
                  leftIcon={<Banknote size={18} />}
                  error={validation.valid ? undefined : validation.error ?? undefined}
                  className="w-full !mb-0"
                  inputClassName="!text-lg !font-bold"
                />
              </section>

              <section>
                <SectionLabel title="Payment method" description="Select how you want to complete this recharge." />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {PAYMENT_METHODS.map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className="rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5"
                        style={{
                          backgroundColor: isSelected ? "var(--cd-primary-subtle)" : "var(--cd-surface)",
                          borderColor: isSelected ? "var(--cd-primary)" : "var(--cd-border-subtle)",
                          color: isSelected ? "var(--cd-primary-text)" : "var(--cd-text)",
                          boxShadow: isSelected ? "0 10px 22px var(--cd-shadow)" : "none",
                        }}
                      >
                        <m.icon size={19} />
                        <span className="mt-3 block text-sm font-bold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <div
                className="border border-dashed p-4 rounded-xl flex items-center justify-between mt-2"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.05)",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                }}
              >
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--cd-danger)" }}>
                    Simulation Mode
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cd-text-muted)" }}>
                    Force transaction failure for E2E testing
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={forceFail}
                  onChange={(e) => setForceFail(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-red-500"
                  id="force-fail-checkbox"
                />
              </div>
            </div>

            <aside className="lg:sticky lg:top-6">
              <PreviewCard preview={preview} />
              <button
                onClick={() => void handlePay()}
                disabled={!validation.valid || addFunds.isPending || paymentState === "processing"}
                className="cd-btn cd-btn-primary mt-4 w-full py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addFunds.isPending || paymentState === "processing" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>Pay {formatRupees(preview.totalPayableRupees)}</>
                )}
              </button>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs" style={{ color: "var(--cd-text-muted)" }}>
                <ShieldCheck size={14} style={{ color: "var(--cd-success)" }} />
                Encrypted payment simulation
              </div>
            </aside>
          </div>
        )}
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

function SectionLabel({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-black uppercase tracking-wide" style={{ color: "var(--cd-text)" }}>
        {title}
      </h2>
      <p className="mt-1 text-xs" style={{ color: "var(--cd-text-muted)" }}>
        {description}
      </p>
    </div>
  );
}

function PreviewCard({ preview }: { preview: ReturnType<typeof buildAddFundsPreview> }) {
  const rows = [
    { label: "You pay", value: formatRupees(preview.amountRupees) },
    { label: "GST (18%)", value: formatRupees(preview.gstRupees) },
    { label: "Platform fee", value: formatRupees(preview.platformFeeRupees) },
    { label: "Base credits", value: formatCredits(preview.baseCredits) },
    ...(preview.bonusCredits > 0
      ? [{ label: "Bonus credits", value: `+${formatCredits(preview.bonusCredits)}` }]
      : []),
  ];

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
        boxShadow: "0 18px 38px var(--cd-shadow)",
      }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black" style={{ color: "var(--cd-text)" }}>
            Order summary
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--cd-text-muted)" }}>
            Review credits before payment.
          </p>
        </div>
        <div className="rounded-xl p-2.5" style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary)" }}>
          <CreditCard size={20} />
        </div>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 text-sm">
            <span style={{ color: "var(--cd-text-muted)" }}>{row.label}</span>
            <span className="font-semibold" style={{ color: "var(--cd-text)" }}>{row.value}</span>
          </div>
        ))}
        <div
          className="border-t pt-4 mt-4 flex justify-between gap-4 font-black"
          style={{ borderColor: "var(--cd-border-subtle)" }}
        >
          <span style={{ color: "var(--cd-text)" }}>Credits added</span>
          <span data-testid="credits-added-preview" style={{ color: "var(--cd-primary)" }}>
            {formatCredits(preview.totalCredits)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SuccessState({ credits, onDone }: { credits: number; onDone: () => void }) {
  return (
    <div
      className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border px-6 py-12 text-center"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
        boxShadow: "0 18px 44px var(--cd-shadow)",
      }}
    >
      <div className="rounded-full p-4" style={{ backgroundColor: "var(--cd-success-subtle)" }}>
        <CheckCircle2 size={48} style={{ color: "var(--cd-success)" }} />
      </div>
      <h2 className="text-2xl font-black mt-5" style={{ color: "var(--cd-text)" }}>
        Payment successful
      </h2>
      <p className="text-sm mt-2" style={{ color: "var(--cd-text-muted)" }}>
        {formatCredits(credits)} credits have been added to your wallet.
      </p>
      <button onClick={onDone} className="cd-btn cd-btn-primary mt-8 px-8 py-2.5 rounded-xl">
        Back to wallet
      </button>
    </div>
  );
}
