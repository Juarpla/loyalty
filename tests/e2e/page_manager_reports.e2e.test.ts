import { test, expect } from "@playwright/test";

const mockTrafficDistribution = {
  hours: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ],
  weekdays: [5, 10, 15, 20, 25, 30, 35],
  peakHour: 23,
  peakWeekday: 6,
  totalTransactions: 276,
};

test.describe("Manager Reports Page", () => {
  test("R7: Page has correct title and metadata", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveTitle("Manager Dashboard | Loyalty");
  });

  test("R1: Header is visible with correct text", async ({ page }) => {
    await page.goto("/admin/dashboard");

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const title = page.locator("h1");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("Manager Dashboard");

    const subtitle = page.locator("p").filter({ hasText: "Traffic and peak hours analytics" });
    await expect(subtitle).toBeVisible();
  });

  test("R6: Navigation links are present with correct hrefs", async ({ page }) => {
    await page.goto("/admin/dashboard");

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    const cashLink = page.locator('a[href="/admin/cash"]');
    const promotionsLink = page.locator('a[href="/admin/promotions"]');
    const socialLink = page.locator('a[href="/admin/social"]');

    await expect(cashLink).toBeVisible();
    await expect(promotionsLink).toBeVisible();
    await expect(socialLink).toBeVisible();

    await expect(cashLink).toHaveText("Cashier");
    await expect(promotionsLink).toHaveText("Promotions");
    await expect(socialLink).toHaveText("Social");
  });

  test("R6: Navigation click routes to Cashier page", async ({ page }) => {
    await page.goto("/admin/dashboard");

    const cashLink = page.locator('a[href="/admin/cash"]');
    await cashLink.click();

    await expect(page).toHaveURL("/admin/cash");
    await expect(page.locator("h1")).toContainText("Cashier");
  });

  test("R2: TrafficChartComponent is included after fetch", async ({ page }) => {
    await page.route("**/api/v1/sales/metrics", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: mockTrafficDistribution,
        }),
      });
    });

    await page.goto("/admin/dashboard");

    const chart = page.getByTestId("traffic-chart");
    await expect(chart).toBeVisible();
  });

  test("R4: Skeleton state is visible during loading", async ({ page }) => {
    let resolveRequest: (() => void) | null = null;

    await page.route("**/api/v1/sales/metrics", async (route) => {
      await new Promise<void>((resolve) => {
        resolveRequest = resolve;
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: mockTrafficDistribution,
        }),
      });
    });

    await page.goto("/admin/dashboard");

    const skeleton = page.getByTestId("traffic-chart-skeleton");
    await expect(skeleton).toBeVisible();

    await expect(page.getByTestId("traffic-chart")).toHaveCount(0);
    await expect(page.getByTestId("traffic-chart-error")).toHaveCount(0);

    if (resolveRequest) {
      resolveRequest();
    }

    await expect(page.getByTestId("traffic-chart")).toBeVisible();
  });

  test("R5: Error banner is visible on failed fetch", async ({ page }) => {
    await page.route("**/api/v1/sales/metrics", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Network failure",
        }),
      });
    });

    await page.goto("/admin/dashboard");

    const errorBanner = page.getByTestId("traffic-chart-error");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText("Network failure");

    await expect(page.getByTestId("traffic-chart-skeleton")).toHaveCount(0);
    await expect(page.getByTestId("traffic-chart")).toHaveCount(0);
  });

  test("R3: Responsive rendering at 375px (phone)", async ({ page }) => {
    await page.route("**/api/v1/sales/metrics", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: mockTrafficDistribution,
        }),
      });
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/dashboard");

    const chart = page.getByTestId("traffic-chart");
    await expect(chart).toBeVisible();

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("R3: Responsive rendering at 768px (tablet)", async ({ page }) => {
    await page.route("**/api/v1/sales/metrics", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: mockTrafficDistribution,
        }),
      });
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/admin/dashboard");

    const chart = page.getByTestId("traffic-chart");
    await expect(chart).toBeVisible();

    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("R3: Responsive rendering at 1440px (desktop)", async ({ page }) => {
    await page.route("**/api/v1/sales/metrics", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: mockTrafficDistribution,
        }),
      });
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/dashboard");

    const chart = page.getByTestId("traffic-chart");
    await expect(chart).toBeVisible();

    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("R8: Semantic landmarks are present", async ({ page }) => {
    await page.goto("/admin/dashboard");

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("R8: Navigation links have visible focus indicators", async ({ page }) => {
    await page.goto("/admin/dashboard");

    const cashLink = page.locator('a[href="/admin/cash"]');
    await cashLink.focus();

    // Verify the element is focused
    await expect(cashLink).toBeFocused();

    // Check computed styles for outline or ring (focus-visible)
    const styles = await cashLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineOffset: computed.outlineOffset,
        boxShadow: computed.boxShadow,
      };
    });

    const hasOutline = styles.outline !== "none" && styles.outline.includes("rgb");
    const hasRing = styles.boxShadow.includes("rgb");

    expect(hasOutline || hasRing).toBe(true);
  });
});
