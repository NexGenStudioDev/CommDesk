import { Edit, Trash2, Webhook as WebhookIcon, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Webhook } from "../../Webhook.types";
import StatusBadge from "../common/StatusBadge";

interface Props {
  webhooks: Webhook[];
  isLoading: boolean;
  onDelete: (w: Webhook) => void;
  onToggleStatus: (w: Webhook) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export default function WebhookCardList({
  webhooks,
  isLoading,
  onDelete,
  onToggleStatus,
  selectedIds,
  onToggleSelect,
}: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--cd-text-muted)" }}>
        Loading webhooks...
      </div>
    );
  }

  if (webhooks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 px-4 sm:px-6">
      {webhooks.map((w) => (
        <div
          key={w.id}
          className={`rounded-xl border p-4 transition-all hover:shadow-md relative ${selectedIds.includes(w.id) ? "bg-[var(--cd-hover)] border-[var(--cd-primary)]" : ""}`}
          style={{
            backgroundColor: selectedIds.includes(w.id) ? undefined : "var(--cd-surface)",
            borderColor: selectedIds.includes(w.id) ? undefined : "var(--cd-border)",
          }}
        >
          <div className="absolute top-4 right-4 z-10">
            <input
              type="checkbox"
              checked={selectedIds.includes(w.id)}
              onChange={() => onToggleSelect(w.id)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="flex items-start justify-between mb-3">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/org/dashboard/webhooks/${w.id}`)}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary)" }}
              >
                <WebhookIcon size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--cd-text)]">{w.name}</h3>
                <p className="text-xs font-mono text-[var(--cd-text-muted)] truncate max-w-[200px]">
                  {w.url.replace(/^https?:\/\//, "")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StatusBadge status={w.status} />
            <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-[var(--cd-surface-2)] text-[var(--cd-text-2)]">
              {w.events.length} Events
            </span>
          </div>

          <div
            className="border-t pt-3 flex items-center justify-between"
            style={{ borderColor: "var(--cd-border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--cd-text-muted)]">Last:</span>
              <span
                className={`text-xs font-semibold ${w.lastDeliveryStatus === "success" ? "text-[var(--cd-success)]" : w.lastDeliveryStatus === "failed" ? "text-[var(--cd-danger)]" : "text-[var(--cd-text-muted)]"}`}
              >
                {w.lastDeliveryStatus
                  ? w.lastDeliveryStatus.charAt(0).toUpperCase() + w.lastDeliveryStatus.slice(1)
                  : "None"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleStatus(w)}
                className="p-2 rounded-lg bg-[var(--cd-surface-2)] hover:bg-[var(--cd-hover)] text-[var(--cd-text-muted)] transition-colors"
              >
                <Power size={14} />
              </button>
              <button
                onClick={() => navigate(`/org/dashboard/webhooks/${w.id}/edit`)}
                className="p-2 rounded-lg bg-[var(--cd-surface-2)] hover:bg-[var(--cd-hover)] text-[var(--cd-text-muted)] transition-colors"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDelete(w)}
                className="p-2 rounded-lg bg-[var(--cd-danger-subtle)] text-[var(--cd-danger)] hover:opacity-80 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
