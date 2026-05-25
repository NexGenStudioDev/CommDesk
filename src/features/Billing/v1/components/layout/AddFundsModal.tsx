import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { MIN_ADD_RUPEES } from "../../constants/billing.constants";
import { useAddFunds } from "../../hooks/useWallet";
import { buildAddFundsPreview, formatCredits, formatRupees, validateMinAddFunds } from "../../utils/credits";
import type { AddFundsPayload, PaymentState } from "../../Billing.types";
import Input from "@/Component/ui/Input";

const PAYMENT_METHODS: Array<{
  id: AddFundsPayload["paymentMethod"];
  label: string;
  icon: typeof Smartphone;
}> = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "debit", label: "Debit Card", icon: CreditCard },
  { id: "credit", label: "Credit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
  { id: "wallet", label: "Wallets", icon: Wallet },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (credits: number) => void;
  onError?: (message: string) => void;
}

export default function AddFundsModal({ isOpen, onClose, onSuccess, onError }: Props) {
  const addFunds = useAddFunds();
  const [amountStr, setAmountStr] = useState("500");
  const [paymentMethod, setPaymentMethod] = useState<AddFundsPayload["paymentMethod"]>("upi");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");

  const amount = Number(amountStr) || 0;
  const preview = useMemo(() => buildAddFundsPreview(amount), [amount]);
  const validation = useMemo(() => validateMinAddFunds(amount), [amount]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && paymentState !== "processing") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, paymentState]);

  useEffect(() => {
    if (isOpen) setPaymentState("idle");
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!validation.valid) {
      onError?.(validation.error ?? "Check amount");
      return;
    }

    setPaymentState("processing");
    try {
      await addFunds.mutateAsync({
        amountRupees: amount,
        paymentMethod,
        idempotencyKey: `pay-${crypto.randomUUID()}`,
      });
      setPaymentState("success");
      onSuccess?.(preview.totalCredits);
    } catch {
      setPaymentState("failed");
      onError?.("Please try again or use a different payment method.");
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-5">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={() => paymentState !== "processing" && onClose()}
      />
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border shadow-2xl"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-funds-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={paymentState === "processing"}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 transition-colors hover:bg-[var(--cd-hover)] disabled:opacity-50"
          aria-label="Close add funds form"
        >
          <X size={18} style={{ color: "var(--cd-text-muted)" }} />
        </button>

        {paymentState === "success" ? (
          <SuccessContent credits={preview.totalCredits} onClose={onClose} />
        ) : (
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
            <form
              className="p-5 sm:p-6"
              onSubmit={(event) => {
                event.preventDefault();
                void handlePay();
              }}
            >
              <div className="pr-10">
                <p className="text-xs font-black uppercase tracking-wide" style={{ color: "var(--cd-primary)" }}>
                  Community wallet
                </p>
                <h2 id="add-funds-modal-title" className="mt-1 text-2xl font-black" style={{ color: "var(--cd-text)" }}>
                  Add Funds
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--cd-text-muted)" }}>
                  Enter an amount, review credits, then confirm payment details.
                </p>
              </div>

              <section className="mt-6">
                <SectionTitle title="Custom amount" />
                <Input
                  label={`Custom amount (Rs., min ${MIN_ADD_RUPEES})`}
                  name="amount"
                  type="number"
                  value={amountStr}
                  onChange={(_, val) => {
                    const digitsOnly = val.replace(/\D/g, "");
                    setAmountStr(digitsOnly.replace(/^0+(?=\d)/, ""));
                  }}
                  leftIcon={<Banknote size={18} />}
                  error={validation.valid ? undefined : validation.error ?? undefined}
                  className="w-full !mb-0"
                  inputClassName="!text-lg !font-bold"
                />
              </section>

              <section className="mt-6">
                <SectionTitle title="Credit calculator" />
                <div
                  className="grid gap-3 rounded-xl border p-4 sm:grid-cols-3"
                  style={{ backgroundColor: "var(--cd-bg)", borderColor: "var(--cd-border-subtle)" }}
                >
                  <GeneratedCreditTile label="Base credits" value={formatCredits(preview.baseCredits)} />
                  <GeneratedCreditTile
                    label="Bonus credits"
                    value={preview.bonusCredits > 0 ? `+${formatCredits(preview.bonusCredits)}` : "0"}
                  />
                  <GeneratedCreditTile label="Total credits" value={formatCredits(preview.totalCredits)} accent />
                </div>
              </section>

              <section className="mt-6">
                <SectionTitle title="Payment method" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className="min-h-20 rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5"
                        style={{
                          backgroundColor: isSelected ? "var(--cd-primary-subtle)" : "var(--cd-bg)",
                          borderColor: isSelected ? "var(--cd-primary)" : "var(--cd-border-subtle)",
                          color: isSelected ? "var(--cd-primary-text)" : "var(--cd-text)",
                        }}
                      >
                        <method.icon size={18} />
                        <span className="mt-2 block text-xs font-bold">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </form>

            <aside
              className="border-t p-5 sm:p-6 lg:border-l lg:border-t-0"
              style={{ backgroundColor: "var(--cd-bg)", borderColor: "var(--cd-border-subtle)" }}
            >
              <SectionTitle title="Pay details" />
              <div
                className="mt-3 rounded-xl border p-4"
                style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
              >
                <div className="space-y-3 text-sm">
                  <SummaryRow label="Wallet amount" value={formatRupees(preview.amountRupees)} />
                  <SummaryRow label="GST (18%)" value={formatRupees(preview.gstRupees)} />
                  <SummaryRow label="Platform fee" value={formatRupees(preview.platformFeeRupees)} />
                  <SummaryRow label="Base credits" value={formatCredits(preview.baseCredits)} />
                  {preview.bonusCredits > 0 ? (
                    <SummaryRow label="Bonus credits" value={`+${formatCredits(preview.bonusCredits)}`} accent />
                  ) : null}
                </div>
                <div
                  className="mt-4 border-t pt-4"
                  style={{ borderColor: "var(--cd-border-subtle)" }}
                >
                  <SummaryRow label="Credits added" value={formatCredits(preview.totalCredits)} accent strong />
                  <SummaryRow label="Total payable" value={formatRupees(preview.totalPayableRupees)} strong />
                </div>
              </div>

              {paymentState === "failed" ? (
                <div
                  className="mt-4 rounded-xl border p-3 text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--cd-danger-subtle)",
                    borderColor: "var(--cd-danger)",
                    color: "var(--cd-danger)",
                  }}
                >
                  Payment failed. Please try again or use a different method.
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => void handlePay()}
                disabled={!validation.valid || addFunds.isPending || paymentState === "processing"}
                className="cd-btn cd-btn-primary mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold disabled:opacity-50"
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
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="mb-3 text-sm font-black uppercase tracking-wide" style={{ color: "var(--cd-text)" }}>
      {title}
    </h3>
  );
}

function GeneratedCreditTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className="min-h-24 rounded-xl border p-4"
      style={{
        backgroundColor: accent ? "var(--cd-primary-subtle)" : "var(--cd-surface)",
        borderColor: accent ? "var(--cd-primary)" : "var(--cd-border-subtle)",
      }}
    >
      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--cd-text-muted)" }}>
        {label}
      </span>
      <span className="mt-3 block text-2xl font-black" style={{ color: accent ? "var(--cd-primary)" : "var(--cd-text)" }}>
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
  strong = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "font-bold" : ""} style={{ color: "var(--cd-text-muted)" }}>
        {label}
      </span>
      <span
        className={strong ? "font-black" : "font-semibold"}
        style={{ color: accent ? "var(--cd-primary)" : "var(--cd-text)" }}
      >
        {value}
      </span>
    </div>
  );
}

function SuccessContent({ credits, onClose }: { credits: number; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="rounded-full p-4" style={{ backgroundColor: "var(--cd-success-subtle)" }}>
        <CheckCircle2 size={48} style={{ color: "var(--cd-success)" }} />
      </div>
      <h2 className="mt-5 text-2xl font-black" style={{ color: "var(--cd-text)" }}>
        Payment successful
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--cd-text-muted)" }}>
        {formatCredits(credits)} credits have been added to your wallet.
      </p>
      <button type="button" onClick={onClose} className="cd-btn cd-btn-primary mt-8 rounded-xl px-8 py-2.5">
        Done
      </button>
    </div>
  );
}
