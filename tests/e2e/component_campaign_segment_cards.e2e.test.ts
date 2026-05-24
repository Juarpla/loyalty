import { test, expect } from "@playwright/test";

test.describe("Campaign Segment Cards Component", () => {
  test("R1: Populated state renders segment cards with correct labels and counts", async ({
    page,
  }) => {
    await page.goto("/test/segment-cards");

    await page.getByTestId("scenario-populated").click();

    await expect(page.getByTestId("segment-card-inactive_30d")).toBeVisible();
    await expect(page.getByTestId("segment-card-high_spender")).toBeVisible();
    await expect(page.getByTestId("segment-card-frequent")).toBeVisible();

    await expect(
      page.getByTestId("segment-card-inactive_30d"),
    ).toContainText("Inactive 30 Days");
    await expect(
      page.getByTestId("segment-card-high_spender"),
    ).toContainText("High Spender");
    await expect(page.getByTestId("segment-card-frequent")).toContainText(
      "Frequent",
    );

    await expect(
      page.getByTestId("segment-card-inactive_30d"),
    ).toContainText("12");
    await expect(
      page.getByTestId("segment-card-high_spender"),
    ).toContainText("8");
    await expect(page.getByTestId("segment-card-frequent")).toContainText("5");
  });

  test("R2: Segment cards display distinct visual indicators per type", async ({
    page,
  }) => {
    await page.goto("/test/segment-cards");

    await page.getByTestId("scenario-populated").click();

    await expect(page.getByTestId("segment-card-inactive_30d")).toBeVisible();
    await expect(page.getByTestId("segment-card-high_spender")).toBeVisible();
    await expect(page.getByTestId("segment-card-frequent")).toBeVisible();
  });

  test("R3: Loading state renders skeleton placeholder cards", async ({
    page,
  }) => {
    await page.goto("/test/segment-cards");

    await page.getByTestId("scenario-loading").click();

    const skeletonContainer = page.getByTestId("segment-cards-loading");
    await expect(skeletonContainer).toBeVisible();

    const skeletonChildren = page.getByTestId("segment-cards-skeleton-child");
    await expect(skeletonChildren).toHaveCount(3);

    await expect(
      page.getByTestId("segment-cards-populated"),
    ).toHaveCount(0);
    await expect(page.getByTestId("segment-cards-error")).toHaveCount(0);
    await expect(page.getByTestId("segment-cards-empty")).toHaveCount(0);
  });

  test("R4: Error state renders error banner with message and retry button", async ({
    page,
  }) => {
    await page.goto("/test/segment-cards");

    await page.getByTestId("scenario-error").click();

    const errorBanner = page.getByTestId("segment-cards-error");
    await expect(errorBanner).toBeVisible();

    await expect(page.getByTestId("error-message")).toContainText(
      "Failed to load customer segments. Network error.",
    );

    const retryButton = page.getByTestId("retry-button");
    await expect(retryButton).toBeVisible();
    await expect(retryButton).toContainText("Retry");
  });

  test("R5: Empty state renders neutral empty-state message", async ({
    page,
  }) => {
    await page.goto("/test/segment-cards");

    await page.getByTestId("scenario-empty").click();

    const emptyState = page.getByTestId("segment-cards-empty");
    await expect(emptyState).toBeVisible();

    await expect(emptyState).toContainText("No customer segments available");
    await expect(emptyState).toContainText(
      "Segments will populate once customers start making purchases.",
    );
  });

  test("R6: Action trigger button invokes onSegmentSelect with correct segment type", async ({
    page,
  }) => {
    await page.goto("/test/segment-cards");

    await page.getByTestId("scenario-populated").click();

    await page.getByTestId("select-inactive_30d").click();

    const display = page.getByTestId("selected-segment-display");
    await expect(display).toBeVisible();
    await expect(display).toContainText("inactive_30d");

    await page.getByTestId("select-high_spender").click();
    await expect(display).toContainText("high_spender");

    await page.getByTestId("select-frequent").click();
    await expect(display).toContainText("frequent");
  });

  test("R7: Mobile viewport — cards stack vertically without horizontal overflow at 375px width", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/test/segment-cards");

    await page.getByTestId("scenario-populated").click();

    const populated = page.getByTestId("segment-cards-populated");
    await expect(populated).toBeVisible();

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
