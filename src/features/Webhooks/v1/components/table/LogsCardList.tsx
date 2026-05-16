import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, FileJson, Clock } from "lucide-react";
import { format } from "date-fns";
import type { WebhookLog } from "../../Webhook.types";
import PayloadModal from "../modals/PayloadModal";

interface Props {
  logs: WebhookLog[];
  isLoading: boolean;
  onRetry: (logId: string) => void;
  isRetrying: boolean;
}

export default function LogsCardList({ logs, isLoading, onRetry, isRetrying }: Props) {
  const [selectedPayload, setSelectedPayload] = useState<{ title: string; data: any } | null>(null);

  if (isLoading || logs.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-4 px-4 sm:px-6">
        {logs.map((log) => {
          const isSuccess = log.status === "success";
          return (
            <div
              key={log.id}
              className="rounded-xl border p-4 transition-all hover:shadow-md"
              style={{
                backgroundColor: "var(--cd-surface)",
                borderColor: "var(--cd-border)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isSuccess ? (
                    <CheckCircle2 size={18} style={{ color: "var(--cd-success)" }} />
                  ) : (
                    <XCircle size={18} style={{ color: "var(--cd-danger)" }} />
                  )}
                  <span
                    className="font-bold text-sm uppercase tracking-wider"
                    style={{ color: isSuccess ? "var(--cd-success)" : "var(--cd-danger)" }}
                  >
                    {log.status}
                  </span>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-mono font-bold"
                  style={{
                    backgroundColor:
                      log.responseCode >= 200 && log.responseCode < 300
                        ? "var(--cd-success-subtle)"
                        : "var(--cd-danger-subtle)",
                    color:
                      log.responseCode >= 200 && log.responseCode < 300
                        ? "var(--cd-success)"
                        : "var(--cd-danger)",
                  }}
                >
                  {log.responseCode}
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--cd-surface-2)] text-[var(--cd-text-muted)]">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-tight text-[var(--cd-text-muted)]">
                      Delivery Time
                    </p>
                    <p className="text-sm font-medium text-[var(--cd-text)]">
                      {format(new Date(log.timestamp), "MMM d, HH:mm:ss")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--cd-surface-2)] text-[var(--cd-text-muted)]">
                    <div className="text-[10px] font-bold font-mono">EV</div>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-tight text-[var(--cd-text-muted)]">
                      Trigger Event
                    </p>
                    <p className="text-sm font-mono font-medium text-[var(--cd-text-2)]">
                      {log.event}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-2 pt-3 border-t"
                style={{ borderColor: "var(--cd-border-subtle)" }}
              >
                <button
                  onClick={() =>
                    setSelectedPayload({ title: "Request Payload", data: log.requestPayload })
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-[var(--cd-surface-2)] hover:bg-[var(--cd-hover)] transition-colors"
                  style={{ color: "var(--cd-text-2)" }}
                >
                  <FileJson size={14} /> Request
                </button>
                <button
                  onClick={() =>
                    setSelectedPayload({ title: "Response Payload", data: log.responsePayload })
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-[var(--cd-surface-2)] hover:bg-[var(--cd-hover)] transition-colors"
                  style={{ color: "var(--cd-text-2)" }}
                >
                  <FileJson size={14} /> Response
                </button>
                {!isSuccess && (
                  <button
                    onClick={() => onRetry(log.id)}
                    disabled={isRetrying}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-[var(--cd-warning-subtle)] hover:opacity-80 transition-opacity"
                    style={{ color: "var(--cd-warning)" }}
                  >
                    <RotateCcw size={14} className={isRetrying ? "animate-spin" : ""} /> Retry
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
