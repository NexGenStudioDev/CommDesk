import type {
  CreditTransaction,
  CreditTransactionType,
  Wallet,
  TeamUsageRow,
  UsageBreakdown,
  UsageForecast,
  UsageSummary,
} from "../Billing.types";
import { calculateTotalCredits } from "../utils/credits";
import {
  DEFAULT_LOW_BALANCE_THRESHOLD,
  DAILY_USAGE_LIMITS,
  MIN_ADD_RUPEES,
} from "../constants/billing.constants";

const now = () => new Date().toISOString();
const STORAGE_KEY = "commdesk.billing.wallet.v1";

const initialWallet: Wallet = {
  id: "wallet-community-1",
  ownerType: "community",
  ownerId: "org-1",
  availableCredits: 6864,
  lockedCredits: 150,
  pendingCredits: 0,
  reservedCredits: 300,
  lifetimePurchasedCredits: 18500,
  lifetimeUsedCredits: 14300,
  autoRechargeEnabled: false,
  autoRechargeThreshold: 200,
  autoRechargeAmountRupees: 150,
  lowBalanceThreshold: DEFAULT_LOW_BALANCE_THRESHOLD,
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: now(),
};

const initialTransactions: CreditTransaction[] = [
  {
    id: "tx-1",
    walletId: initialWallet.id,
    transactionType: "CREDIT_PURCHASE",
    credits: 5500,
    balanceBefore: 1200,
    balanceAfter: 6700,
    source: "payment",
    sourceId: "pay-abc123",
    metadata: { amountRupees: 500, bonusCredits: 500 },
    createdAt: "2026-05-10T14:22:00.000Z",
  },
  {
    id: "tx-2",
    walletId: initialWallet.id,
    transactionType: "USAGE_DEDUCTION",
    credits: -15,
    balanceBefore: 6700,
    balanceAfter: 6685,
    source: "AI_SUMMARY",
    metadata: { workspaceId: "ws-1" },
    createdAt: "2026-05-11T09:15:00.000Z",
  },
  {
    id: "tx-3",
    walletId: initialWallet.id,
    transactionType: "USAGE_DEDUCTION",
    credits: -1,
    balanceBefore: 6685,
    balanceAfter: 6684,
    source: "WEBHOOK_TRIGGER",
    sourceId: "wh-1",
    createdAt: "2026-05-12T11:30:00.000Z",
  },
  {
    id: "tx-4",
    walletId: initialWallet.id,
    transactionType: "BONUS_CREDIT",
    credits: 200,
    balanceBefore: 6684,
    balanceAfter: 6884,
    source: "promotion",
    metadata: { packId: "pack-300" },
    createdAt: "2026-05-13T16:00:00.000Z",
  },
  {
    id: "tx-5",
    walletId: initialWallet.id,
    transactionType: "USAGE_DEDUCTION",
    credits: -20,
    balanceBefore: 6884,
    balanceAfter: 6864,
    source: "EXPORT_DATA",
    createdAt: "2026-05-14T08:45:00.000Z",
  },
];

type WalletState = {
  wallet: Wallet;
  transactions: CreditTransaction[];
};

let communityWallet: Wallet = { ...initialWallet };
let transactions: CreditTransaction[] = initialTransactions.map((tx) => ({ ...tx }));

const idempotencyKeys = new Set<string>(
  transactions
    .map((tx) => tx.metadata?.idempotencyKey)
    .filter((key): key is string => typeof key === "string"),
);

function cloneWallet(wallet: Wallet): Wallet {
  return { ...wallet };
}

function cloneTransaction(tx: CreditTransaction): CreditTransaction {
  return {
    ...tx,
    metadata: tx.metadata ? { ...tx.metadata } : undefined,
  };
}

function readPersistedState(): WalletState | null {
  if (
    typeof globalThis.localStorage === "undefined" ||
    typeof globalThis.localStorage.getItem !== "function"
  ) {
    return null;
  }

  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WalletState>;
    if (!parsed.wallet || !Array.isArray(parsed.transactions)) return null;
    return {
      wallet: parsed.wallet,
      transactions: parsed.transactions,
    };
  } catch {
    return null;
  }
}

function persistState() {
  if (
    typeof globalThis.localStorage === "undefined" ||
    typeof globalThis.localStorage.setItem !== "function"
  ) {
    return;
  }

  globalThis.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      wallet: communityWallet,
      transactions,
    }),
  );
}

