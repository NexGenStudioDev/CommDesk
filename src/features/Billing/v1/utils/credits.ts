import {
  CREDITS_PER_RUPEE,
  GST_RATE,
  MIN_ADD_CREDITS,
  MIN_ADD_RUPEES,
  PLATFORM_FEE_RATE,
  RECHARGE_PACKS,
} from "../constants/billing.constants";
import type { AddFundsPreview, CreditTransaction, TransactionFilters } from "../Billing.types";

export function rupeesToBaseCredits(rupees: number): number {
  return Math.floor(rupees * CREDITS_PER_RUPEE);
}

export function getBonusCreditsForAmount(amountRupees: number): number {
  const pack = RECHARGE_PACKS.find((p) => p.amountRupees === amountRupees);
  return pack?.bonusCredits ?? 0;
}

export function calculateTotalCredits(amountRupees: number): number {
  const base = rupeesToBaseCredits(amountRupees);
  const bonus = getBonusCreditsForAmount(amountRupees);
  return base + bonus;
}

export function validateMinAddFunds(amountRupees: number): {
  valid: boolean;
  error?: string;
} {
  if (!Number.isInteger(amountRupees) || amountRupees < MIN_ADD_RUPEES) {
    return {
      valid: false,
      error: `Minimum add funds is \u20B9${MIN_ADD_RUPEES} (${MIN_ADD_CREDITS} credits)`,
    };
  }
  return { valid: true };
}

export function buildAddFundsPreview(amountRupees: number): AddFundsPreview {
  const baseCredits = rupeesToBaseCredits(amountRupees);
  const bonusCredits = getBonusCreditsForAmount(amountRupees);
  const gstRupees = Math.round(amountRupees * GST_RATE);
  const platformFeeRupees = Math.round(amountRupees * PLATFORM_FEE_RATE);
  const totalPayableRupees = amountRupees + gstRupees + platformFeeRupees;

  return {
    amountRupees,
    baseCredits,
    bonusCredits,
    totalCredits: baseCredits + bonusCredits,
    gstRupees,
    platformFeeRupees,
    totalPayableRupees,
  };
}

export function formatCredits(credits: number): string {
  return credits.toLocaleString("en-IN");
}

export function formatRupees(rupees: number): string {
  return `\u20B9${rupees.toLocaleString("en-IN")}`;
}

export function isLowBalance(availableCredits: number, threshold: number): boolean {
  return availableCredits <= threshold;
}

export function canAfford(availableCredits: number, cost: number): boolean {
  return availableCredits >= cost && cost > 0;
}

export function applyTransactionFilters(
  txs: CreditTransaction[],
  filters: TransactionFilters,
): CreditTransaction[] {
  return txs.filter((t) => {
    if (filters.type !== "all" && t.transactionType !== filters.type) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        t.source.toLowerCase().includes(q) ||
        t.transactionType.toLowerCase().includes(q) ||
        (t.sourceId?.toLowerCase().includes(q) ?? false);
      if (!match) return false;
    }
    return true;
  });
}

