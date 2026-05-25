import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Wallet } from "../../Billing.types";
import Input from "@/Component/ui/Input";
import { useAutoRecharge } from "../../hooks/useWallet";
import { MIN_ADD_RUPEES } from "../../constants/billing.constants";

interface Props {
  wallet: Wallet;
  onSuccess?: () => void;
}

export default function AutoRechargePanel({ wallet, onSuccess }: Props) {
  const autoRecharge = useAutoRecharge();
  const [enabled, setEnabled] = useState(wallet.autoRechargeEnabled);
  const [threshold, setThreshold] = useState(wallet.autoRechargeThreshold);
  const [amount, setAmount] = useState(wallet.autoRechargeAmountRupees);

  const handleSave = async () => {
    await autoRecharge.mutateAsync({
      enabled,
      thresholdCredits: threshold,
      rechargeAmountRupees: amount,
    });
    onSuccess?.();
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
        boxShadow: "0 14px 34px var(--cd-shadow)",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw size={18} style={{ color: "var(--cd-primary)" }} />
            <h3 className="font-black" style={{ color: "var(--cd-text)" }}>
              Auto Recharge
            </h3>
          </div>
          <p className="mt-1 text-sm" style={{ color: "var(--cd-text-muted)" }}>
            Keep premium workflows running when credits run low.
          </p>
        </div>
      </div>

      <label
        className="flex items-center justify-between gap-3 rounded-xl border p-4 mb-4 cursor-pointer"
        style={{
          backgroundColor: enabled ? "var(--cd-primary-subtle)" : "var(--cd-bg)",
          borderColor: enabled ? "var(--cd-primary)" : "var(--cd-border-subtle)",
        }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--cd-text)" }}>
          Automatically recharge when balance drops below threshold
        </span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-4 h-4 rounded accent-[var(--cd-primary)]"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Input
          label="Threshold (credits)"
          name="threshold"
          type="number"
          value={threshold}
          onChange={(_, val) => setThreshold(Number(val) || 0)}
          disabled={!enabled}
          className="w-full !mb-0"
        />
        <Input
          label={`Recharge amount (Rs., min ${MIN_ADD_RUPEES})`}
          name="amount"
          type="number"
          value={amount}
          onChange={(_, val) => setAmount(Number(val) || 0)}
          disabled={!enabled}
          className="w-full !mb-0"
        />
      </div>

      <button
        onClick={() => void handleSave()}
        disabled={autoRecharge.isPending}
        className="cd-btn cd-btn-primary px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
      >
        {autoRecharge.isPending ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
