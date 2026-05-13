import { Trash2, ShieldCheck, ShieldAlert, X } from "lucide-react";

interface Props {
  selectedCount: number;
  onClear: () => void;
  onAction: (action: "delete" | "enable" | "disable") => void;
}

export default function BulkActionBar({ selectedCount, onClear, onAction }: Props) {
  if (selectedCount === 0) return null;

  return (
    <div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{ 
        backgroundColor: "var(--cd-surface)", 
        borderColor: "var(--cd-border)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--cd-border)"
      }}
    >
      <div className="flex items-center gap-4 border-r pr-6" style={{ borderColor: "var(--cd-border-subtle)" }}>
        <button 
          onClick={onClear}
          className="p-1 rounded-md hover:bg-[var(--cd-hover)] transition-colors"
          style={{ color: "var(--cd-text-muted)" }}
        >
          <X size={18} />
        </button>
        <span className="text-sm font-bold" style={{ color: "var(--cd-text)" }}>
          {selectedCount} Selected
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onAction("enable")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--cd-success-subtle)]"
          style={{ color: "var(--cd-success)" }}
        >
          <ShieldCheck size={18} /> Enable
        </button>
        <button
          onClick={() => onAction("disable")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--cd-warning-subtle)]"
          style={{ color: "var(--cd-warning)" }}
        >
          <ShieldAlert size={18} /> Disable
        </button>
        <button
          onClick={() => onAction("delete")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--cd-danger-subtle)]"
          style={{ color: "var(--cd-danger)" }}
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>
    </div>
  );
}
