import { useMemo } from "react";
import { useWallet } from "./useWallet";
import { isLowBalance } from "../utils/credits";

const DEFAULT_LOW_BALANCE_THRESHOLD = 200;


export function useBillingGate() {
  const { data: wallet } = useWallet();

  return useMemo(() => {
    if (!wallet) {
      return {
        isLoaded: false,
        isLowBalance: false,
        isExhausted: false,
        canUsePremium: true,
        availableCredits: 0,
        threshold: DEFAULT_LOW_BALANCE_THRESHOLD,
      };
    }

    const exhausted = wallet.availableCredits <= 0;
    const low = isLowBalance(wallet.availableCredits, wallet.lowBalanceThreshold);

    return {
      isLoaded: true,
      isLowBalance: low && !exhausted,
      isExhausted: exhausted,
      canUsePremium: !exhausted,
      availableCredits: wallet.availableCredits,
      threshold: wallet.lowBalanceThreshold,
    };
  }, [wallet]);
}
