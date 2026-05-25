import { test, expect } from "@playwright/test";

const STORAGE_KEY = "commdesk.billing.wallet.v1";

function seededWalletState(availableCredits: number) {
  const now = new Date().toISOString();
  return {
    wallet: {
      id: "wallet-community-1",
      ownerType: "community",
      ownerId: "org-1",
      availableCredits,
      lockedCredits: 0,
      pendingCredits: 0,
      reservedCredits: 0,
      lifetimePurchasedCredits: availableCredits,
      lifetimeUsedCredits: 0,
      autoRechargeEnabled: false,
      autoRechargeThreshold: 200,
      autoRechargeAmountRupees: 150,
      lowBalanceThreshold: 200,
      createdAt: now,
      updatedAt: now,
    },
    transactions: [],
  };
}

function parseCredits(text: string | null) {
  return Number(text?.replace(/[^\d]/g, "") ?? "0");
}

test.describe("Billing & Credits Wallet E2E Scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/org/billing/wallet");
    await page.evaluate((key) => window.localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
  });

  test("Add Funds Flow - Successful UPI Payment", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Community Wallet" })).toBeVisible();
    
    await page.getByRole("button", { name: "Add Funds" }).first().click();
    const addFundsDialog = page.getByRole("dialog", { name: "Add Funds" });
    await expect(addFundsDialog).toBeVisible();

    await addFundsDialog.locator('input[type="number"]').fill("500");

    await expect(addFundsDialog.locator("text=Total credits")).toBeVisible();
    await expect(addFundsDialog.locator("text=5,500").first()).toBeVisible();
    await expect(addFundsDialog.locator("text=Platform fee")).toBeVisible();
    await expect(addFundsDialog.locator("text=GST (18%)")).toBeVisible();

    await addFundsDialog.getByRole("button", { name: "UPI" }).click();
    await addFundsDialog.getByRole("button", { name: /Pay/ }).click();

    await expect(page.locator("text=Processing...")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Payment successful" })).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("button", { name: "Done" }).click();
    await expect(page).toHaveURL(/\/org\/billing\/wallet/);
  });

  test("Add Funds Flow - Failed Payment Simulation", async ({ page }) => {
    await page.goto("/org/billing/add-funds");
    
    await page.fill('input[type="number"]', "150");
    await page.click('#force-fail-checkbox');
    await page.getByRole("button", { name: /Pay/ }).click();

    await expect(page.locator("text=Payment failed")).toBeVisible();
  });

  test("Auto Recharge Configuration Toggle & Save", async ({ page }) => {
    await expect(page.locator("text=Auto Recharge")).toBeVisible();

    const thresholdInput = page.locator('input[type="number"]').first();
    const amountInput = page.locator('input[type="number"]').last();
    await expect(thresholdInput).toBeDisabled();

    await page.click('input[type="checkbox"]');
    
    await expect(thresholdInput).toBeEnabled();
    await thresholdInput.fill("300");
    await amountInput.fill("500");

    await page.getByRole("button", { name: "Save Settings" }).click();

    await expect(page.locator("text=Auto recharge settings updated")).toBeVisible();
  });

  test("Graceful Credit Exhaustion & Low Balance Alerts", async ({ page }) => {
    await page.evaluate(
      ({ key, state }) => window.localStorage.setItem(key, JSON.stringify(state)),
      { key: STORAGE_KEY, state: seededWalletState(100) },
    );
    await page.reload();

    await expect(page.getByTestId("low-balance-modal-title")).toHaveText("Low Balance");
    await expect(page.getByTestId("low-balance-add-funds")).toBeVisible();

    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByTestId("low-balance-modal-title")).not.toBeVisible();
  });

  test("Centralized Credit Consumption - AI usage deduction updates balance", async ({ page }) => {
    const initialBalanceText = await page.getByTestId("wallet-stat-available-value").textContent();
    const initialBalance = parseCredits(initialBalanceText);

    await page.getByRole("button", { name: "AI Features" }).click();
    await page.getByTestId("generate-ai-summary").click();

    await expect(page.locator("text=AI Summary Generated")).toBeVisible();
    await page.getByRole("button", { name: "Transactions" }).click();
    await expect(page.locator("text=AI_SUMMARY").first()).toBeVisible();
    
    await page.getByRole("button", { name: "Overview" }).click();
    const expectedBalanceText = (initialBalance - 15).toLocaleString("en-IN");
    await expect(page.getByTestId("wallet-stat-available-value")).toHaveText(expectedBalanceText);
  });
});
