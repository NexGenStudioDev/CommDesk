import { useQuery } from "@tanstack/react-query";
import { walletStore } from "../mock/walletStore";
import type { PaginatedTransactions, TransactionFilters } from "../Billing.types";
import { applyTransactionFilters } from "../utils/credits";

export function useWalletTransactions(walletId: string | undefined, filters: TransactionFilters) {
  return useQuery<PaginatedTransactions>({
    queryKey: ["wallet-transactions", walletId, filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      if (!walletId) return { data: [], total: 0, totalPages: 0 };

      const all = walletStore.getTransactions(walletId);
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
    enabled: !!walletId,
  });
}
