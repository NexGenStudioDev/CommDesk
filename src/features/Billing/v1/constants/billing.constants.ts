import type { RechargePack, TransactionFilters } from "../Billing.types";

/** Official rate: \u20B910 = 100 credits \u2192 10 credits per rupee */
export const CREDITS_PER_RUPEE = 10;
export const MIN_ADD_RUPEES = 150;
export const MIN_ADD_CREDITS = 1500;
export const GST_RATE = 0.18;
export const PLATFORM_FEE_RATE = 0.024;

export const DEFAULT_LOW_BALANCE_THRESHOLD = 200;

export const RECHARGE_PACKS: RechargePack[] = [
  { id: "pack-150", amountRupees: 150, baseCredits: 1500, bonusCredits: 0, label: "Starter" },
  { id: "pack-300", amountRupees: 300, baseCredits: 3000, bonusCredits: 200, label: "Growth" },
  { id: "pack-500", amountRupees: 500, baseCredits: 5000, bonusCredits: 500, label: "Pro" },
  { id: "pack-1000", amountRupees: 1000, baseCredits: 10000, bonusCredits: 2000, label: "Scale" },
  {
    id: "pack-2500",
    amountRupees: 2500,
    baseCredits: 25000,
    bonusCredits: 7000,
    label: "Enterprise",
  },
];

export const DEFAULT_TRANSACTION_FILTERS: TransactionFilters = {
  type: "all",
  search: "",
  page: 1,
};

export const DAILY_USAGE_LIMITS = {
  AI_REQUESTS: 200,
  WEBHOOKS: 10_000,
  EMAILS: 5_000,
} as const;
