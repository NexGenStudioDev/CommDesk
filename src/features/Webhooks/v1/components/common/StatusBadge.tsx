import { WebhookStatus } from "../../Webhook.types";

export default function StatusBadge({ status, className = "" }: { status: WebhookStatus; className?: string }) {
  const isAct = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide border ${className}`}
      style={{
        backgroundColor: isAct ? "var(--cd-success-subtle)" : "var(--cd-surface-3)",
        color: isAct ? "var(--cd-success)" : "var(--cd-text-muted)",
        borderColor: isAct ? "var(--cd-success-subtle)" : "var(--cd-border)",
      }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isAct ? "bg-[var(--cd-success)]" : "bg-[var(--cd-text-muted)]"}`} />
      {isAct ? "Active" : "Inactive"}
    </span>
  );
}
