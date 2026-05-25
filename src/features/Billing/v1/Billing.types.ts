export type WalletOwnerType = "user" | "community" | "organization";

export type CreditTransactionType =
  | "CREDIT_PURCHASE"
  | "USAGE_DEDUCTION"
  | "BONUS_CREDIT"
  | "REFUND"
  | "PAYOUT_HOLD"
  | "PAYOUT_RELEASE"
  | "ADMIN_ADJUSTMENT";

export type PaymentState = "idle" | "processing" | "success" | "failed" | "pending" | "refunded";

export interface Wallet {
  id: string;
  ownerType: WalletOwnerType;
  ownerId: string;
  availableCredits: number;
  lockedCredits: number;
  pendingCredits: number;
  reservedCredits: number;
  lifetimePurchasedCredits: number;
  lifetimeUsedCredits: number;
  autoRechargeEnabled: boolean;
  autoRechargeThreshold: number;
  autoRechargeAmountRupees: number;
  lowBalanceThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  walletId: string;
  transactionType: CreditTransactionType;
  credits: number;
  balanceBefore: number;
  balanceAfter: number;
  source: string;
  sourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface RechargePack {
  id: string;
  amountRupees: number;
  baseCredits: number;
  bonusCredits: number;
  label: string;
}

export interface AddFundsPreview {
  amountRupees: number;
  baseCredits: number;
  bonusCredits: number;
  totalCredits: number;
  gstRupees: number;
  platformFeeRupees: number;
  totalPayableRupees: number;
}

export interface AddFundsPayload {
  amountRupees: number;
  paymentMethod: "upi" | "debit" | "credit" | "netbanking" | "wallet";
  idempotencyKey: string;
}

export interface ConsumeCreditsPayload {
  walletId: string;
  feature: string;
  credits: number;
  metadata?: Record<string, unknown>;
  idempotencyKey: string;
}

export interface TransactionFilters {
  type: CreditTransactionType | "all";
  search: string;
  page: number;
}

export interface PaginatedTransactions {
  data: CreditTransaction[];
  total: number;
  totalPages: number;
}

export interface UsageSummary {
  totalConsumed: number;
  dailyAverage: number;
  monthlyEstimate: number;
  burnRatePerDay: number;
  topFeatures: { feature: string; credits: number }[];
}

export interface UsageBreakdown {
  category: string;
  credits: number;
  percentage: number;
}

export interface UsageForecast {
  nextMonthCredits: number;
  aiSpikeRisk: "low" | "medium" | "high";
  storageGrowthCredits: number;
  confidence: number;
}

export interface TeamUsageRow {
  memberId: string;
  memberName: string;
  creditsUsed: number;
  lastActivity: string;
  memberAvatar?: string;
  memberRole?: string;
}

export interface AutoRechargeConfig {
  enabled: boolean;
  thresholdCredits: number;
  rechargeAmountRupees: number;
}
