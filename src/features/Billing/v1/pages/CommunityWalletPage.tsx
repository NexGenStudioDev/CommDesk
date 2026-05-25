import { useState } from "react";
import WalletHeader from "../components/layout/WalletHeader";
import WalletStatsGrid from "../components/layout/WalletStatsGrid";
import WalletFiltersBar from "../components/layout/WalletFilters";
import TransactionTable from "../components/table/TransactionTable";
import TransactionCardList from "../components/table/TransactionCardList";
import TeamUsageTable from "../components/table/TeamUsageTable";
import AutoRechargePanel from "../components/layout/AutoRechargePanel";
import LowBalanceModal from "../components/layout/LowBalanceModal";
import AddFundsModal from "../components/layout/AddFundsModal";
import EmptyState from "@/features/Tasks/v1/components/common/EmptyState";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import { useWallet, useWalletTransactions, useConsumeCredits } from "../hooks/useWallet";
import { useUsageSummary } from "../hooks/useUsageAnalytics";
import { useBillingGate } from "../hooks/useBillingGate";
import { DEFAULT_TRANSACTION_FILTERS } from "../constants/billing.constants";
import { formatCredits } from "../utils/credits";
import type { TransactionFilters } from "../Billing.types";

export default function CommunityWalletPage() {
  const { toasts, addToast, dismiss } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_TRANSACTION_FILTERS);
  const [lowBalanceDismissed, setLowBalanceDismissed] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  const { data: wallet, isLoading, isError, refetch } = useWallet();
  const { data: summary } = useUsageSummary();
  const allTxQuery = useWalletTransactions({ ...DEFAULT_TRANSACTION_FILTERS, page: 1 });
  const { data: paginated, isLoading: txsLoading } = useWalletTransactions(filters);
  const billingGate = useBillingGate();

  const consumeCredits = useConsumeCredits();
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  const handleAISummary = async () => {
    if (!wallet) return;
    try {
      await consumeCredits.mutateAsync({
        walletId: wallet.id,
        feature: "AI_SUMMARY",
        credits: 15,
        idempotencyKey: `idem-ai-${crypto.randomUUID()}`,
      });
      addToast("success", "AI Summary Generated", "Consumed 15 credits successfully.");
      void refetch();
      void allTxQuery.refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Insufficient balance or daily limit reached.";
      addToast("error", "Failed to consume credits", message);
    }
  };

  const transactions = paginated?.data ?? [];
  const totalPages = paginated?.totalPages ?? 0;
  const totalTxCount = allTxQuery.data?.total ?? 0;

  const showLowBalance =
    billingGate.isLoaded &&
    (billingGate.isLowBalance || billingGate.isExhausted) &&
    !lowBalanceDismissed;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((f) => ({ ...f, page: newPage }));
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(circle at top right, var(--cd-primary-subtle), transparent 34rem), var(--cd-bg)",
      }}
    >
      <WalletHeader
        wallet={wallet}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddFunds={() => setIsAddFundsOpen(true)}
      />

      <div className="flex-1 flex flex-col">
        {isError ? (
          <div className="min-h-[70vh] flex items-center justify-center p-6">
            <EmptyState
              variant="error"
              title="Failed to load wallet"
              description="Something went wrong while fetching wallet data."
              action={
                <button
                  onClick={() => void refetch()}
                  className="cd-btn cd-btn-secondary px-6 py-2.5 rounded-xl border"
                >
                  Retry
                </button>
              }
            />
          </div>
        ) : isLoading || !wallet ? (
          <div className="p-10 text-center" style={{ color: "var(--cd-text-muted)" }}>
            Loading wallet...
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <main className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-8 sm:py-8 lg:px-10 flex flex-col gap-6">
                <WalletStatsGrid wallet={wallet} burnRatePerDay={summary?.burnRatePerDay} />

                <div
                  className="rounded-2xl border p-6"
                  style={{
                    backgroundColor: "var(--cd-surface)",
                    borderColor: "var(--cd-border-subtle)",
                    boxShadow: "0 14px 34px var(--cd-shadow)",
                  }}
                >
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-black" style={{ color: "var(--cd-text)" }}>
                        Feature Usage
                      </h3>
                      <p className="text-sm mt-1" style={{ color: "var(--cd-text-muted)" }}>
                        Run credit-metered features through the centralized billing engine.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddFundsOpen(true)}
                      className="cd-btn cd-btn-primary px-4 py-2.5 rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all"
                    >
                      Add Funds
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setShowAIFeatures(!showAIFeatures)}
                        className="rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all hover:scale-[1.02]"
                        style={{
                          backgroundColor: showAIFeatures ? "var(--cd-primary-subtle)" : "var(--cd-surface)",
                          borderColor: showAIFeatures ? "var(--cd-primary)" : "var(--cd-border-subtle)",
                          color: showAIFeatures ? "var(--cd-primary-text)" : "var(--cd-text)",
                        }}
                      >
                        AI Features
                      </button>
                    </div>

                    {showAIFeatures && (
                      <div
                        className="mt-2 p-4 rounded-xl border flex flex-col gap-3"
                        style={{
                          backgroundColor: "var(--cd-bg)",
                          borderColor: "var(--cd-border-subtle)",
                        }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--cd-text-muted)" }}>
                          Available AI Services
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => void handleAISummary()}
                            disabled={consumeCredits.isPending}
                            data-testid="generate-ai-summary"
                            className="rounded-lg px-4 py-2 text-xs font-medium border transition-colors hover:bg-[var(--cd-hover)]"
                            style={{
                              backgroundColor: "var(--cd-surface)",
                              borderColor: "var(--cd-border-subtle)",
                              color: "var(--cd-text)",
                            }}
                          >
                            {consumeCredits.isPending ? "Generating..." : "Generate AI Summary (15 credits)"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <AutoRechargePanel
                  wallet={wallet}
                  onSuccess={() => addToast("success", "Saved", "Auto recharge settings updated.")}
                />
                {billingGate.isExhausted && (
                  <div
                    className="rounded-xl border p-4 text-sm"
                    style={{
                      backgroundColor: "var(--cd-danger-subtle)",
                      borderColor: "var(--cd-danger)",
                      color: "var(--cd-danger)",
                    }}
                  >
                    Premium features are paused. Core community features remain accessible.
                  </div>
                )}
              </main>
            )}

            {activeTab === "transactions" && (
              <>
                <WalletFiltersBar
                  filters={filters}
                  onChange={(f) => setFilters({ ...f, page: 1 })}
                  filteredCount={paginated?.total ?? 0}
                  totalCount={totalTxCount}
                />
                <main className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
                  <div
                    className="hidden md:block overflow-hidden rounded-xl border"
                    style={{
                      backgroundColor: "var(--cd-surface)",
                      borderColor: "var(--cd-border-subtle)",
                    }}
                  >
                    <TransactionTable transactions={transactions} isLoading={txsLoading} />
                  </div>
                  <div className="block md:hidden">
                    <TransactionCardList transactions={transactions} isLoading={txsLoading} />
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-4">
                      <span className="text-sm" style={{ color: "var(--cd-text-muted)" }}>
                        Page {filters.page} of {totalPages}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(filters.page - 1)}
                          disabled={filters.page === 1}
                          className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
                          style={{
                            backgroundColor: "var(--cd-surface)",
                            borderColor: "var(--cd-border-subtle)",
                          }}
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(filters.page + 1)}
                          disabled={filters.page === totalPages}
                          className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
                          style={{
                            backgroundColor: "var(--cd-surface)",
                            borderColor: "var(--cd-border-subtle)",
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </main>
              </>
            )}

            {activeTab === "team" && (
              <main className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
                <TeamUsageTable />
              </main>
            )}
          </>
        )}
      </div>

      <LowBalanceModal
        isOpen={showLowBalance}
        availableCredits={billingGate.availableCredits}
        threshold={billingGate.threshold}
        onDismiss={() => setLowBalanceDismissed(true)}
        onAddFunds={() => setIsAddFundsOpen(true)}
      />

      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        onSuccess={(credits) => {
          addToast("success", "Payment successful", `${formatCredits(credits)} credits added.`);
          void refetch();
          void allTxQuery.refetch();
        }}
        onError={(message) => addToast("error", "Payment failed", message)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
