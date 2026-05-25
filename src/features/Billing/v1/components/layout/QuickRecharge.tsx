import { useState } from "react";
import { CreditCard, Loader2, Zap } from "lucide-react";
import Input from "@/Component/ui/Input";
import { formatRupees, buildAddFundsPreview, formatCredits } from "../../utils/credits";
import { useAddFunds } from "../../hooks/useWallet";
import { useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import { MIN_ADD_RUPEES } from "../../constants/billing.constants";

export default function QuickRecharge() {
  const addFunds = useAddFunds();
  const { addToast } = useToast();
  const [amountStr, setAmountStr] = useState("500");

  const handleRecharge = async () => {
    const amt = Number(amountStr) || 0;
    if (amt < MIN_ADD_RUPEES) {
      addToast("error", "Invalid Amount", `Minimum recharge is Rs. ${MIN_ADD_RUPEES}`);
      return;
    }

    try {
      await addFunds.mutateAsync({
        amountRupees: amt,
        paymentMethod: "upi",
        idempotencyKey: `quick-${crypto.randomUUID()}`
      });
      addToast("success", "Recharge Successful", `Added ${formatCredits(amt * 10)} credits.`);
    } catch {
      addToast("error", "Recharge Failed", "Please try again later.");
    }
  };

  const preview = buildAddFundsPreview(Number(amountStr) || 0);

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
        boxShadow: "0 14px 34px var(--cd-shadow)",
      }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black" style={{ color: "var(--cd-text)" }}>Quick Recharge</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--cd-text-muted)" }}>Top up instantly with UPI.</p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary)" }}>
          <Zap size={20} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {[150, 500, 1000].map((amt) => {
          const selected = amountStr === amt.toString();
          return (
            <button
              key={amt}
              onClick={() => setAmountStr(amt.toString())}
              className="min-h-16 rounded-xl border px-2 py-2 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: selected ? "var(--cd-primary-subtle)" : "var(--cd-bg)",
                borderColor: selected ? "var(--cd-primary)" : "var(--cd-border-subtle)",
                color: selected ? "var(--cd-primary-text)" : "var(--cd-text)",
              }}
            >
              Rs. {amt}
              {amt === 500 && <span className="block text-[10px] opacity-70">Popular</span>}
            </button>
          );
        })}
      </div>

      <Input
        label="Custom Amount (Rs.)"
        name="amount"
        type="text"
        value={amountStr}
        onChange={(_, val) => {
          const digitsOnly = val.replace(/\D/g, "");
          const cleanVal = digitsOnly.replace(/^0+(?=\d)/, "");
          setAmountStr(cleanVal);
        }}
        className="w-full !mb-5"
        inputClassName="font-semibold"
      />

      <div
        className="mb-5 rounded-xl border p-4"
        style={{ backgroundColor: "var(--cd-bg)", borderColor: "var(--cd-border-subtle)" }}
      >
        <div className="flex justify-between items-center text-sm">
          <span style={{ color: "var(--cd-text-muted)" }}>You get</span>
          <span className="font-black" style={{ color: "var(--cd-primary)" }}>{formatCredits(preview.totalCredits)} cr</span>
        </div>
        <div className="mt-2 flex justify-between items-center text-xs">
          <span style={{ color: "var(--cd-text-muted)" }}>Payable</span>
          <span className="font-semibold" style={{ color: "var(--cd-text)" }}>{formatRupees(preview.totalPayableRupees)}</span>
        </div>
      </div>

      <button
        onClick={() => void handleRecharge()}
        disabled={addFunds.isPending}
        className="cd-btn cd-btn-primary w-full rounded-xl py-2.5 font-bold flex justify-center items-center gap-2"
      >
        {addFunds.isPending ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
        {addFunds.isPending ? "Processing..." : `Pay ${formatRupees(preview.totalPayableRupees)}`}
      </button>
    </div>
  );
}
