import { test, expect } from "@playwright/test";

test.describe("Predictive Card Component", () => {
  test("R1: Active prediction card renders with shift direction and summary", async ({
    page,
  }) => {
    await page.goto("/test/predictive-card");

    // Click the increasing scenario
    await page.getByTestId("scenario-increasing").click();

    // R1: Active card is visible
    const card = page.getByTestId("predictive-card-active");
    await expect(card).toBeVisible();

    // R1: Shift badge is visible with correct label
    const badge = page.getByTestId("shift-badge");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("Increasing");

    // R1: Summary text is displayed
    await expect(card).toContainText(
      "Weekend traffic is trending upward. Expect higher visitor counts.",
    );

    // R1: Data span is shown
    await expect(card).toContainText("45 days");
  });

  test("R1: Decreasing shift renders with red indicator", async ({ page }) => {
    await page.goto("/test/predictive-card");

    await page.getByTestId("scenario-decreasing").click();

    const card = page.getByTestId("predictive-card-active");
    await expect(card).toBeVisible();

    const badge = page.getByTestId("shift-badge");
    await expect(badge).toContainText("Decreasing");

    await expect(card).toContainText(
      "Weekend traffic is trending downward. Consider promotional actions.",
    );

    // R5: Latest trend shows negative percentage
    const trend = page.getByTestId("latest-trend");
    await expect(trend).toBeVisible();
    await expect(trend).toContainText("-46.67%");
  });

  test("R1: Stable shift renders with neutral indicator", async ({ page }) => {
    await page.goto("/test/predictive-card");

    await page.getByTestId("scenario-stable").click();

    const card = page.getByTestId("predictive-card-active");
    await expect(card).toBeVisible();

    const badge = page.getByTestId("shift-badge");
    await expect(badge).toContainText("Stable");

    await expect(card).toContainText(
      "Weekend traffic remains stable. No significant changes expected.",
    );
  });

  test("R2: Inactive prediction renders with insufficient data message", async ({
    page,
  }) => {
    await page.goto("/test/predictive-card");

    await page.getByTestId("scenario-inactive").click();

    const card = page.getByTestId("predictive-card-inactive");
    await expect(card).toBeVisible();

    // R2: Shows insufficient data message
    await expect(card).toContainText("Insufficient historical data");
    await expect(card).toContainText("15 days");
    await expect(card).toContainText("At least 30 days required");
  });

  test("R3: Null prediction renders skeleton loading state", async ({
    page,
  }) => {
    await page.goto("/test/predictive-card");

    await page.getByTestId("scenario-loading").click();

    const skeleton = page.getByTestId("predictive-card-skeleton");
    await expect(skeleton).toBeVisible();

    // R3: Active and inactive cards should not be present
    await expect(page.getByTestId("predictive-card-active")).toHaveCount(0);
    await expect(page.getByTestId("predictive-card-inactive")).toHaveCount(0);
  });

  test("R4: Mobile viewport — card renders without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/test/predictive-card");

    // Test active card on mobile
    await page.getByTestId("scenario-increasing").click();
    const activeCard = page.getByTestId("predictive-card-active");
    await expect(activeCard).toBeVisible();

    // R4: No horizontal scroll on mobile
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Test inactive card on mobile
    await page.getByTestId("scenario-inactive").click();
    const inactiveCard = page.getByTestId("predictive-card-inactive");
    await expect(inactiveCard).toBeVisible();

    // R4: No horizontal scroll with inactive card
    const scrollWidth2 = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth2).toBeLessThanOrEqual(clientWidth);
  });
});
