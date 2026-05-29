import { test, expect } from "@playwright/test";

/**
 * E2E tests for Page Marketing Landing Hub (Feature 73)
 * Verifies root URL rendering, metadata title, presence and endpoints of the 5 subsystem links,
 * and tap-target bounds of all interactive components.
 */

test.describe("Marketing Landing Hub Page — /", () => {
  test.beforeEach(async ({ page }) => {
    // Standard mobile viewport to test tap target sizes in mobile contexts
    await page.setViewportSize({ width: 375, height: 812 });
  });

  // ── R1/R4: Route accessible & metadata title matches ─────────────────────────
  test("R1 & R4: Root route is accessible and has correct metadata title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Loyalty Engine Hub/);
  });

  // ── R2 & R6: Subsystem links exist and match their target routes ─────────────
  test("R2 & R6: All 5 subsystem cards are visible and have correct href links", async ({ page }) => {
    await page.goto("/");

    const cashierLink = page.locator('a[href="/admin/cash"]');
    const dashboardLink = page.locator('a[href="/admin/dashboard"]').first();
    const promotionsLink = page.locator('a[href="/admin/promotions"]');
    const socialLink = page.locator('a[href="/admin/social"]');
    const portalLink = page.locator('a[href="/portal"]').first();

    await expect(cashierLink).toBeVisible();
    await expect(dashboardLink).toBeVisible();
    await expect(promotionsLink).toBeVisible();
    await expect(socialLink).toBeVisible();
    await expect(portalLink).toBeVisible();
  });

  // ── R3 & R6: Touch tap target standards >= 44px ─────────────────────────────
  test("R3 & R6: All interactive link/card entry points have bounding boxes >= 44px x 44px", async ({ page }) => {
    await page.goto("/");

    // We locate all interactive Link/a elements
    const links = await page.locator("a").all();
    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