function hydrateState() {
  const persisted = readPersistedState();
  if (!persisted) return;

  communityWallet = { ...persisted.wallet };
  transactions = persisted.transactions.map(cloneTransaction);
  idempotencyKeys.clear();
  transactions.forEach((tx) => {
    const key = tx.metadata?.idempotencyKey;
    if (typeof key === "string") idempotencyKeys.add(key);
  });
}

hydrateState();

function appendTransaction(
  walletId: string,
  type: CreditTransactionType,
  credits: number,
  source: string,
  sourceId?: string,
  metadata?: Record<string, unknown>,
): CreditTransaction {
  const wallet = communityWallet;
  const balanceBefore = wallet.availableCredits;
  const balanceAfter = balanceBefore + credits;

  if (!Number.isInteger(credits) || credits === 0) {
    throw new Error("INVALID_CREDIT_AMOUNT");
  }

  if (balanceAfter < 0) {
    throw new Error("INSUFFICIENT_CREDITS");
  }

  const tx: CreditTransaction = {
    id: `tx-${crypto.randomUUID()}`,
    walletId,
    transactionType: type,
    credits,
    balanceBefore,
    balanceAfter,
    source,
    sourceId,
    metadata,
    createdAt: now(),
  };

  transactions = [tx, ...transactions];
  communityWallet = {
    ...communityWallet,
    availableCredits: balanceAfter,
    updatedAt: now(),
  };
  persistState();

  return tx;
}

function enforceDailyLimits(feature: string) {
  const todayStr = new Date().toDateString();
  const txsToday = transactions.filter(
    (t) =>
      t.transactionType === "USAGE_DEDUCTION" &&
      new Date(t.createdAt).toDateString() === todayStr,
  );

  if (feature.startsWith("AI_")) {
    const aiCount = txsToday.filter((t) => t.source.startsWith("AI_")).length;
    if (aiCount >= DAILY_USAGE_LIMITS.AI_REQUESTS) {
      throw new Error("DAILY_LIMIT_EXCEEDED_AI");
    }
  } else if (
    feature.startsWith("WEBHOOK_") ||
    feature === "WEBHOOK_TRIGGER" ||
    feature === "WEBHOOK_RETRY" ||
    feature === "WEBHOOK_PREMIUM_DELIVERY"
  ) {
    const webhookCount = txsToday.filter(
      (t) =>
        t.source.startsWith("WEBHOOK_") ||
        t.source === "WEBHOOK_TRIGGER" ||
        t.source === "WEBHOOK_RETRY" ||
        t.source === "WEBHOOK_PREMIUM_DELIVERY",
    ).length;
    if (webhookCount >= DAILY_USAGE_LIMITS.WEBHOOKS) {
      throw new Error("DAILY_LIMIT_EXCEEDED_WEBHOOKS");
    }
  } else if (feature === "EMAIL_SEND") {
    const emailCount = txsToday.filter((t) => t.source === "EMAIL_SEND").length;
    if (emailCount >= DAILY_USAGE_LIMITS.EMAILS) {
      throw new Error("DAILY_LIMIT_EXCEEDED_EMAILS");
    }
  }
}

function checkSuspiciousActivity(credits: number) {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentDeductions = transactions.filter(
    (t) =>
      t.transactionType === "USAGE_DEDUCTION" &&
      new Date(t.createdAt).getTime() > oneDayAgo,
  );

  const totalBurn = Math.abs(recentDeductions.reduce((sum, t) => sum + t.credits, 0)) + credits;
  if (totalBurn > 5000) {
    console.warn(
      `[SECURITY ALERT] Rapid burn pattern detected: ${totalBurn} credits consumed in 24 hours.`,
    );
  }
}

function assertIdempotencyKey(idempotencyKey: string) {
  if (!/^[a-zA-Z0-9_-]{6,120}$/.test(idempotencyKey)) {
    throw new Error("INVALID_IDEMPOTENCY_KEY");
  }
}

function getExistingTransaction(type: CreditTransactionType, idempotencyKey: string) {
  return transactions.find(
    (tx) => tx.transactionType === type && tx.metadata?.idempotencyKey === idempotencyKey,
  );
}

