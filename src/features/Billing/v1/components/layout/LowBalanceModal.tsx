import { useEffect, useRef } from "react";
import { AlertTriangle, X, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCredits } from "../../utils/credits";

interface Props {
  isOpen: boolean;
  availableCredits: number;
  threshold: number;
  onDismiss: () => void;
  onAddFunds?: () => void;
}

export default function LowBalanceModal({ isOpen, availableCredits, threshold, onDismiss, onAddFunds }: Props) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  const exhausted = availableCredits <= 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onDismiss} />
      <div
        ref={ref}
        className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in slide-in-from-bottom-4"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: exhausted ? "var(--cd-danger)" : "var(--cd-warning)",
        }}
      >
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--cd-hover)]"
        >
          <X size={18} style={{ color: "var(--cd-text-muted)" }} />
        </button>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{
            backgroundColor: exhausted ? "var(--cd-danger-subtle)" : "var(--cd-warning-subtle)",
          }}
        >
          <AlertTriangle
            size={24}
            style={{ color: exhausted ? "var(--cd-danger)" : "var(--cd-warning)" }}
          />
        </div>

        <h2 className="text-lg font-bold mb-2" style={{ color: "var(--cd-text)" }}>
          <span data-testid="low-balance-modal-title">
            {exhausted ? "Credits Exhausted" : "Low Balance"}
          </span>
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--cd-text-muted)" }}>
          {exhausted
            ? "Premium features are paused. Core community access remains available. Add funds to restore full functionality."
            : `You have ${formatCredits(availableCredits)} credits remaining (threshold: ${formatCredits(threshold)}). Add funds to avoid service interruption.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (onAddFunds) {
                onAddFunds();
              } else {
                navigate("/org/billing/add-funds");
              }
              onDismiss();
            }}
            data-testid="low-balance-add-funds"
            className="cd-btn cd-btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
          >
            <Wallet size={16} /> Add Funds
          </button>
          {!exhausted && (
            <button
              onClick={onDismiss}
              className="cd-btn cd-btn-secondary flex-1 py-2.5 rounded-xl border"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
