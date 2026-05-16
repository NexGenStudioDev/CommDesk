import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

export default function MaskedSecret({ secret }: { secret: string }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const displaySecret = show ? secret : secret.replace(/./g, "•");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border group w-full"
      style={{
        backgroundColor: "var(--cd-surface-2)",
        borderColor: "var(--cd-border)",
      }}
    >
      <code
        className="font-mono text-sm truncate"
        style={{
          color: "var(--cd-text)",
          letterSpacing: show ? "normal" : "2px",
        }}
      >
        {displaySecret}
      </code>
      <div
        className="flex items-center border-l pl-2 ml-1"
        style={{ borderColor: "var(--cd-border)" }}
      >
        <button
          onClick={() => setShow(!show)}
          className="text-[var(--cd-text-muted)] hover:text-[var(--cd-text)] transition-colors p-1"
          title={show ? "Hide Secret" : "Show Secret"}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button
          onClick={copyToClipboard}
          className="text-[var(--cd-text-muted)] hover:text-[var(--cd-text)] transition-colors p-1"
          title="Copy Secret"
        >
          {copied ? <Check size={14} className="text-[var(--cd-success)]" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
