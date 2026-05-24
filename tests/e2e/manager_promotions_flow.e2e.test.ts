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

const mockEmptySegments = {
  success: true,
  data: {
    segments: [],
    summary: { inactive_30d: 0, high_spender: 0, frequent: 0, unassigned: 0 },
  },
};

const mockErrorResponse = {
  success: false,
  error: "Gemini API rate limit exceeded",
};

test.describe("Manager Promotions Campaign Flow", () => {
  test("R4: Segment cards render for all segments when page loads", async ({
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

    await expect(
      page.getByTestId("segment-card-inactive_30d"),
    ).toBeVisible();
    await expect(
      page.getByTestId("segment-card-high_spender"),
    ).toBeVisible();
    await expect(page.getByTestId("segment-card-frequent")).toBeVisible();
  });

  test("R5,R7: Skeleton loading state while campaign generation is pending, then results appear", async ({
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

    const skeleton = page.getByTestId("campaigns-loading");
    await expect(skeleton).toBeVisible();
    await expect(page.getByTestId("campaigns-results")).toHaveCount(0);
    await expect(page.getByTestId("campaigns-error")).toHaveCount(0);

    if (resolveRequest) {
      resolveRequest();
    }

    await expect(page.getByTestId("campaigns-results")).toBeVisible();
  });

  test("R6,R9: Campaign draft cards render with recoveryCopy and generatedAt on success", async ({
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

    const generateBtn = page.getByTestId("select-inactive_30d");
    await generateBtn.click();

    const results = page.getByTestId("campaigns-results");
    await expect(results).toBeVisible();

    const card0 = page.getByTestId("campaign-card-0");
    await expect(card0).toBeVisible();
    await expect(card0).toContainText(
      "¡Hola Juan! Hemos extrañado tu visita.",
    );
    await expect(card0).toContainText("To: +521234567890");
    await expect(card0).toContainText(/\d+:\d+/);

    const card1 = page.getByTestId("campaign-card-1");
    await expect(card1).toBeVisible();
    await expect(card1).toContainText(
      "Juan, tiene 30 días sin visitarnos.",
    );
    await expect(card1).toContainText("To: +521234567890");
    await expect(card1).toContainText(/\d+:\d+/);
  });

  test("R8: Error banner appears on campaign generation API 500 failure", async ({
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
        body: JSON.stringify(mockErrorResponse),
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

  test("R10: Empty segments renders empty state", async ({ page }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockEmptySegments),
      });
    });

    await page.goto("/admin/promotions");

    const emptyState = page.getByTestId("segment-cards-empty");
    await expect(emptyState).toBeVisible();
  });

  test("R11: 375px mobile viewport — no horizontal overflow", async ({
    page,
  }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/promotions");

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("R12: 1440px desktop viewport — correct rendering", async ({
    page,
  }) => {
    await page.route("**/api/v1/promotions/segments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockSegments),
      });
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/promotions");

    await expect(
      page.getByTestId("segment-card-inactive_30d"),
    ).toBeVisible();
    await expect(
      page.getByTestId("segment-card-high_spender"),
    ).toBeVisible();
    await expect(page.getByTestId("segment-card-frequent")).toBeVisible();
  });
});
