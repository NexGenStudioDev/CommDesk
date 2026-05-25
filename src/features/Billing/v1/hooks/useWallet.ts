import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletStore } from "../mock/walletStore";
import type {
  AddFundsPayload,
  AutoRechargeConfig,
  ConsumeCreditsPayload,
  TransactionFilters,
  PaginatedTransactions,
} from "../Billing.types";
import { BillingService } from "../services/billingService";
import { validateMinAddFunds, applyTransactionFilters } from "../utils/credits";

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return walletStore.getWallet();
    },
    refetchInterval: 30_000,
  });
}

export function useWalletTransactions(filters: TransactionFilters) {
  return useQuery<PaginatedTransactions>({
    queryKey: ["wallet", "transactions", filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      const all = walletStore.getTransactions();
      const filtered = applyTransactionFilters(all, filters);
      const pageSize = 10;
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize) || 1;
      const page = filters.page || 1;
      const start = (page - 1) * pageSize;

      return {
        data: filtered.slice(start, start + pageSize),
        total,
        totalPages,
      };
    },
  });
}

export function useAddFunds() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddFundsPayload) => {
      const validation = validateMinAddFunds(payload.amountRupees);
      if (!validation.valid) throw new Error(validation.error);

      await new Promise((r) => setTimeout(r, 1500));

      const failSim = payload.idempotencyKey.includes("fail");
      if (failSim) throw new Error("PAYMENT_FAILED");

      return walletStore.addFunds(payload.amountRupees, payload.idempotencyKey);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useConsumeCredits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConsumeCreditsPayload) => BillingService.consumeCredits(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["wallet", "transactions"] });
      qc.invalidateQueries({ queryKey: ["usage"] });
    },
  });
}

export function useRefundCredits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      credits,
      sourceId,
      idempotencyKey,
    }: {
      credits: number;
      sourceId: string;
      idempotencyKey: string;
    }) => {
      await new Promise((r) => setTimeout(r, 300));
      return walletStore.refundCredits(credits, sourceId, idempotencyKey);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["wallet", "transactions"] });
    },
  });
}

export function useAutoRecharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config: AutoRechargeConfig) => {
      await new Promise((r) => setTimeout(r, 400));
      return walletStore.setAutoRecharge(
        config.enabled,
        config.thresholdCredits,
        config.rechargeAmountRupees,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wallet"] }),
  });
}
