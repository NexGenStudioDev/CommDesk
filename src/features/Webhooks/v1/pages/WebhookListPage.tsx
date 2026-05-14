import { useState } from "react";
import { useWebhooks, useUpdateWebhook, useDeleteWebhook, useBulkWebhookAction } from "../hooks/useWebhooks";
import { DEFAULT_WEBHOOK_FILTERS } from "../constants/webhook.constants";
import type { Webhook, WebhookFilters } from "../Webhook.types";
import WebhookHeader from "../components/layout/WebhookHeader";
import WebhookFiltersBar from "../components/layout/WebhookFilters";
import WebhookTable from "../components/table/WebhookTable";
import WebhookCardList from "../components/table/WebhookCardList";
import BulkActionBar from "../components/layout/BulkActionBar";
import ConfirmModal from "@/features/Tasks/v1/components/common/ConfirmModal";
import EmptyState from "@/features/Tasks/v1/components/common/EmptyState";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function WebhookListPage() {
  const navigate = useNavigate();
  const { toasts, addToast, dismiss } = useToast();
  
  const [filters, setFilters] = useState<WebhookFilters>(DEFAULT_WEBHOOK_FILTERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Total count for header (no filters applied)
  const { data: allPaginated = { data: [], total: 0, totalPages: 0 } } = useWebhooks(DEFAULT_WEBHOOK_FILTERS);
  const allWebhooks = allPaginated.data;
  const totalCount = allPaginated.total;
  
  // Filtered data
  const { data: paginatedData, isLoading, isError, refetch } = useWebhooks(filters);
  const webhooks = paginatedData?.data || [];
  const totalPages = paginatedData?.totalPages || 0;
  
  const updateWebhook = useUpdateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const bulkAction = useBulkWebhookAction();
  
  const [webhookToDelete, setWebhookToDelete] = useState<Webhook | null>(null);
  const [bulkActionToConfirm, setBulkActionToConfirm] = useState<"delete" | "enable" | "disable" | null>(null);

  const activeCount = allWebhooks.filter(w => w.status === "active").length;

  const handleToggleStatus = async (webhook: Webhook) => {
    const newStatus = webhook.status === "active" ? "inactive" : "active";
    try {
      await updateWebhook.mutateAsync({ 
        id: webhook.id, 
        payload: { status: newStatus } 
      });
      addToast("success", "Status updated", `Webhook is now ${newStatus}`);
    } catch {
      addToast("error", "Update failed", "Could not update status");
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleBulkAction = async (actionOverride?: "enable" | "disable") => {
    const action = actionOverride || bulkActionToConfirm;
    if (!action) return;
    try {
      await bulkAction.mutateAsync({ 
        ids: selectedIds, 
        action 
      });
      addToast(
        "success", 
        "Bulk Action Successful", 
        `Successfully ${action}d ${selectedIds.length} webhooks.`
      );
      setSelectedIds([]);
    } catch {
      addToast("error", "Bulk Action Failed", "Something went wrong.");
    } finally {
      setBulkActionToConfirm(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(f => ({ ...f, page: newPage }));
    }
  };

  const handleDelete = async () => {
    if (!webhookToDelete) return;
    try {
      await deleteWebhook.mutateAsync(webhookToDelete.id);
      addToast("success", "Webhook deleted", "The webhook has been permanently removed.");
    } catch {
      addToast("error", "Delete failed", "Something went wrong.");
    } finally {
      setWebhookToDelete(null);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--cd-bg)" }}
    >
      <WebhookHeader 
        totalCount={totalCount} 
        activeCount={activeCount} 
      />

      <div className="flex-1 flex flex-col">
        {isError ? (
          <div className="min-h-[70vh] flex items-center justify-center p-6">
            <EmptyState
              variant="error"
              title="Failed to load webhooks"
              description="Something went wrong while fetching webhooks."
              action={
                <button onClick={() => void refetch()} className="cd-btn cd-btn-secondary px-6 py-2.5 rounded-xl border">
                  Retry
                </button>
              }
            />
          </div>
        ) : totalCount === 0 && !isLoading ? (
          <div className="min-h-[70vh] flex items-center justify-center p-6">
            <EmptyState
              variant="no-event" // Using existing variant
              title="No Webhooks Yet"
              description="You haven't set up any webhooks. Create one to start receiving real-time event notifications."
              action={
                <button
                  onClick={() => navigate("/org/dashboard/webhooks/create")}
                  className="cd-btn cd-btn-primary flex items-center gap-2 px-8 py-3 rounded-2xl shadow-xl shadow-[var(--cd-primary-subtle)] hover:scale-105 transition-all"
                >
                  <Plus size={18} /> Create Webhook
                </button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <WebhookFiltersBar
              filters={filters}
              onChange={(newFilters) => setFilters({ ...newFilters, page: 1 })}
              totalCount={totalCount}
              filteredCount={paginatedData?.total || 0}
            />
            
            <main className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-8 sm:py-8 lg:px-10 flex flex-col gap-6">
              {/* Desktop View */}
              <div className="hidden md:block">
                <div 
                  className="overflow-hidden rounded-xl border transition-all duration-300" 
                  style={{ 
                    backgroundColor: "var(--cd-surface)", 
                    borderColor: "var(--cd-border-subtle)",
                    boxShadow: "0 18px 60px -36px var(--cd-shadow-md)"
                  }}
                >
                  <WebhookTable
                    webhooks={webhooks}
                    isLoading={isLoading}
                    onDelete={setWebhookToDelete}
                    onToggleStatus={handleToggleStatus}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onSelectAll={handleSelectAll}
                  />
                  {webhooks.length === 0 && !isLoading && (
                    <div className="py-20 flex items-center justify-center">
                      <EmptyState
                        variant="no-results"
                        title="No Matches Found"
                        description="We couldn't find any webhooks matching your current filters or search term."
                        action={
                          <button 
                            onClick={() => setFilters(DEFAULT_WEBHOOK_FILTERS)} 
                            className="cd-btn cd-btn-secondary px-6 py-2 rounded-xl border text-sm font-medium"
                          >
                            Clear All Filters
                          </button>
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile View */}
              <div className="block md:hidden">
                <WebhookCardList
                  webhooks={webhooks}
                  isLoading={isLoading}
                  onDelete={setWebhookToDelete}
                  onToggleStatus={handleToggleStatus}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                />
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4" style={{ color: "var(--cd-text)" }}>
                  <div className="text-sm text-[var(--cd-text-muted)]">
                    Showing page {filters.page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-4 py-2 text-sm border rounded-lg transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="px-4 py-2 text-sm border rounded-lg transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)", color: "var(--cd-text)" }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!webhookToDelete}
        title="Delete Webhook"
        message={`Are you sure you want to delete "${webhookToDelete?.name}"? All delivery history will be lost.`}
        confirmLabel="Yes, Delete"
        onConfirm={() => void handleDelete()}
        onCancel={() => setWebhookToDelete(null)}
        isLoading={deleteWebhook.isPending}
        danger
      />

      <ConfirmModal
        isOpen={bulkActionToConfirm === "delete"}
        title="Delete Multiple Webhooks"
        message={`Are you sure you want to delete ${selectedIds.length} webhooks? This action cannot be undone.`}
        confirmLabel="Yes, Delete All"
        onConfirm={() => void handleBulkAction()}
        onCancel={() => setBulkActionToConfirm(null)}
        isLoading={bulkAction.isPending}
        danger
      />

      <BulkActionBar 
        selectedCount={selectedIds.length} 
        onClear={() => setSelectedIds([])}
        onAction={(action) => {
          if (action === "delete") {
            setBulkActionToConfirm("delete");
          } else {
            handleBulkAction(action);
          }
        }}
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
