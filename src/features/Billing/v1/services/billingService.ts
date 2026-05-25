import type { ConsumeCreditsPayload } from "../Billing.types";
import { CREDIT_PRICING, getFeatureCost, type CreditFeature } from "../constants/creditPricing";
import { walletStore } from "../mock/walletStore";

/**
 * Centralized billing engine — all credit deductions must go through this service.
 */
export const BillingService = {
  async consumeCredits(payload: ConsumeCreditsPayload) {
    const { walletId, feature, credits, metadata, idempotencyKey } = payload;

    if (!walletId || !idempotencyKey) {
      throw new Error("INVALID_PAYLOAD");
    }

    if (credits <= 0 || !Number.isInteger(credits)) {
      throw new Error("INVALID_CREDIT_AMOUNT");
    }

    const knownFeatureCost = (CREDIT_PRICING as Record<string, number>)[feature];
    if (knownFeatureCost !== undefined && knownFeatureCost !== credits) {
      throw new Error("PRICING_MATRIX_MISMATCH");
    }

    await new Promise((r) => setTimeout(r, 120));

    return walletStore.consumeCredits(credits, feature, idempotencyKey, metadata);
  },

  async consumeFeature(
    walletId: string,
    feature: CreditFeature,
    idempotencyKey: string,
    metadata?: Record<string, unknown>,
  ) {
    const credits = getFeatureCost(feature);
    return this.consumeCredits({
      walletId,
      feature,
      credits,
      metadata,
      idempotencyKey,
    });
  },

  getWallet() {
    return walletStore.getWallet();
  },
};
