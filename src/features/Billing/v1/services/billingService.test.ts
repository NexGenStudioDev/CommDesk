import { describe, it, expect, beforeEach } from "vitest";
import { BillingService } from "./billingService";
import { walletStore } from "../mock/walletStore";

describe("BillingService", () => {
  beforeEach(() => {
    walletStore.resetForTests();
  });

  it("consumes credits through centralized service", async () => {
    const wallet = walletStore.getWallet();
    const before = wallet.availableCredits;

    await BillingService.consumeCredits({
      walletId: wallet.id,
      feature: "WEBHOOK_TRIGGER",
      credits: 1,
      idempotencyKey: "idem-1",
    });

    expect(walletStore.getWallet().availableCredits).toBe(before - 1);
  });

  it("rejects insufficient credits", async () => {
    const wallet = walletStore.getWallet();
    await expect(
      BillingService.consumeCredits({
        walletId: wallet.id,
        feature: "AI_SUMMARY",
        credits: wallet.availableCredits + 1,
        idempotencyKey: "idem-2",
      }),
    ).rejects.toThrow();
  });

  it("rejects known feature charges that do not match the pricing matrix", async () => {
    const wallet = walletStore.getWallet();
    await expect(
      BillingService.consumeCredits({
        walletId: wallet.id,
        feature: "AI_SUMMARY",
        credits: 1,
        idempotencyKey: "idem-price-mismatch",
      }),
    ).rejects.toThrow("PRICING_MATRIX_MISMATCH");
  });
});
