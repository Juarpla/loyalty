import { test, expect } from "@playwright/test";

const mockSegments = {
  success: true,
  data: {
    segments: [
      {
        phone_number: "+521234567890",
        name: "Juan",
        visit_count: 45,
        average_ticket: 320.5,
        last_transaction_date: "2026-04-15T10:30:00Z",
        segment: "inactive_30d" as const,
      },
      {
        phone_number: "+529876543210",
        name: "Maria",
        visit_count: 12,
        average_ticket: 850.0,
        last_transaction_date: "2026-05-20T14:00:00Z",
        segment: "high_spender" as const,
      },
      {
        phone_number: "+525551234567",
        name: "Carlos",
        visit_count: 28,
        average_ticket: 150.0,
        last_transaction_date: "2026-05-22T09:15:00Z",
        segment: "frequent" as const,
      },
    ],
    summary: { inactive_30d: 1, high_spender: 1, frequent: 1, unassigned: 0 },
  },
};

const mockCampaigns = {
  success: true,
  data: {
    campaigns: [
      {
        phone_number: "+521234567890",
        recoveryCopy:
          "¡Hola Juan! Hemos extrañado tu visita. Vuelve hoy y disfruta de un 15% de descuento en tu próxima compra. ¡Te esperamos!",
        generatedAt: "2026-05-24T10:00:00.000Z",
      },
      {
        phone_number: "+521234567890",
        recoveryCopy:
          "Juan, tiene 30 días sin visitarnos. Como agradecimiento por ser parte de nuestra comunidad, te regalamos una bebida gratis en tu próximo pedido.",
        generatedAt: "2026-05-24T10:00:01.000Z",
      },
    ],
  },
};

test.describe("Manager Promotions Page", () => {
  test("R1: Page has correct title and metadata", async ({ page }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.goto("/admin/promotions");
    await expect(page).toHaveTitle("Promotions Manager | Loyalty");
  });

  test("R2: Header is visible with correct text", async ({ page }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.goto("/admin/promotions");

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const title = page.locator("h1");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("Promotions Manager");

    const subtitle = page.locator("p").filter({
      hasText: "Customer segments and campaign generation",
    });
    await expect(subtitle).toBeVisible();
  });

  test("R3: Navigation links are present with correct hrefs", async ({
    page,
  }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.goto("/admin/promotions");

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    const cashLink = page.locator('a[href="/admin/cash"]');
    const dashboardLink = page.locator('a[href="/admin/dashboard"]');
    const socialLink = page.locator('a[href="/admin/social"]');

    await expect(cashLink).toBeVisible();
    await expect(dashboardLink).toBeVisible();
    await expect(socialLink).toBeVisible();

    await expect(cashLink).toHaveText("Cashier");
    await expect(dashboardLink).toHaveText("Dashboard");
    await expect(socialLink).toHaveText("Social");
  });

  test("R3: Navigation click routes to Dashboard page", async ({ page }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.goto("/admin/promotions");

    const dashboardLink = page.locator('a[href="/admin/dashboard"]');
    await dashboardLink.click();

    await expect(page).toHaveURL("/admin/dashboard");
  });

  test("R4: SegmentCards component renders with populated data", async ({
    page,
  }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.goto("/admin/promotions");

    const populated = page.getByTestId("segment-cards-populated");
    await expect(populated).toBeVisible();

    await expect(page.getByTestId("segment-card-inactive_30d")).toBeVisible();
    await expect(page.getByTestId("segment-card-high_spender")).toBeVisible();
    await expect(page.getByTestId("segment-card-frequent")).toBeVisible();
  });

  test("R5: Campaign generation triggers and shows results", async ({
    page,
  }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.route("**/api/v1/promotions/generate", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockCampaigns),
      });
    });

    await page.goto("/admin/promotions");

    // Click the first Generate Campaign button
    const generateBtn = page.getByTestId("select-inactive_30d");
    await generateBtn.click();

    // Wait for campaign results to appear
    const results = page.getByTestId("campaigns-results");
    await expect(results).toBeVisible();

    // Verify campaign cards are rendered
    await expect(page.getByTestId("campaign-card-0")).toBeVisible();
    await expect(page.getByTestId("campaign-card-1")).toBeVisible();
  });

  test("R6: Skeleton state is visible during campaign generation", async ({
    page,
  }) => {
    let resolveRequest: (() => void) | null = null;

    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.route("**/api/v1/promotions/generate", async (route) => {
      await new Promise<void>((resolve) => {
        resolveRequest = resolve;
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockCampaigns),
      });
    });

    await page.goto("/admin/promotions");

    const generateBtn = page.getByTestId("select-inactive_30d");
    await generateBtn.click();

    // Skeleton should be visible while request is pending
    const skeleton = page.getByTestId("campaigns-loading");
    await expect(skeleton).toBeVisible();

    await expect(page.getByTestId("campaigns-results")).toHaveCount(0);
    await expect(page.getByTestId("campaigns-error")).toHaveCount(0);

    if (resolveRequest) {
      resolveRequest();
    }

    // After resolution, results should appear
    await expect(page.getByTestId("campaigns-results")).toBeVisible();
  });

  test("R7: Error banner is visible on failed campaign generation", async ({
    page,
  }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.route("**/api/v1/promotions/generate", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Gemini API rate limit exceeded",
        }),
      });
    });

    await page.goto("/admin/promotions");

    const generateBtn = page.getByTestId("select-inactive_30d");
    await generateBtn.click();

    const errorBanner = page.getByTestId("campaigns-error");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText("Gemini API rate limit exceeded");

    await expect(page.getByTestId("campaigns-loading")).toHaveCount(0);
    await expect(page.getByTestId("campaigns-results")).toHaveCount(0);
  });

  test("R8: Responsive rendering at 375px (phone)", async ({ page }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/promotions");

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("R8: Responsive rendering at 768px (tablet)", async ({ page }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/admin/promotions");

    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("R8: Responsive rendering at 1440px (desktop)", async ({ page }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/promotions");

    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("R9: Semantic landmarks are present", async ({ page }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.goto("/admin/promotions");

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("R9: Navigation links have visible focus indicators", async ({
    page,
  }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.goto("/admin/promotions");

    const cashLink = page.locator('a[href="/admin/cash"]');
    await cashLink.focus();

    await expect(cashLink).toBeFocused();

    const styles = await cashLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineOffset: computed.outlineOffset,
        boxShadow: computed.boxShadow,
      };
    });

    const hasOutline =
      styles.outline !== "none" && styles.outline.includes("rgb");
    const hasRing = styles.boxShadow.includes("rgb");

    expect(hasOutline || hasRing).toBe(true);
  });
});