function maybeAutoRecharge() {
  if (!communityWallet.autoRechargeEnabled) return;
  if (communityWallet.availableCredits > communityWallet.autoRechargeThreshold) return;

  const idempotencyKey = `auto-recharge-${new Date().toISOString().slice(0, 10)}-${communityWallet.id}`;
  if (idempotencyKeys.has(idempotencyKey)) return;

  const amountRupees = communityWallet.autoRechargeAmountRupees;
  if (!Number.isInteger(amountRupees) || amountRupees < MIN_ADD_RUPEES) return;

  const totalCredits = calculateTotalCredits(amountRupees);
  const bonus = totalCredits - amountRupees * 10;
  idempotencyKeys.add(idempotencyKey);

  const tx = appendTransaction(
    communityWallet.id,
    "CREDIT_PURCHASE",
    totalCredits,
    "auto_recharge",
    idempotencyKey,
    { amountRupees, bonusCredits: bonus, idempotencyKey, automatic: true },
  );

  communityWallet = {
    ...communityWallet,
    lifetimePurchasedCredits: communityWallet.lifetimePurchasedCredits + totalCredits,
    updatedAt: now(),
  };
  transactions = transactions.map((transaction) => (transaction.id === tx.id ? tx : transaction));
  persistState();
}

export const walletStore = {
  getWallet: (): Wallet => {
    hydrateState();
    return cloneWallet(communityWallet);
  },

  getTransactions: (walletId?: string): CreditTransaction[] => {
    hydrateState();
    const cloned = transactions.map(cloneTransaction);
    if (walletId) {
      return cloned.filter((t) => t.walletId === walletId);
    }
    return cloned;
  },

  resetForTests: () => {
    communityWallet = { ...initialWallet, updatedAt: now() };
    transactions = initialTransactions.map(cloneTransaction);
    idempotencyKeys.clear();
    transactions.forEach((tx) => {
      const key = tx.metadata?.idempotencyKey;
      if (typeof key === "string") idempotencyKeys.add(key);
    });
    persistState();
  },

  addFunds: (
    amountRupees: number,
    idempotencyKey: string,
  ): { wallet: Wallet; transaction: CreditTransaction } => {
    assertIdempotencyKey(idempotencyKey);
    if (!Number.isInteger(amountRupees) || amountRupees < MIN_ADD_RUPEES) {
      throw new Error("MINIMUM_ADD_FUNDS_REQUIRED");
    }

    if (idempotencyKeys.has(idempotencyKey)) {
      const existing = getExistingTransaction("CREDIT_PURCHASE", idempotencyKey);
      if (existing) return { wallet: cloneWallet(communityWallet), transaction: cloneTransaction(existing) };
      throw new Error("IDEMPOTENCY_KEY_REUSED");
    }

    const totalCredits = calculateTotalCredits(amountRupees);
    const bonus = totalCredits - amountRupees * 10;

    idempotencyKeys.add(idempotencyKey);

    const tx = appendTransaction(
      communityWallet.id,
      "CREDIT_PURCHASE",
      totalCredits,
      "payment",
      idempotencyKey,
      { amountRupees, bonusCredits: bonus, idempotencyKey },
    );

    communityWallet = {
      ...communityWallet,
      lifetimePurchasedCredits: communityWallet.lifetimePurchasedCredits + totalCredits,
      updatedAt: now(),
    };
    persistState();

    return { wallet: cloneWallet(communityWallet), transaction: cloneTransaction(tx) };
  },

  consumeCredits: (
    credits: number,
    feature: string,
    idempotencyKey: string,
    metadata?: Record<string, unknown>,
  ): { wallet: Wallet; transaction: CreditTransaction } => {
    assertIdempotencyKey(idempotencyKey);

    if (idempotencyKeys.has(idempotencyKey)) {
      const existing = getExistingTransaction("USAGE_DEDUCTION", idempotencyKey);
      if (existing) return { wallet: cloneWallet(communityWallet), transaction: cloneTransaction(existing) };
      throw new Error("IDEMPOTENCY_KEY_REUSED");
    }

    if (!Number.isInteger(credits) || credits <= 0) {
      throw new Error("INVALID_CREDIT_AMOUNT");
    }

    enforceDailyLimits(feature);
    checkSuspiciousActivity(credits);

    idempotencyKeys.add(idempotencyKey);

    const tx = appendTransaction(
      communityWallet.id,
      "USAGE_DEDUCTION",
      -credits,
      feature,
      undefined,
      { ...metadata, idempotencyKey },
    );

    communityWallet = {
      ...communityWallet,
      lifetimeUsedCredits: communityWallet.lifetimeUsedCredits + credits,
      updatedAt: now(),
    };
    maybeAutoRecharge();
    persistState();

    return { wallet: cloneWallet(communityWallet), transaction: cloneTransaction(tx) };
  },

  refundCredits: (
    credits: number,
    sourceId: string,
    idempotencyKey: string,
  ): { wallet: Wallet; transaction: CreditTransaction } => {
    assertIdempotencyKey(idempotencyKey);
    if (!Number.isInteger(credits) || credits <= 0) {
      throw new Error("INVALID_CREDIT_AMOUNT");
    }

    if (idempotencyKeys.has(idempotencyKey)) {
      const existing = getExistingTransaction("REFUND", idempotencyKey);
      if (existing) return { wallet: cloneWallet(communityWallet), transaction: cloneTransaction(existing) };
      throw new Error("IDEMPOTENCY_KEY_REUSED");
    }

    idempotencyKeys.add(idempotencyKey);

    const tx = appendTransaction(
      communityWallet.id,
      "REFUND",
      credits,
      "refund",
      sourceId,
      { idempotencyKey },
    );

    return { wallet: cloneWallet(communityWallet), transaction: cloneTransaction(tx) };
  },

  setAutoRecharge: (enabled: boolean, thresholdCredits?: number, amountRupees?: number) => {
    if (thresholdCredits !== undefined && (!Number.isInteger(thresholdCredits) || thresholdCredits < 0)) {
      throw new Error("INVALID_AUTO_RECHARGE_THRESHOLD");
    }
    if (
      amountRupees !== undefined &&
      (!Number.isInteger(amountRupees) || amountRupees < MIN_ADD_RUPEES)
    ) {
      throw new Error("INVALID_AUTO_RECHARGE_AMOUNT");
    }

    communityWallet = {
      ...communityWallet,
      autoRechargeEnabled: enabled,
      autoRechargeThreshold: thresholdCredits ?? communityWallet.autoRechargeThreshold,
      autoRechargeAmountRupees: amountRupees ?? communityWallet.autoRechargeAmountRupees,
      updatedAt: now(),
    };
    persistState();
    return cloneWallet(communityWallet);
  },

  validateLedgerConsistency: () => {
    return transactions.every((tx) => tx.balanceAfter - tx.balanceBefore === tx.credits);
  },

  getUsageSummary: (): UsageSummary => ({
    totalConsumed: 1430,
    dailyAverage: 48,
    monthlyEstimate: 1440,
    burnRatePerDay: 52,
    topFeatures: [
      { feature: "AI_SUMMARY", credits: 450 },
      { feature: "WEBHOOK_TRIGGER", credits: 320 },
      { feature: "EXPORT_DATA", credits: 280 },
      { feature: "ANALYTICS_QUERY", credits: 180 },
      { feature: "EMAIL_SEND", credits: 120 },
    ],
  }),

  getUsageBreakdown: (): UsageBreakdown[] => [
    { category: "AI", credits: 520, percentage: 36 },
    { category: "Webhooks", credits: 340, percentage: 24 },
    { category: "API", credits: 290, percentage: 20 },
    { category: "Queue", credits: 150, percentage: 10 },
    { category: "Storage", credits: 130, percentage: 10 },
  ],

  getUsageForecast: (): UsageForecast => ({
    nextMonthCredits: 12500,
    aiSpikeRisk: "medium",
    storageGrowthCredits: 800,
    confidence: 0.82,
  }),

  getTeamUsage: (): TeamUsageRow[] => [
    {
      memberId: "m-1",
      memberName: "John Doe",
      memberRole: "System Admin",
      memberAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      creditsUsed: 420,
      lastActivity: "2026-05-17T18:30:00.000Z",
    },
    {
      memberId: "m-2",
      memberName: "Jane Smith",
      memberRole: "HR Manager",
      memberAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      creditsUsed: 310,
      lastActivity: "2026-05-17T12:15:00.000Z",
    },
    {
      memberId: "m-3",
      memberName: "Alex Turner",
      memberRole: "Finance Lead",
      memberAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
      creditsUsed: 185,
      lastActivity: "2026-05-16T20:45:00.000Z",
    },
    {
      memberId: "m-4",
      memberName: "Maria Garcia",
      memberRole: "UI/UX Designer",
      memberAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
      creditsUsed: 95,
      lastActivity: "2026-05-15T10:00:00.000Z",
    },
    {
      memberId: "m-5",
      memberName: "Chris Wilson",
      memberRole: "Infrastructure",
      memberAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
      creditsUsed: 60,
      lastActivity: "2026-05-14T09:30:00.000Z",
    },
  ],
};
