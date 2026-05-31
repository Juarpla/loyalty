import { expect, test } from "@playwright/test";

const PORTAL_API = "/api/v1/portal/register";

test.describe("Feature 76: Public guest network captive portal", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test("R1, R2, R8: /portal renders the mobile guest registration flow", async ({
    page,
  }) => {
    await page.goto("/portal");

    await expect(page).toHaveTitle(/Connect to WiFi/);

    const nameInput = page.getByTestId("portal-name-input");
    const phoneInput = page.getByTestId("portal-phone-input");
    const submitButton = page.getByTestId("portal-submit-button");

    await expect(nameInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    await expect(nameInput).toHaveAttribute("required", "");
    await expect(phoneInput).toHaveAttribute("required", "");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    for (const control of [nameInput, phoneInput, submitButton]) {
      const height = await control.evaluate((element) => element.getBoundingClientRect().height);
      expect(height).toBeGreaterThanOrEqual(44);
    }
  });

  test("R3, R4: submitting guest details posts the payload and shows loading state", async ({
    page,
  }) => {
    let postedPayload: unknown = null;

    await page.route(PORTAL_API, async (route) => {
      postedPayload = route.request().postDataJSON();
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ message: "Client registered successfully" }),
      });
    });

    await page.goto("/portal");

    await page.getByTestId("portal-name-input").fill("Public Guest");
    await page.getByTestId("portal-phone-input").fill("+15555557676");
    await page.getByTestId("portal-submit-button").click();

    await expect(page.getByTestId("portal-submit-button")).toBeDisabled();
    await expect(page.getByTestId("portal-submit-button")).toContainText("Connecting...");

    await expect.poll(() => postedPayload).toEqual({
      name: "Public Guest",
      phone: "+15555557676",
    });
  });

  test("R5, R6: successful registration shows inline SVG QR credentials", async ({
    page,
  }) => {
    await page.route(PORTAL_API, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ message: "Client registered successfully" }),
      });
    });

    await page.goto("/portal");

    await page.getByTestId("portal-name-input").fill("QR Guest");
    await page.getByTestId("portal-phone-input").fill("+15555550076");
    await page.getByTestId("portal-submit-button").click();

    await expect(page.getByTestId("portal-name-input")).not.toBeVisible();
    await expect(page.getByTestId("portal-phone-input")).not.toBeVisible();
    await expect(page.getByTestId("portal-submit-button")).not.toBeVisible();

    await expect(page.getByRole("img", { name: "Wi-Fi Automatic Connection QR Code" })).toBeVisible();
    await expect(page.getByText("BusinessWiFi", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy Wi-Fi password to clipboard" })).toBeVisible();
  });

  test("R7: failed registration keeps the form visible with an accessible error", async ({
    page,
  }) => {
    await page.route(PORTAL_API, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Phone number already registered" }),
      });
    });

    await page.goto("/portal");

    await page.getByTestId("portal-name-input").fill("Retry Guest");
    await page.getByTestId("portal-phone-input").fill("+15555550999");
    await page.getByTestId("portal-submit-button").click();

    const errorBanner = page.locator('[role="alert"]:not([id="__next-route-announcer__"])');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText("Phone number already registered");

    await expect(page.getByTestId("portal-name-input")).toBeVisible();
    await expect(page.getByTestId("portal-phone-input")).toBeVisible();
    await expect(page.getByTestId("portal-submit-button")).toBeVisible();
  });
});
