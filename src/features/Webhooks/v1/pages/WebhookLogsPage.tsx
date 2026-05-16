import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";
import { useWebhook } from "../hooks/useWebhooks";
import { useWebhookLogs, useRetryWebhookDelivery } from "../hooks/useWebhookLogs";
import { DEFAULT_LOG_FILTERS } from "../constants/webhook.constants";
import type { WebhookLogFilters } from "../Webhook.types";
import LogsTable from "../components/table/LogsTable";
import LogsCardList from "../components/table/LogsCardList";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import { PillDropdown } from "../components/layout/WebhookFilters";

const LOG_STATUS_DOTS: Record<string, string> = {
  all: "bg-gray-400",
  success: "bg-emerald-500",
  failed: "bg-red-500",
};
const LOG_STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  success: {
    bg: "var(--cd-success-subtle)",
    color: "var(--cd-success)",
    border: "var(--cd-success-subtle)",
  },
  failed: {
    bg: "var(--cd-danger-subtle)",
    color: "var(--cd-danger)",
    border: "var(--cd-danger-subtle)",
  },
};

export default function WebhookLogsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toasts, addToast, dismiss } = useToast();

  const [filters, setFilters] = useState<WebhookLogFilters>(DEFAULT_LOG_FILTERS);

  const { data: webhook } = useWebhook(id);
  const { data: paginatedData, isLoading } = useWebhookLogs(id, filters);
  const logs = paginatedData?.data || [];
  const totalPages = paginatedData?.totalPages || 0;
  const retryMutation = useRetryWebhookDelivery();

  const handleRetry = async (logId: string) => {
    if (!id) return;
    try {
      await retryMutation.mutateAsync({ webhookId: id, logId });
      addToast("success", "Retry triggered", "The delivery has been queued for retry.");
    } catch {
      addToast("error", "Retry failed", "Could not trigger the retry mechanism.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((f) => ({ ...f, page: newPage }));
    }
  };

  return (
    <div
      className="flex h-full w-full flex-col overflow-auto cd-page"
      style={{ backgroundColor: "var(--cd-bg)" }}
    >
      {/* Header */}
      <div
        className="flex flex-col border-b px-5 py-6 sm:px-8 lg:px-10"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
      >
        <div
          className="flex items-center gap-3 mb-2 text-sm font-medium"
          style={{ color: "var(--cd-text-muted)" }}
        >
          <Link
            to="/org/dashboard/webhooks"
            className="hover:text-[var(--cd-text)] transition-colors"
          >
            Webhooks
          </Link>
          <span>/</span>
          <Link
            to={`/org/dashboard/webhooks/${id}`}
            className="hover:text-[var(--cd-text)] transition-colors"
          >
            {webhook?.name || "Loading..."}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--cd-text)" }}>Logs</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--cd-hover)]"
            style={{ color: "var(--cd-text-muted)" }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1
              className="text-2xl font-bold flex items-center gap-3"
              style={{ color: "var(--cd-text)" }}
            >
              <Activity size={24} style={{ color: "var(--cd-primary)" }} /> Delivery Logs
            </h1>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="border-b px-5 py-3 sm:px-8 lg:px-10 flex gap-4"
        style={{ backgroundColor: "var(--cd-surface-2)", borderColor: "var(--cd-border-subtle)" }}
      >
        <PillDropdown<"all" | "success" | "failed">
          label="Status"
          value={filters.status}
          dotMap={LOG_STATUS_DOTS}
          styleMap={LOG_STATUS_STYLES}
          onChange={(v) => setFilters((f) => ({ ...f, status: v, page: 1 }))}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "success", label: "Success" },
            { value: "failed", label: "Failed" },
          ]}
        />
        <PillDropdown<string>
          label="Event"
          value={filters.event}
          dotMap={{ all: "bg-gray-400" }}
          styleMap={{}}
          onChange={(v) => setFilters((f) => ({ ...f, event: v, page: 1 }))}
          options={[
            { value: "all", label: "All Events" },
            ...(webhook?.events.map((ev) => ({ value: ev, label: ev })) || []),
          ]}
        />
      </div>

      <div className="flex-1 p-5 sm:p-8 lg:p-10 flex flex-col gap-4">
        {/* Desktop View */}
        <div className="hidden md:block">
          <div
            className="rounded-xl border overflow-hidden shadow-sm"
            style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
          >
            <LogsTable
              logs={logs}
              isLoading={isLoading}
              onRetry={handleRetry}
              isRetrying={retryMutation.isPending}
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden">
          <LogsCardList
            logs={logs}
            isLoading={isLoading}
            onRetry={handleRetry}
            isRetrying={retryMutation.isPending}
          />
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-2 py-4"
            style={{ color: "var(--cd-text)" }}
          >
            <div className="text-sm text-[var(--cd-text-muted)]">
              Showing page {filters.page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 text-sm border rounded-lg transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--cd-surface)",
                  borderColor: "var(--cd-border-subtle)",
                  color: "var(--cd-text)",
                }}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="px-4 py-2 text-sm border rounded-lg transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--cd-surface)",
                  borderColor: "var(--cd-border-subtle)",
                  color: "var(--cd-text)",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
