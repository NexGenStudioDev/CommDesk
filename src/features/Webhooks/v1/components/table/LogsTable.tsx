import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, FileJson } from "lucide-react";
import { format } from "date-fns";
import type { WebhookLog } from "../../Webhook.types";
import PayloadModal from "../modals/PayloadModal";

interface Props {
  logs: WebhookLog[];
  isLoading: boolean;
  onRetry: (logId: string) => void;
  isRetrying: boolean;
}

export default function LogsTable({ logs, isLoading, onRetry, isRetrying }: Props) {
  const [selectedPayload, setSelectedPayload] = useState<{ title: string; data: any } | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm" style={{ color: "var(--cd-text-muted)" }}>
        Loading delivery logs...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-12 text-center" style={{ color: "var(--cd-text-muted)" }}>
        <p className="text-sm font-medium">No deliveries found.</p>
        <p className="text-xs mt-1">
          Deliveries will appear here when an event triggers this webhook.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: "var(--cd-border-subtle)",
                backgroundColor: "var(--cd-surface-2)",
              }}
            >
              <th
                className="px-4 py-3 font-bold uppercase tracking-wider w-32"
                style={{ color: "var(--cd-text-muted)" }}
              >
                Status
              </th>
              <th
                className="px-4 py-3 font-bold uppercase tracking-wider"
                style={{ color: "var(--cd-text-muted)" }}
              >
                Timestamp
              </th>
              <th
                className="px-4 py-3 font-bold uppercase tracking-wider"
                style={{ color: "var(--cd-text-muted)" }}
              >
                Event
              </th>
              <th
                className="px-4 py-3 font-bold uppercase tracking-wider w-16"
                style={{ color: "var(--cd-text-muted)" }}
              >
                Code
              </th>
              <th
                className="px-4 py-3 font-bold uppercase tracking-wider text-right"
                style={{ color: "var(--cd-text-muted)" }}
              >
                Payloads
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const isSuccess = log.status === "success";
              return (
                <tr
                  key={log.id}
                  className="group border-b transition-colors hover:bg-[var(--cd-hover)]"
                  style={{ borderColor: "var(--cd-border-subtle)" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${isSuccess ? "bg-[var(--cd-success)]" : "bg-[var(--cd-danger)]"}`}
                      />
                      <span
                        className="font-bold uppercase tracking-tight"
                        style={{ color: isSuccess ? "var(--cd-success)" : "var(--cd-danger)" }}
                      >
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 font-medium whitespace-nowrap"
                    style={{ color: "var(--cd-text)" }}
                  >
                    {format(new Date(log.timestamp), "MMM d, HH:mm:ss")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--cd-surface-3)] text-[var(--cd-text-2)] font-mono border border-[var(--cd-border)]">
                      {log.event}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-mono font-bold"
                      style={{ color: isSuccess ? "var(--cd-success)" : "var(--cd-danger)" }}
                    >
                      {log.responseCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() =>
                          setSelectedPayload({ title: "Request Payload", data: log.requestPayload })
                        }
                        className="p-1.5 rounded hover:bg-[var(--cd-surface-3)] transition-colors text-[var(--cd-text-2)] hover:text-[var(--cd-text)]"
                        title="View Request"
                      >
                        <FileJson size={14} />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedPayload({
                            title: "Response Payload",
                            data: log.responsePayload,
                          })
                        }
                        className="p-1.5 rounded hover:bg-[var(--cd-surface-3)] transition-colors text-[var(--cd-text-2)] hover:text-[var(--cd-text)]"
                        title="View Response"
                      >
                        <RotateCcw size={14} className="rotate-180" />
                      </button>
                      {!isSuccess && (
                        <button
                          onClick={() => onRetry(log.id)}
                          disabled={isRetrying}
                          className="p-1.5 rounded hover:bg-[var(--cd-warning-subtle)] transition-colors text-[var(--cd-warning)] ml-1"
                          title="Retry Delivery"
                        >
                          <RotateCcw size={14} className={isRetrying ? "animate-spin" : ""} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PayloadModal
        isOpen={!!selectedPayload}
        onClose={() => setSelectedPayload(null)}
        title={selectedPayload?.title || ""}
        payload={selectedPayload?.data}
      />
    </>
  );
}
