import { test, expect } from "@playwright/test";

/**
 * Feature 51: Captive Portal Onboarding E2E Tests
 * Validates the complete user onboarding journey in the Captive Portal.
 * Mapped to requirements R1 to R9.
 */

const PORTAL_API = "/api/v1/portal/register";

test.describe("Feature 51: Captive Portal Onboarding E2E Flow", () => {
  // R2: Execute within a mobile viewport with touch event simulation enabled
  test.use({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
  });

  // T1 & T2: Verify R1 & R3
  test("R1 & R3: Page accessibility and initial form inputs are present", async ({ page }) => {
    // R1: Target the path /portal and check browser title contains "Connect to WiFi"
    await page.goto("/portal");
    await expect(page).toHaveTitle(/Connect to WiFi/i);

    // R3: Assert initial landing state displays visible inputs and submit button
    const nameInput = page.getByTestId("portal-name-input");
    const phoneInput = page.getByTestId("portal-phone-input");
    const submitButton = page.getByTestId("portal-submit-button");

    await expect(nameInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  // T3: Verify R4 & R5
  test("R4 & R5: Form submission shows loading/connecting state when request is pending", async ({ page }) => {
    // Intercept POST /api/v1/portal/register with a simulated 2-second delay
    await page.route(PORTAL_API, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      void route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { message: "Client registered successfully" },
        }),
      });
    });

    await page.goto("/portal");

    // Populate fields
    await page.getByTestId("portal-name-input").fill("Onboarding Test User");
    await page.getByTestId("portal-phone-input").fill("+15555551212");

    // Click submit
    const submitButton = page.getByTestId("portal-submit-button");
    await submitButton.click();

    // R5: Verify that the submit button becomes disabled and shows a loading state/spinner text
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toContainText(/Connecting/i);
  });

  // T4 & T5: Verify R4, R6, R7 & R8
  test("R4, R6, R7 & R8: Successful onboarding flow displays SSID and copies password to clipboard", async ({ page, context }) => {
    // Mock navigator.clipboard to bypass headless browser restrictions
    await page.addInitScript(() => {
      try {
        let clipboardContent = "";
        Object.defineProperty(navigator, "clipboard", {
          value: {
            writeText: async (text: string) => {
              clipboardContent = text;
              return Promise.resolve();
            },
            readText: async () => {
              return Promise.resolve(clipboardContent);
            },
          },
          configurable: true,
        });
      } catch {
        // Ignored
      }
    });

    // R8: Grant clipboard permissions programmatically
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // R4: Intercept POST /api/v1/portal/register and return successful 201 Created response
    await page.route(PORTAL_API, (route) => {
      void route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { message: "Client registered successfully" },
        }),
      });
    });

    await page.goto("/portal");

    // Populate and submit form
    await page.getByTestId("portal-name-input").fill("Successful Onboarder");
    await page.getByTestId("portal-phone-input").fill("+15555550000");
    await page.getByTestId("portal-submit-button").click();

    // R6: Registration form is hidden and WiFiInfoQrComponent is rendered
    await expect(page.getByTestId("portal-name-input")).not.toBeVisible();
    await expect(page.getByTestId("portal-phone-input")).not.toBeVisible();
    await expect(page.getByTestId("portal-submit-button")).not.toBeVisible();

    // R7: Assert QR view displays SSID "BusinessWiFi" and copy button is visible
    await expect(page.locator("text=BusinessWiFi")).toBeVisible();
    
    // Find the Copy Password button. On the success screen, it is the only button rendered.
    const copyButton = page.locator("main button");
    await expect(copyButton).toBeVisible();

    // Wait for hydration to complete to ensure the click event handler is fully attached
    await page.waitForTimeout(1000);

    // R8: Click "Copy Password" button, verify text updates and clipboard contains welcome123
    await copyButton.click();
    await expect(copyButton).toContainText(/Copied/i);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("welcome123");
  });

  // T6: Verify R9
  test("R9: Unsuccessful onboarding displays error banner and preserves form state", async ({ page }) => {
    // R9: Intercept POST /api/v1/portal/register and return 400 Bad Request error
    const mockErrorMessage = "Invalid phone number format";
    await page.route(PORTAL_API, (route) => {
      void route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: mockErrorMessage,
        }),
      });
    });

    await page.goto("/portal");

    // Populate and submit form
    await page.getByTestId("portal-name-input").fill("Failed Onboarder");
    await page.getByTestId("portal-phone-input").fill("+12345");
    await page.getByTestId("portal-submit-button").click();

    // R9: Verify error banner with role="alert" displays the descriptive error message
    const errorBanner = page.locator('[role="alert"]:not([id="__next-route-announcer__"])');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(mockErrorMessage);

    // R9: Verify registration form inputs remain visible
    await expect(page.getByTestId("portal-name-input")).toBeVisible();
    await expect(page.getByTestId("portal-phone-input")).toBeVisible();
    await expect(page.getByTestId("portal-submit-button")).toBeVisible();
  });
});
