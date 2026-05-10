import { useEffect, useRef } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  danger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  danger = false,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel on open & close on Escape
  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={() => !isLoading && onCancel()}
      />

      {/* Dialog */}
      <div 
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--cd-text-muted)] hover:bg-[var(--cd-hover)] hover:text-[var(--cd-text)] transition disabled:opacity-40"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div
              className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                danger ? "bg-[var(--cd-danger-subtle)]" : "bg-[var(--cd-primary-subtle)]"
              }`}
            >
              <AlertTriangle
                size={22}
                className={danger ? "text-[var(--cd-danger)]" : "text-[var(--cd-primary)]"}
              />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <h3 className="text-lg font-bold text-[var(--cd-text)] leading-tight">{title}</h3>
              <p className="text-sm text-[var(--cd-text-2)] leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              ref={cancelRef}
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-[var(--cd-border)] text-sm font-bold text-[var(--cd-text-2)] hover:bg-[var(--cd-hover)] hover:text-[var(--cd-text)] transition-all active:scale-95 disabled:opacity-40"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 shadow-sm disabled:opacity-60 ${
                danger
                  ? "bg-[var(--cd-danger)] hover:opacity-90 shadow-[var(--cd-danger-subtle)]"
                  : "bg-[var(--cd-primary)] hover:opacity-90 shadow-[var(--cd-primary-subtle)]"
              }`}
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}