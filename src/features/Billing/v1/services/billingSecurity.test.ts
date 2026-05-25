import { describe, it, expect, beforeEach } from "vitest";
import { calculateFraudScore, verifyWebhookSignature } from "../utils/security";
import { walletStore } from "../mock/walletStore";
import { BillingService } from "./billingService";

describe("Billing Security & Cost Protection", () => {
  beforeEach(() => {
    walletStore.resetForTests();
  });

  describe("Webhook Signature Verification", () => {
    it("verifies and rejects malformed signatures", async () => {
      const payload = "amount=500&id=pay-123";
      const signature = "deadbeef";
      const secret = "super-secret";

      const verified = await verifyWebhookSignature(payload, signature, secret);
      expect(verified).toBe(false);
    });
  });

  describe("Fraud Scoring System", () => {
    it("flags high risk transaction inputs", () => {
      const result = calculateFraudScore({
        amountRupees: 15000,
        country: "US",
        idempotencyKey: "pay-123!!!injection",
      });

      expect(result.score).toBeGreaterThanOrEqual(50);
      expect(result.flagged).toBe(true);
      expect(result.reasons.length).toBe(3);
    });

    it("passes standard, safe transactions", () => {
      const result = calculateFraudScore({
        amountRupees: 500,
        country: "IN",
        idempotencyKey: "pay-12345",
      });

      expect(result.score).toBe(0);
      expect(result.flagged).toBe(false);
    });
  });

  describe("Refund Logic", () => {
    it("successfully processes credit refund via ledger", () => {
      const wallet = walletStore.getWallet();
      const initial = wallet.availableCredits;

      const result = walletStore.refundCredits(500, "pay-123", "idem-ref-1");
      expect(result.wallet.availableCredits).toBe(initial + 500);
      
      const transactions = walletStore.getTransactions();
      const lastTx = transactions[0];
      expect(lastTx.transactionType).toBe("REFUND");
      expect(lastTx.credits).toBe(500);
    });

    it("prevents double-spending on duplicate refund idempotency keys", () => {
      const wallet = walletStore.getWallet();
      const initial = wallet.availableCredits;

      const result1 = walletStore.refundCredits(500, "pay-123", "idem-ref-2");
      const result2 = walletStore.refundCredits(500, "pay-123", "idem-ref-2");

      expect(result1.wallet.availableCredits).toBe(initial + 500);
      expect(result2.wallet.availableCredits).toBe(initial + 500); // Should return same cached result
    });
  });

  describe("Daily Limits & Caps", () => {
    it("allows deductions within daily limit", async () => {
      const wallet = walletStore.getWallet();
      
      const res = await BillingService.consumeCredits({
        walletId: wallet.id,
        feature: "AI_SUMMARY",
        credits: 15,
        idempotencyKey: "idem-limit-test-ok",
      });

      expect(res.wallet.availableCredits).toBeLessThan(wallet.availableCredits);
    });
  });

  describe("Ledger Consistency & Idempotency", () => {
    it("records accurate balanceBefore and balanceAfter for purchases", () => {
      const before = walletStore.getWallet().availableCredits;
      const result = walletStore.addFunds(150, "idem-purchase-ledger");

      expect(result.transaction.balanceBefore).toBe(before);
      expect(result.transaction.balanceAfter).toBe(result.wallet.availableCredits);
      expect(result.transaction.balanceAfter - result.transaction.balanceBefore).toBe(
        result.transaction.credits,
      );
      expect(walletStore.validateLedgerConsistency()).toBe(true);
    });

    it("returns the same transaction for duplicate consumption idempotency keys", async () => {
      const wallet = walletStore.getWallet();
      const first = await BillingService.consumeCredits({
        walletId: wallet.id,
        feature: "WEBHOOK_TRIGGER",
        credits: 1,
        idempotencyKey: "idem-consume-repeat",
      });
      const second = await BillingService.consumeCredits({
        walletId: wallet.id,
        feature: "WEBHOOK_TRIGGER",
        credits: 1,
        idempotencyKey: "idem-consume-repeat",
      });

      expect(second.transaction.id).toBe(first.transaction.id);
      expect(second.wallet.availableCredits).toBe(first.wallet.availableCredits);
    });

    it("rejects reused idempotency keys across different operations", () => {
      walletStore.addFunds(150, "idem-cross-operation");
      expect(() => walletStore.refundCredits(150, "pay-cross", "idem-cross-operation")).toThrow(
        "IDEMPOTENCY_KEY_REUSED",
      );
    });

    it("runs configured auto recharge after balance drops below threshold", async () => {
      walletStore.setAutoRecharge(true, 6850, 150);
      const wallet = walletStore.getWallet();

      const result = await BillingService.consumeCredits({
        walletId: wallet.id,
        feature: "AI_SUMMARY",
        credits: 15,
        idempotencyKey: "idem-auto-recharge",
      });

      expect(result.wallet.availableCredits).toBeGreaterThan(wallet.availableCredits);
      expect(walletStore.getTransactions()[0].source).toBe("auto_recharge");
    });
  });
});
