import { test, expect } from "@playwright/test";

test.describe("Arrivals Feed Component E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test route
    await page.goto("/test/arrivals-feed");
  });

  test("R2: Loading skeleton view", async ({ page }) => {
    // Switch to loading scenario
    await page.getByTestId("scenario-btn-loading").click();

    // Verify skeleton container and items
    const skeleton = page.getByTestId("arrivals-feed-skeleton");
    await expect(skeleton).toBeVisible();

    const items = page.getByTestId("arrivals-feed-skeleton-item");
    await expect(items).toHaveCount(3);
  });

  test("R3: Error banner and retry trigger", async ({ page }) => {
    // Switch to error scenario
    await page.getByTestId("scenario-btn-error").click();

    // Verify error banner is visible
    const errorBanner = page.getByTestId("arrivals-feed-error");
    await expect(errorBanner).toBeVisible();

    // Verify correct error message is rendered
    const errorMessage = page.getByTestId("error-message");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Connection failure");

    // Click retry button and check that the counter increments
    const retryButton = page.getByTestId("retry-button");
    await expect(retryButton).toBeVisible();

    const refreshCountBefore = await page.getByTestId("refresh-count").textContent();
    await retryButton.click();
    const refreshCountAfter = await page.getByTestId("refresh-count").textContent();

    expect(Number(refreshCountAfter)).toBe(Number(refreshCountBefore) + 1);
  });

  test("R4: Empty state banner", async ({ page }) => {
    // Switch to empty scenario
    await page.getByTestId("scenario-btn-empty").click();

    // Verify empty state is rendered
    const emptyBanner = page.getByTestId("arrivals-feed-empty");
    await expect(emptyBanner).toBeVisible();
    await expect(emptyBanner).toContainText("No active portal arrivals");
  });

  test("R5, R6: Populated feed lists customer details, WhatsApp links, and manual refresh", async ({ page }) => {
    // Switch to populated scenario
    await page.getByTestId("scenario-btn-populated").click();

    // Verify populated container is rendered
    const populatedContainer = page.getByTestId("arrivals-feed-populated");
    await expect(populatedContainer).toBeVisible();

    // Verify summary stats panel
    const summaryPanel = page.getByTestId("arrivals-summary");
    await expect(summaryPanel).toBeVisible();
    await expect(summaryPanel).toContainText("Total");
    await expect(summaryPanel).toContainText("2");
    await expect(summaryPanel).toContainText("Named");
    await expect(summaryPanel).toContainText("1");
    await expect(summaryPanel).toContainText("Anonymous");
    await expect(summaryPanel).toContainText("1");

    // Card 1: John Doe (Named)
    const card1 = page.getByTestId("arrival-card-login-1");
    await expect(card1).toBeVisible();
    await expect(card1.getByTestId("arrival-name")).toContainText("John Doe");
    await expect(card1.getByTestId("arrival-phone")).toContainText("+5491123456789");
    await expect(card1.getByTestId("arrival-greeting")).toContainText("¡Hola John! Bienvenido de nuevo");

    // Card 2: Cliente Anónimo (Anonymous fallback)
    const card2 = page.getByTestId("arrival-card-login-2");
    await expect(card2).toBeVisible();
    await expect(card2.getByTestId("arrival-name")).toContainText("Cliente Anónimo");
    await expect(card2.getByTestId("arrival-phone")).toContainText("+5491198765432");

    // Verify WhatsApp action link attributes
    const waLink1 = card1.getByTestId("whatsapp-link");
    await expect(waLink1).toBeVisible();
    await expect(waLink1).toHaveAttribute("target", "_blank");
    await expect(waLink1).toHaveAttribute("rel", "noopener noreferrer");
    await expect(waLink1).toHaveAttribute("href", "https://wa.me/5491123456789?text=Hola%20John");

    // Verify manual refresh triggers the callback
    const refreshButton = page.getByTestId("refresh-button");
    await expect(refreshButton).toBeVisible();

    const refreshCountBefore = await page.getByTestId("refresh-count").textContent();
    await refreshButton.click();
    const refreshCountAfter = await page.getByTestId("refresh-count").textContent();

    expect(Number(refreshCountAfter)).toBe(Number(refreshCountBefore) + 1);
  });

  test("R7: Mobile viewport adaptations & scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.getByTestId("scenario-btn-populated").click();

    // Verify populated container adapts on mobile and does not overflow
    const populatedContainer = page.getByTestId("arrivals-feed-populated");
    await expect(populatedContainer).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
