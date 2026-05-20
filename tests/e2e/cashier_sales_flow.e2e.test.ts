import { test, expect } from "@playwright/test";

/**
 * E2E tests for Cashier Sales Registration Flow (Feature 9)
 * Verifies end-to-end sale registration: fill, submit, success/error banners, form cleared.
 */

test.describe("Cashier Sales Registration Flow", () => {
  test("R1, R2: Mobile (375px) — valid submission shows success banner and clears form", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/cash");

    const phoneInput = page.getByTestId("cashier-phone-input");
    const amountInput = page.getByTestId("cashier-amount-input");

    await phoneInput.fill("+51987654321");
    await amountInput.fill("50");

    await page.getByTestId("cashier-submit").click();

    // R1: Success banner visible with correct message
    const successBanner = page.getByTestId("success-banner");
    await expect(successBanner).toBeVisible();
    await expect(successBanner).toContainText("Sale registered successfully");

    // R2: Form inputs cleared after success
    await expect(phoneInput).toHaveValue("");
    await expect(amountInput).toHaveValue("");
  });

  test("R3: Mobile (375px) — invalid phone shows error banner", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/cash");

    await page.getByTestId("cashier-phone-input").fill("123");
    await page.getByTestId("cashier-amount-input").fill("50");

    await page.getByTestId("cashier-submit").click();

    // R3: Error banner visible with validation message
    const errorBanner = page.getByTestId("error-banner");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText("Invalid phone number format");
  });

  test("R4: Desktop (1440px) — valid submission shows success banner and clears form", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/cash");

    const phoneInput = page.getByTestId("cashier-phone-input");
    const amountInput = page.getByTestId("cashier-amount-input");

    await phoneInput.fill("+51987654321");
    await amountInput.fill("75");

    await page.getByTestId("cashier-submit").click();

    // R4: Success banner visible and form cleared
    const successBanner = page.getByTestId("success-banner");
    await expect(successBanner).toBeVisible();
    await expect(successBanner).toContainText("Sale registered successfully");

    await expect(phoneInput).toHaveValue("");
    await expect(amountInput).toHaveValue("");
  });
});
