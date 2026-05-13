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
    return <div className="p-8 text-center text-sm" style={{ color: "var(--cd-text-muted)" }}>Loading delivery logs...</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="p-12 text-center" style={{ color: "var(--cd-text-muted)" }}>
        <p className="text-sm font-medium">No deliveries found.</p>
        <p className="text-xs mt-1">Deliveries will appear here when an event triggers this webhook.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr 
              className="border-b"
              style={{ borderColor: "var(--cd-border-subtle)", backgroundColor: "var(--cd-surface-2)" }}
            >
              <th className="px-5 py-4 font-semibold w-[20%]" style={{ color: "var(--cd-text-muted)" }}>Status</th>
              <th className="px-5 py-4 font-semibold w-[20%]" style={{ color: "var(--cd-text-muted)" }}>Date & Time</th>
              <th className="px-5 py-4 font-semibold w-[20%]" style={{ color: "var(--cd-text-muted)" }}>Event</th>
              <th className="px-5 py-4 font-semibold w-[15%]" style={{ color: "var(--cd-text-muted)" }}>Response Code</th>
              <th className="px-5 py-4 font-semibold w-[25%] text-right" style={{ color: "var(--cd-text-muted)" }}>Actions</th>
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
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {isSuccess ? (
                        <CheckCircle2 size={16} style={{ color: "var(--cd-success)" }} />
                      ) : (
                        <XCircle size={16} style={{ color: "var(--cd-danger)" }} />
                      )}
                      <span className="font-medium capitalize" style={{ color: isSuccess ? "var(--cd-success)" : "var(--cd-danger)" }}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4" style={{ color: "var(--cd-text)" }}>
                    {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded-md text-xs font-mono" style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text-2)" }}>
                      {log.event}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs" style={{ color: log.responseCode >= 200 && log.responseCode < 300 ? "var(--cd-success)" : "var(--cd-danger)" }}>
                      {log.responseCode}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedPayload({ title: "Request Payload", data: log.requestPayload })}
                        className="p-1.5 rounded-md hover:bg-[var(--cd-surface-3)] transition-colors text-xs font-medium flex items-center gap-1.5"
                        style={{ color: "var(--cd-text-2)" }}
                      >
                        <FileJson size={14} /> Request
                      </button>
                      <button
                        onClick={() => setSelectedPayload({ title: "Response Payload", data: log.responsePayload })}
                        className="p-1.5 rounded-md hover:bg-[var(--cd-surface-3)] transition-colors text-xs font-medium flex items-center gap-1.5"
                        style={{ color: "var(--cd-text-2)" }}
                      >
                        <FileJson size={14} /> Response
                      </button>
                      {!isSuccess && (
                        <button
                          onClick={() => onRetry(log.id)}
                          disabled={isRetrying}
                          className="p-1.5 rounded-md hover:bg-[var(--cd-warning-subtle)] transition-colors text-xs font-medium flex items-center gap-1.5 ml-2"
                          style={{ color: "var(--cd-warning)" }}
                        >
                          <RotateCcw size={14} className={isRetrying ? "animate-spin" : ""} /> Retry
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
