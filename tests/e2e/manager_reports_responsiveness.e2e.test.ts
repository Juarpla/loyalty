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

test.describe("Manager Reports Responsiveness", () => {
  test("R1, R2: Mobile portrait (375x667) - chart visibility and no overflow", async ({
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

    // R1: All 24 hourly bars visible
    for (let i = 0; i < 24; i++) {
      const bar = page.getByTestId(`hourly-bar-${i}`);
      await expect(bar).toBeVisible();
    }

    // R1: All 7 weekday bars visible
    for (let i = 0; i < 7; i++) {
      const bar = page.getByTestId(`weekday-bar-${i}`);
      await expect(bar).toBeVisible();
    }

    // R2: No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("R6, R8: Modern mobile portrait (390x844) - chart visibility", async ({
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

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/dashboard");

    // R6, R8: All 24 hourly bars visible and clickable
    for (let i = 0; i < 24; i++) {
      const bar = page.getByTestId(`hourly-bar-${i}`);
      await expect(bar).toBeVisible();
      await expect(bar).toBeEnabled();
    }

    // R6, R8: All 7 weekday bars visible and clickable
    for (let i = 0; i < 7; i++) {
      const bar = page.getByTestId(`weekday-bar-${i}`);
      await expect(bar).toBeVisible();
      await expect(bar).toBeEnabled();
    }
  });

  test("R7, R8: Mobile landscape (844x390) - chart visibility", async ({
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

    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/admin/dashboard");

    // R7, R8: All 24 hourly bars visible and clickable
    for (let i = 0; i < 24; i++) {
      const bar = page.getByTestId(`hourly-bar-${i}`);
      await expect(bar).toBeVisible();
      await expect(bar).toBeEnabled();
    }

    // R7, R8: All 7 weekday bars visible and clickable
    for (let i = 0; i < 7; i++) {
      const bar = page.getByTestId(`weekday-bar-${i}`);
      await expect(bar).toBeVisible();
      await expect(bar).toBeEnabled();
    }
  });

  test("R3, R4: Tablet portrait (768x1024) - chart visibility and no overflow", async ({
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

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/admin/dashboard");

    // R3: All 24 hourly bars visible
    for (let i = 0; i < 24; i++) {
      const bar = page.getByTestId(`hourly-bar-${i}`);
      await expect(bar).toBeVisible();
    }

    // R3: All 7 weekday bars visible
    for (let i = 0; i < 7; i++) {
      const bar = page.getByTestId(`weekday-bar-${i}`);
      await expect(bar).toBeVisible();
    }

    // R4: No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("R5, R9: Desktop (1440x900) - chart visibility and responsive adaptation", async ({
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

    // R5, R9: All 24 hourly bars visible and functional
    for (let i = 0; i < 24; i++) {
      const bar = page.getByTestId(`hourly-bar-${i}`);
      await expect(bar).toBeVisible();
      await expect(bar).toBeEnabled();
    }

    // R5, R9: All 7 weekday bars visible and functional
    for (let i = 0; i < 7; i++) {
      const bar = page.getByTestId(`weekday-bar-${i}`);
      await expect(bar).toBeVisible();
      await expect(bar).toBeEnabled();
    }

    // R9: Chart container adapts responsively - verify chart is fully visible
    const chart = page.getByTestId("traffic-chart");
    await expect(chart).toBeVisible();

    // R9: Verify no overflow on desktop
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });
});