import { describe, it, expect } from "vitest";
import {
  rupeesToBaseCredits,
  calculateTotalCredits,
  validateMinAddFunds,
  buildAddFundsPreview,
  canAfford,
} from "./credits";

describe("credits utils", () => {
  it("converts rupees at 10 credits per rupee", () => {
    expect(rupeesToBaseCredits(10)).toBe(100);
    expect(rupeesToBaseCredits(150)).toBe(1500);
  });

  it("applies pack bonus credits", () => {
    expect(calculateTotalCredits(500)).toBe(5500);
    expect(calculateTotalCredits(150)).toBe(1500);
  });

  it("enforces minimum add funds", () => {
    expect(validateMinAddFunds(149).valid).toBe(false);
    expect(validateMinAddFunds(150).valid).toBe(true);
  });

  it("builds add funds preview with GST and platform fee", () => {
    const preview = buildAddFundsPreview(500);
    expect(preview.baseCredits).toBe(5000);
    expect(preview.bonusCredits).toBe(500);
    expect(preview.totalCredits).toBe(5500);
    expect(preview.gstRupees).toBe(90);
    expect(preview.totalPayableRupees).toBeGreaterThan(500);
  });

  it("checks affordability", () => {
    expect(canAfford(100, 50)).toBe(true);
    expect(canAfford(10, 50)).toBe(false);
  });
});
