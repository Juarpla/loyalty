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

test.describe("Traffic Charts Component", () => {
  test("R9: Intercepted metrics — charts render with correct bar counts", async ({
    page,
  }) => {
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

    // R9: Traffic chart container is visible
    const chart = page.getByTestId("traffic-chart");
    await expect(chart).toBeVisible();

    // R1: 24 hourly bars are rendered
    for (let i = 0; i < 24; i++) {
      const bar = page.getByTestId(`hourly-bar-${i}`);
      await expect(bar).toBeVisible();
    }

    // R2: 7 weekday bars are rendered
    for (let i = 0; i < 7; i++) {
      const bar = page.getByTestId(`weekday-bar-${i}`);
      await expect(bar).toBeVisible();
    }
  });

  test("R9: Mobile viewport — charts remain visible without overflow", async ({
    page,
  }) => {
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

    // R7, R9: Chart is visible on narrow viewport
    const chart = page.getByTestId("traffic-chart");
    await expect(chart).toBeVisible();

    // R7: All hourly bars visible (responsive, no overflow)
    for (let i = 0; i < 24; i++) {
      const bar = page.getByTestId(`hourly-bar-${i}`);
      await expect(bar).toBeVisible();
    }

    // R7: All weekday bars visible
    for (let i = 0; i < 7; i++) {
      const bar = page.getByTestId(`weekday-bar-${i}`);
      await expect(bar).toBeVisible();
    }
  });

  test("R5: Loading state renders skeleton and suppresses chart bars", async ({
    page,
  }) => {
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

    // R5: Skeleton should be visible while request is pending
    const skeleton = page.getByTestId("traffic-chart-skeleton");
    await expect(skeleton).toBeVisible();

    // R5: Chart bars should not be present during loading
    await expect(page.getByTestId("hourly-bar-0")).toHaveCount(0);
    await expect(page.getByTestId("weekday-bar-0")).toHaveCount(0);

    // R5: Error banner should not be present during loading
    await expect(page.getByTestId("traffic-chart-error")).toHaveCount(0);

    // Resolve the pending request so the page can finish loading
    if (resolveRequest) {
      resolveRequest();
    }

    // Wait for charts to appear after resolving
    await expect(page.getByTestId("traffic-chart")).toBeVisible();
  });

  test("R6: Error state renders error banner and suppresses charts/skeleton", async ({
    page,
  }) => {
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

    // R6: Error banner should be visible
    const errorBanner = page.getByTestId("traffic-chart-error");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText("Network failure");

    // R6: Skeleton should not be present
    await expect(page.getByTestId("traffic-chart-skeleton")).toHaveCount(0);

    // R6: Chart bars should not be present
    await expect(page.getByTestId("hourly-bar-0")).toHaveCount(0);
    await expect(page.getByTestId("weekday-bar-0")).toHaveCount(0);

    // R6: Main chart container should not be present
    await expect(page.getByTestId("traffic-chart")).toHaveCount(0);
  });
});
