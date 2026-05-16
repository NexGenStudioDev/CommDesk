import { MoreHorizontal, Edit, Trash2, Webhook as WebhookIcon, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Webhook } from "../../Webhook.types";
import StatusBadge from "../common/StatusBadge";
import { format } from "date-fns";

interface Props {
  webhooks: Webhook[];
  isLoading: boolean;
  onDelete: (w: Webhook) => void;
  onToggleStatus: (w: Webhook) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

export default function WebhookTable({
  webhooks,
  isLoading,
  onDelete,
  onToggleStatus,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}: Props) {
  const navigate = useNavigate();

  const allSelected = webhooks.length > 0 && selectedIds.length === webhooks.length;

  if (isLoading) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--cd-text-muted)" }}>
        Loading webhooks...
      </div>
    );
  }

  if (webhooks.length === 0) {
    return null; // Handled by EmptyState in the parent
  }

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left text-sm border-collapse table-fixed">
        <thead>
          <tr
            className="border-b"
            style={{
              borderColor: "var(--cd-border-subtle)",
              backgroundColor: "var(--cd-surface-2)",
            }}
          >
            <th className="px-5 py-4 w-[48px]">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(allSelected ? [] : webhooks.map((w) => w.id))}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600"
              />
            </th>
            <th
              className="px-5 py-4 font-semibold w-[22%]"
              style={{ color: "var(--cd-text-muted)" }}
            >
              Name
            </th>
            <th
              className="px-5 py-4 font-semibold w-[30%]"
              style={{ color: "var(--cd-text-muted)" }}
            >
              URL
            </th>
            <th
              className="px-5 py-4 font-semibold w-[12%]"
              style={{ color: "var(--cd-text-muted)" }}
            >
              Status
            </th>
            <th
              className="px-5 py-4 font-semibold w-[18%] whitespace-nowrap"
              style={{ color: "var(--cd-text-muted)" }}
            >
              Last Delivery
            </th>
            <th
              className="px-5 py-4 font-semibold w-[13%] text-center"
              style={{ color: "var(--cd-text-muted)" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map((w) => {
            const isSuccess = w.lastDeliveryStatus === "success";
            const isFailed = w.lastDeliveryStatus === "failed";

            return (
              <tr
                key={w.id}
                className={`group border-b transition-colors hover:bg-[var(--cd-hover)] ${selectedIds.includes(w.id) ? "bg-[var(--cd-hover)] shadow-[inset_4px_0_0_0_var(--cd-primary)]" : ""}`}
                style={{ borderColor: "var(--cd-border-subtle)" }}
              >
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(w.id)}
                    onChange={() => onToggleSelect(w.id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600"
                  />
                </td>
                <td className="px-5 py-4">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/org/dashboard/webhooks/${w.id}`)}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: "var(--cd-primary-subtle)",
                        color: "var(--cd-primary)",
                      }}
                    >
                      <WebhookIcon size={14} />
                    </div>
                    <div className="min-w-0 overflow-hidden">
                      <p className="font-semibold truncate" style={{ color: "var(--cd-text)" }}>
                        {w.name}
                      </p>
                      <p className="text-[11px] truncate" style={{ color: "var(--cd-text-muted)" }}>
                        {w.events.length} event{w.events.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center">
                    <p
                      className="text-xs truncate max-w-[250px] font-mono px-2 py-1 rounded-md"
                      style={{
                        color: "var(--cd-text-2)",
                        backgroundColor: "var(--cd-surface-2)",
                      }}
                      title={w.url}
                    >
                      {w.url.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={w.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {w.lastDeliveryStatus ? (
                      <>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: isSuccess
                              ? "var(--cd-success)"
                              : isFailed
                                ? "var(--cd-danger)"
                                : "var(--cd-warning)",
                          }}
                        />
                        <span className="text-xs capitalize" style={{ color: "var(--cd-text-2)" }}>
                          {w.lastDeliveryStatus}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                        Never
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onToggleStatus(w)}
                      className="p-1.5 rounded-md hover:bg-[var(--cd-surface-3)] transition-colors"
                      title={w.status === "active" ? "Disable Webhook" : "Enable Webhook"}
                      style={{ color: "var(--cd-text-muted)" }}
                    >
                      <Settings size={15} />
                    </button>
                    <button
                      onClick={() => navigate(`/org/dashboard/webhooks/${w.id}/edit`)}
                      className="p-1.5 rounded-md hover:bg-[var(--cd-surface-3)] transition-colors"
                      title="Edit Webhook"
                      style={{ color: "var(--cd-text-muted)" }}
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(w)}
                      className="p-1.5 rounded-md hover:bg-[var(--cd-danger-subtle)] hover:text-[var(--cd-danger)] transition-colors"
                      title="Delete Webhook"
                      style={{ color: "var(--cd-text-muted)" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {/* Mobile fallback for ellipsis menu if needed, but opacity-0 works fine for desktop hover */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
