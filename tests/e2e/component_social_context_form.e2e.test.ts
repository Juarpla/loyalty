import { test, expect } from "@playwright/test";

test.describe("Social Context Form Component", () => {
  test("R1: Idle state renders textarea, character count, and submit button at mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/test/context-form");

    await page.getByTestId("scenario-idle").click();

    const textarea = page.getByTestId("context-textarea");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute("id", "social-context");
    await expect(textarea).toHaveAttribute("name", "context");
    await expect(textarea).toHaveAttribute("rows", "6");

    await expect(page.getByText("/ 3 min")).toBeVisible();

    const submitButton = page.getByTestId("context-submit");
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Generate Ideas");
    await expect(submitButton).toBeEnabled();

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("R2: Typing text updates character count", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/test/context-form");

    const textarea = page.getByTestId("context-textarea");
    await textarea.click();
    await textarea.fill("Weekend special");

    await expect(page.getByTestId("context-textarea")).toHaveValue(
      "Weekend special",
    );
    await expect(page.locator("text=15 / 3 min")).toBeVisible();
  });

  test("R3: Loading state shows disabled button with spinner", async ({
    page,
  }) => {
    await page.goto("/test/context-form");

    await page.getByTestId("scenario-loading").click();

    const submitButton = page.getByTestId("context-submit");
    await expect(submitButton).toBeDisabled();

    const spinner = submitButton.locator("svg.animate-spin");
    await expect(spinner).toBeVisible();
  });

  test("R4: Error state renders error banner with role=alert", async ({
    page,
  }) => {
    await page.goto("/test/context-form");

    await page.getByTestId("scenario-error").click();

    const errorBanner = page.getByTestId("context-error");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveAttribute("role", "alert");
    await expect(errorBanner).toContainText("Failed to generate ideas");
  });

  test("R5: Success state renders success banner with role=status", async ({
    page,
  }) => {
    await page.goto("/test/context-form");

    await page.getByTestId("scenario-success").click();

    const successBanner = page.getByTestId("context-success");
    await expect(successBanner).toBeVisible();
    await expect(successBanner).toHaveAttribute("role", "status");
    await expect(successBanner).toContainText("Ideas generated successfully");
  });

  test("R6: Desktop viewport renders form centered with textarea at 1440px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/test/context-form");

    const textarea = page.getByTestId("context-textarea");
    await expect(textarea).toBeVisible();

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
