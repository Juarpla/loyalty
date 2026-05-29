import { test, expect } from "@playwright/test";

/**
 * E2E tests for Feature 72: Company WiFi Settings Management Dashboard (/admin/company/settings)
 */

const SETTINGS_API = "**/api/v1/company/demo-company/wifi";

test.describe("Company WiFi Settings Management Dashboard — /admin/company/settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  // ── R1, R2, R3, R4, R8: Accessible, prefilled, and responsive with no overflow ───
  test("R1, R2, R3, R4, R8: Renders settings, fetches demo-company wifi configuration, shows mockup prefilled details, and responsive checks", async ({
    page,
  }) => {
    // Intercept settings GET request
    await page.route(SETTINGS_API, async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              company_id: "demo-company",
              ssid: "PrefilledSSID",
              wifi_password: "prefilledsecurepassword",
              welcome_title: "Prefilled Welcome",
              welcome_message: "Prefilled Message",
              brand_color: "#ea580c",
            },
          }),
        });
      }
    });

    await page.goto("/admin/company/settings");

    // R3 & R4: Verify values are loaded into input fields
    await expect(page.getByTestId("wifi-ssid-input")).toHaveValue("PrefilledSSID");
    await expect(page.getByTestId("wifi-password-input")).toHaveValue("prefilledsecurepassword");
    await expect(page.getByTestId("welcome-title-input")).toHaveValue("Prefilled Welcome");
    await expect(page.getByTestId("welcome-message-input")).toHaveValue("Prefilled Message");
    await expect(page.getByTestId("brand-color-input")).toHaveValue("#ea580c");

    // R6 & Live Preview card: Mockup updates automatically
    const previewCard = page.getByTestId("portal-preview-card");
    await expect(previewCard).toContainText("Prefilled Welcome");
    await expect(previewCard).toContainText("Prefilled Message");
    await expect(previewCard).toContainText("PrefilledSSID");

    // R8: Verify touch target height requirements (>= 44px)
    const ssidHeight = await page.getByTestId("wifi-ssid-input").evaluate((el) => el.getBoundingClientRect().height);
    const passwordHeight = await page.getByTestId("wifi-password-input").evaluate((el) => el.getBoundingClientRect().height);
    const saveButtonHeight = await page.getByTestId("settings-save-button").evaluate((el) => el.getBoundingClientRect().height);

    expect(ssidHeight).toBeGreaterThanOrEqual(44);
    expect(passwordHeight).toBeGreaterThanOrEqual(44);
    expect(saveButtonHeight).toBeGreaterThanOrEqual(44);

    // R8: Scroll safety with mobile viewport width
    const scrollWidth: number = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth: number = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  // ── R6: Real-time Brand Color swatch and Live Preview card accents update ─────────────
  test("R6: Swatch and preview accents update in real time as brand color changes", async ({
    page,
  }) => {
    await page.route(SETTINGS_API, async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              company_id: "demo-company",
              ssid: "DemoSSID",
              wifi_password: "password123",
              welcome_title: "Hello Title",
              welcome_message: "Hello Message",
              brand_color: "#6366f1",
            },
          }),
        });
      }
    });

    await page.goto("/admin/company/settings");

    // Change brand color hex
    const colorInput = page.getByTestId("brand-color-input");
    await colorInput.fill("#22c55e"); // Green hex

    // Verify swatch element style background color
    const swatch = page.getByTestId("color-swatch");
    const backgroundColor = await swatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // rgb(34, 197, 94) represents #22c55e
    expect(backgroundColor).toContain("rgb(34, 197, 94)");
  });

  // ── R7: Form Saving submission trigger and Success Banner display ───────────────────
  test("R7: Form submission triggers POST and displays success banner upon success", async ({
    page,
  }) => {
    let postCallTriggered = false;

    await page.route(SETTINGS_API, async (route) => {
      const method = route.request().method();
      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              company_id: "demo-company",
              ssid: "SuperSSID",
              wifi_password: "password123",
              welcome_title: "Welcome Title",
              welcome_message: "Welcome Message",
              brand_color: "#ea580c",
            },
          }),
        });
      } else if (method === "POST") {
        postCallTriggered = true;
        const body = JSON.parse(route.request().postData() || "{}");
        expect(body.ssid).toBe("NewSSID");
        expect(body.wifi_password).toBe("newsecurepassword");

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              company_id: "demo-company",
              ...body,
            },
          }),
        });
      }
    });

    await page.goto("/admin/company/settings");

    // Update form input fields
    await page.getByTestId("wifi-ssid-input").fill("NewSSID");
    await page.getByTestId("wifi-password-input").fill("newsecurepassword");

    // Click save settings button
    await page.getByTestId("settings-save-button").click();

    // Verify success status banner displays correctly
    await expect(page.getByTestId("settings-success-banner")).toBeVisible();
    expect(postCallTriggered).toBe(true);
  });

  // ── R7: Form Saving network failure displays Error Banner gracefully ────────────────
  test("R7: Form submission showing network error banner gracefully when API request fails", async ({
    page,
  }) => {
    await page.route(SETTINGS_API, async (route) => {
      const method = route.request().method();
      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              company_id: "demo-company",
              ssid: "SuperSSID",
              wifi_password: "password123",
              welcome_title: "Welcome Title",
              welcome_message: "Welcome Message",
              brand_color: "#ea580c",
            },
          }),
        });
      } else if (method === "POST") {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            error: "Validation failed: WiFi password must be between 8 and 64 characters",
          }),
        });
      }
    });

    await page.goto("/admin/company/settings");

    // Trigger error validation by putting invalid password length
    await page.getByTestId("wifi-password-input").fill("short");
    await page.getByTestId("settings-save-button").click();

    // Verify error status banner displays correctly
    await expect(page.getByTestId("settings-error-banner")).toBeVisible();
    await expect(page.getByTestId("settings-error-banner")).toContainText("WiFi password must be between 8 and 64 characters");
  });
});
