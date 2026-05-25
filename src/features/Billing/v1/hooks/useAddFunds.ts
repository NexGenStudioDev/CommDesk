import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletStore } from "../mock/walletStore";
import { validateMinAddFunds, buildAddFundsPreview } from "../utils/credits";

export function useAddFunds() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amountRupees,
      idempotencyKey,
    }: {
      amountRupees: number;
      idempotencyKey: string;
    }) => {
      const validation = validateMinAddFunds(amountRupees);
      if (!validation.valid) throw new Error(validation.error);

      await new Promise((r) => setTimeout(r, 1200));

      const result = walletStore.addFunds(amountRupees, idempotencyKey);
      const preview = buildAddFundsPreview(amountRupees);
      
      return {
        preview,
        transaction: result.transaction,
        wallet: result.wallet,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["wallet", "transactions"] });
      qc.invalidateQueries({ queryKey: ["usage"] });
    },
  });
}

