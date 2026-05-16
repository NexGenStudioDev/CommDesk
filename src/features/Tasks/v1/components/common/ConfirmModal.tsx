import { useEffect, useRef } from "react";
import {
  AlertTriangle,
  X,
  Loader2,
  CheckCircle2,
  Info,
  AlertCircle,
  LucideIcon,
} from "lucide-react";

type ModalVariant = "danger" | "success" | "warning" | "info";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: ModalVariant;
  icon?: LucideIcon;
}

const VARIANT_CONFIG = {
  danger: {
    bg: "bg-[var(--cd-danger-subtle)]",
    text: "text-[var(--cd-danger)]",
    btn: "bg-[var(--cd-danger)] hover:bg-[var(--cd-danger-text)]",
    icon: AlertTriangle,
  },
  success: {
    bg: "bg-[var(--cd-success-subtle)]",
    text: "text-[var(--cd-success)]",
    btn: "bg-[var(--cd-success)] hover:bg-[var(--cd-success-text)]",
    icon: CheckCircle2,
  },
  warning: {
    bg: "bg-[var(--cd-warning-subtle)]",
    text: "text-[var(--cd-warning)]",
    btn: "bg-[var(--cd-warning)] hover:bg-[var(--cd-warning-text)]",
    icon: AlertCircle,
  },
  info: {
    bg: "bg-[var(--cd-primary-subtle)]",
    text: "text-[var(--cd-primary)]",
    btn: "bg-[var(--cd-primary)] hover:bg-[var(--cd-primary-text)]",
    icon: Info,
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "info",
  icon: CustomIcon,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const config = VARIANT_CONFIG[variant];
  const Icon = CustomIcon || config.icon;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={() => !isLoading && onCancel()}
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
      >
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--cd-text-muted)] hover:bg-[var(--cd-hover)] hover:text-[var(--cd-text)] transition disabled:opacity-40"
        >
          <X size={16} />
        </button>

        <div className="p-6 pt-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div
              className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${config.bg}`}
            >
              <Icon size={28} className={config.text} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-[var(--cd-text)] leading-tight">{title}</h3>
              <p className="text-[var(--cd-text-2)] leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button
              ref={cancelRef}
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-5 py-3 rounded-xl border border-[var(--cd-border)] text-sm font-bold text-[var(--cd-text-2)] hover:bg-[var(--cd-hover)] hover:text-[var(--cd-text)] transition-all active:scale-95 disabled:opacity-40"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 shadow-sm disabled:opacity-60 ${config.btn}`}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
