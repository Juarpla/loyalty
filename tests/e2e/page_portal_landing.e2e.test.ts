import { test, expect } from "@playwright/test";

/**
 * E2E tests for Portal Landing Page (Feature 50)
 * Verifies registration form rendering, mobile layout, API mocking, and state transitions.
 */

const PORTAL_API = "/api/v1/portal/register";

test.describe("Portal Landing Page — /portal", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  // ── R1: Route accessible ────────────────────────────────────────────────────
  test("R1: Page is accessible at /portal and has correct title", async ({
    page,
  }) => {
    await page.goto("/portal");
    await expect(page).toHaveTitle(/Connect to WiFi/);
  });

  // ── R4: Form inputs present ─────────────────────────────────────────────────
  test("R4: Registration form inputs and submit button are present at 375px viewport", async ({
    page,
  }) => {
    await page.goto("/portal");

    const nameInput = page.getByTestId("portal-name-input");
    const phoneInput = page.getByTestId("portal-phone-input");
    const submitButton = page.getByTestId("portal-submit-button");

    await expect(nameInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  // ── R8: No horizontal overflow at 375px ─────────────────────────────────────
  test("R8: No horizontal overflow at 375px mobile viewport", async ({
    page,
  }) => {
    await page.goto("/portal");

    const scrollWidth: number = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const clientWidth: number = await page.evaluate(
      () => document.documentElement.clientWidth
    );

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for sub-pixel rounding
  });

  // ── R9: Minimum touch target height ─────────────────────────────────────────
  test("R9: Name input has min-height >= 44px", async ({ page }) => {
    await page.goto("/portal");

    const nameInput = page.getByTestId("portal-name-input");
    const height = await nameInput.evaluate(
      (el) => el.getBoundingClientRect().height
    );
    expect(height).toBeGreaterThanOrEqual(44);
  });

  test("R9: Phone input has min-height >= 44px", async ({ page }) => {
    await page.goto("/portal");

    const phoneInput = page.getByTestId("portal-phone-input");
    const height = await phoneInput.evaluate(
      (el) => el.getBoundingClientRect().height
    );
    expect(height).toBeGreaterThanOrEqual(44);
  });

  test("R9: Submit button has min-height >= 44px", async ({ page }) => {
    await page.goto("/portal");

    const submitButton = page.getByTestId("portal-submit-button");
    const height = await submitButton.evaluate(
      (el) => el.getBoundingClientRect().height
    );
    expect(height).toBeGreaterThanOrEqual(44);
  });

  // ── R6: Success state — WiFi QR shown, form hidden ──────────────────────────
  test("R6: Mocked 201 response shows WiFi QR view and hides the registration form", async ({
    page,
  }) => {
    await page.route(PORTAL_API, (route) => {
      void route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ message: "Client registered successfully" }),
      });
    });

    await page.goto("/portal");

    // Fill and submit the form
    await page.getByTestId("portal-name-input").fill("Test User");
    await page.getByTestId("portal-phone-input").fill("+15555550100");
    await page.getByTestId("portal-submit-button").click();

    // R6: Form should be gone
    await expect(page.getByTestId("portal-name-input")).not.toBeVisible();
    await expect(page.getByTestId("portal-submit-button")).not.toBeVisible();

    // R6: WifiInfoQrComponent output should be visible (Copy Password button text)
    const copyBtn = page.getByText("Copy Password", { exact: true });
    await expect(copyBtn).toBeVisible({ timeout: 8000 });
  });

  // ── R7: Error banner on 400 response ────────────────────────────────────────
  test("R7: Mocked 400 response shows role=alert error banner", async ({
    page,
  }) => {
    await page.route(PORTAL_API, (route) => {
      void route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Phone number already registered" }),
      });
    });

    await page.goto("/portal");

    await page.getByTestId("portal-name-input").fill("Test User");
    await page.getByTestId("portal-phone-input").fill("+15555550100");
    await page.getByTestId("portal-submit-button").click();

    // R7: Error banner visible with role=alert (exclude Next.js route announcer)
    const errorBanner = page.locator('[role="alert"]:not([id="__next-route-announcer__"])');
    await expect(errorBanner).toBeVisible({ timeout: 8000 });
    await expect(errorBanner).toContainText("Phone number already registered");

    // R7: Form remains visible (user can retry)
    await expect(page.getByTestId("portal-name-input")).toBeVisible();
  });
});
