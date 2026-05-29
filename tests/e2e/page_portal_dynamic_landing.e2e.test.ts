import { test, expect } from "@playwright/test";

/**
 * E2E tests for Feature 71: Dynamic Portal Onboarding Landing Page (/portal/[companyId])
 */

const REGISTER_API = "**/api/v1/portal/register";

test.describe("Dynamic Client Landing Page — /portal/[companyId]", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  // ── R1, R2, R3, R5: Accessible and dynamically customized ────────────────────────────────
  test("R1, R2, R3, R5: Correct page title, fetch settings, customized welcome message, SSID & no overflow", async ({
    page,
  }) => {
    // Navigate to a company that uses normal simulation values
    await page.goto("/portal/demo-company");

    // R1: Dynamic route accessible and document title loaded
    await expect(page).toHaveTitle(/Connect to WiFi/);

    // R3 & R5: Custom welcome copy and SSID badge visible (using mock settings from backend simulation)
    const shell = page.getByTestId("dynamic-portal-shell");
    const cta = page.getByTestId("dynamic-portal-cta");
    const ssidBadge = page.getByTestId("dynamic-portal-ssid");

    await expect(shell).toBeVisible();
    await expect(cta).toContainText("Welcome to our WiFi");
    await expect(cta).toContainText("Please sign in to connect");
    await expect(ssidBadge).toContainText("Loyalty Guest WiFi");

    // Form inputs and submit buttons exist
    await expect(page.getByTestId("portal-name-input")).toBeVisible();
    await expect(page.getByTestId("portal-phone-input")).toBeVisible();
    await expect(page.getByTestId("portal-submit-button")).toBeVisible();

    // Verify touch target requirements (>= 44px)
    const nameHeight = await page.getByTestId("portal-name-input").evaluate((el) => el.getBoundingClientRect().height);
    const phoneHeight = await page.getByTestId("portal-phone-input").evaluate((el) => el.getBoundingClientRect().height);
    const submitHeight = await page.getByTestId("portal-submit-button").evaluate((el) => el.getBoundingClientRect().height);

    expect(nameHeight).toBeGreaterThanOrEqual(44);
    expect(phoneHeight).toBeGreaterThanOrEqual(44);
    expect(submitHeight).toBeGreaterThanOrEqual(44);

    // Verify mobile viewport horizontal scroll safety
    const scrollWidth: number = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth: number = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  // ── R4: Failed Settings endpoint -> Graceful Fallback portal ────────────────────────────
  test("R4: Failed settings endpoint renders fallback portal using default credentials", async ({
    page,
  }) => {
    // Navigate to a company ID containing "without-settings" to trigger DB mock null response
    await page.goto("/portal/company-without-settings");

    // Falls back to safe defaults without throwing/white-screening
    await expect(page.getByTestId("dynamic-portal-shell")).toBeVisible();
    const cta = page.getByTestId("dynamic-portal-cta");
    await expect(cta).toContainText("Welcome! Get Free WiFi");
    await expect(cta).toContainText("Register below to connect to our network");

    const ssidBadge = page.getByTestId("dynamic-portal-ssid");
    await expect(ssidBadge).toContainText("BusinessWiFi");
  });

  // ── R6: Successful Registration renders WifiInfoQrComponent with dynamic credentials ───
  test("R6: Successful registration updates page with WiFi QR rendering dynamic credentials", async ({
    page,
  }) => {
    // Intercept portal register route (client-side form submit)
    await page.route(REGISTER_API, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Client registered successfully",
        }),
      });
    });

    await page.goto("/portal/demo-company");

    // Complete form registration
    await page.getByTestId("portal-name-input").fill("Dynamic Customer");
    await page.getByTestId("portal-phone-input").fill("+14155552671");
    await page.getByTestId("portal-submit-button").click();

    // R6: Form disappears
    await expect(page.getByTestId("portal-name-input")).not.toBeVisible();
    await expect(page.getByTestId("portal-submit-button")).not.toBeVisible();

    // R6: QR Code container is shown
    const copyButton = page.getByText("Copy Password", { exact: true });
    await expect(copyButton).toBeVisible({ timeout: 8000 });

    // QR component contains SSID name
    const ssidDisplay = page.locator("text=Loyalty Guest WiFi");
    await expect(ssidDisplay).toBeVisible();
  });
});
