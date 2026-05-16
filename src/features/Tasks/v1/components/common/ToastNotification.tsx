import { useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const TOAST_CONFIG: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; bg: string; border: string; iconClass: string; bar: string }
> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-white",
    border: "border-emerald-200",
    iconClass: "text-emerald-500",
    bar: "bg-emerald-400",
  },
  error: {
    icon: XCircle,
    bg: "bg-white",
    border: "border-red-200",
    iconClass: "text-red-500",
    bar: "bg-red-400",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-white",
    border: "border-amber-200",
    iconClass: "text-amber-500",
    bar: "bg-amber-400",
  },
  info: {
    icon: Info,
    bg: "bg-white",
    border: "border-indigo-200",
    iconClass: "text-indigo-500",
    bar: "bg-indigo-400",
  },
};

const AUTO_DISMISS_MS = 4500;

// ─── Single toast ─────────────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const cfg = TOAST_CONFIG[toast.variant];
  const Icon = cfg.icon;
  const barRef = useRef<HTMLDivElement>(null);

  // Animate progress bar shrink
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.width = "100%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `width ${AUTO_DISMISS_MS}ms linear`;
        el.style.width = "0%";
      });
    });

    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`
        relative flex items-start gap-3 w-80 rounded-xl border shadow-lg overflow-hidden
        ${cfg.bg} ${cfg.border}
        animate-in slide-in-from-right-4 fade-in duration-300
      `}
    >
      {/* Progress bar */}
      <div
        ref={barRef}
        className={`absolute bottom-0 left-0 h-[3px] ${cfg.bar}`}
        style={{ width: "100%" }}
      />

      <div className="flex items-start gap-3 p-4 w-full">
        <Icon size={18} className={`shrink-0 mt-0.5 ${cfg.iconClass}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
          {toast.message && (
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 p-0.5 text-gray-400 hover:text-gray-600 rounded transition"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────
export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((variant: ToastVariant, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, variant, title, message }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismiss };
}
