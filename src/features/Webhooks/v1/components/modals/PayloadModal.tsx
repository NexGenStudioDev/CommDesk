import { X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  payload: any;
}

export default function PayloadModal({ isOpen, onClose, title, payload }: Props) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        style={{ backgroundColor: "var(--cd-bg)", borderColor: "var(--cd-border)" }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--cd-border-subtle)" }}>
          <h2 className="text-lg font-bold" style={{ color: "var(--cd-text)" }}>{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--cd-hover)]"
            style={{ color: "var(--cd-text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-5 custom-scrollbar">
          <pre 
            className="text-xs p-4 rounded-xl border overflow-auto"
            style={{ 
              backgroundColor: "var(--cd-surface)", 
              borderColor: "var(--cd-border-subtle)",
              color: "var(--cd-text)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            }}
          >
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
