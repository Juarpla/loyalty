import { test, expect } from "@playwright/test";

/**
 * E2E tests for Cashier Dashboard Page (Feature 8)
 * Verifies page renders successfully at desktop viewport (R8).
 */

test.describe("Cashier Dashboard Page", () => {
  test("R8: Page renders at desktop viewport (1440px)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/cash");

    // R1: Page renders with CashierForm
    const form = page.locator('[data-testid="cashier-form"]');
    await expect(form).toBeVisible();

    // R1: Phone and amount inputs visible
    const phoneInput = page.locator('[data-testid="cashier-phone-input"]');
    const amountInput = page.locator('[data-testid="cashier-amount-input"]');
    await expect(phoneInput).toBeVisible();
    await expect(amountInput).toBeVisible();

    // R1: Submit button visible
    const submitBtn = page.locator('[data-testid="cashier-submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveText("Register Sale");

    // R5: No success banner on initial load
    const successBanner = page.locator('[data-testid="success-banner"]');
    await expect(successBanner).not.toBeVisible();

    // R6: No error banner on initial load
    const errorBanner = page.locator('[data-testid="error-banner"]');
    await expect(errorBanner).not.toBeVisible();
  });

  test("R1, R7: Page has correct title and metadata", async ({ page }) => {
    await page.goto("/admin/cash");
    await expect(page).toHaveTitle(/Cashier Dashboard/);
  });
});