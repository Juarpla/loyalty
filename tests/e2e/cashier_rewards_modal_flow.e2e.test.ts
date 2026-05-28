import { test, expect } from "@playwright/test";

test.describe("Feature 64: Cashier Milestone Alert Modals E2E Suite", () => {
  test("R1-R5: Verify full milestone reward modal flow on cashier dashboard", async ({
    context,
  }) => {
    let mockArrivals: Array<{
      clientId: string;
      loginId: string;
      phone_number: string;
      name: string;
      arrivedAt: string;
    }> = [];

    // Intercept notifications endpoint
    await context.route("**/api/v1/arrivals/notifications", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            notifications: mockArrivals,
            summary: {
              total: mockArrivals.length,
              named: mockArrivals.filter((n) => n.name.trim().length > 0).length,
              anonymous: mockArrivals.filter((n) => n.name.trim().length === 0).length,
              generatedAt: new Date().toISOString(),
              latestArrivalAt: mockArrivals[0]?.arrivedAt ?? null,
            },
          },
        }),
      });
    });

    // Intercept claim endpoint
    await context.route("**/api/v1/rewards/claim", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        const postData = JSON.parse(request.postData() || "{}") as Record<string, unknown>;

        if (postData.clientId === "cli-milestone-10") {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              data: {
                message: "Reward claimed successfully",
              },
            }),
          });
        } else {
          await route.fulfill({
            status: 400,
            contentType: "application/json",
            body: JSON.stringify({
              success: false,
              status: 400,
              error: "Milestone not reached",
            }),
          });
        }
      } else {
        await route.continue();
      }
    });

    const page = await context.newPage();
    await page.goto("/admin/cash");

    // Modal is initially absent
    await expect(page.getByTestId("milestone-modal-overlay")).toHaveCount(0);

    // 1. Normal client arrival (no modal should trigger)
    mockArrivals = [
      {
        clientId: "cli-normal-user",
        loginId: "log-normal-user",
        phone_number: "+51999888777",
        name: "Normal Client",
        arrivedAt: new Date().toISOString(),
      },
    ];

    await page.reload();
    await expect(page.getByTestId("milestone-modal-overlay")).toHaveCount(0);

    // 2. Milestone client arrival (triggers modal display automatically - R1)
    mockArrivals = [
      {
        clientId: "cli-milestone-10",
        loginId: "log-milestone-10",
        phone_number: "+51911111111",
        name: "Jane Milestone",
        arrivedAt: new Date().toISOString(),
      },
    ];

    await page.reload();

    const overlay = page.getByTestId("milestone-modal-overlay");
    const panel = page.getByTestId("milestone-modal-panel");
    await expect(overlay).toBeVisible();
    await expect(panel).toBeVisible();

    // Verify modal data elements populated correctly - R2
    await expect(page.getByTestId("milestone-customer-name")).toHaveText("Jane Milestone");
    await expect(page.getByTestId("milestone-customer-phone")).toHaveText("+51911111111");
    await expect(page.getByTestId("milestone-reward-description")).toHaveText("Free Coffee & Donut");
    await expect(page.getByTestId("milestone-visit-count")).toHaveText("10");

    // 3. Claim flow: Click "Claim Reward" and check dashboard success banner - R3
    const claimBtn = page.getByTestId("milestone-claim-button");
    await claimBtn.click();

    // Verify modal closes
    await expect(overlay).toHaveCount(0);

    // Verify dashboard success message banner
    const rewardsBanner = page.getByTestId("rewards-success-banner");
    await expect(rewardsBanner).toBeVisible();
    await expect(rewardsBanner).toContainText("Reward claimed successfully");

    // 4. Dismiss flow: Clear cache key on reload to re-trigger, then test dismiss - R4
    await page.reload();
    await expect(overlay).toBeVisible();

    const dismissBtn = page.getByTestId("milestone-dismiss-button");
    await dismissBtn.click();

    // Verify modal is closed
    await expect(overlay).toHaveCount(0);
  });
});
