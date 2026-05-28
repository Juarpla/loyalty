import { test, expect } from "@playwright/test";

test.describe("Feature 63: Cashier Dashboard Milestone Modal Integration E2E", () => {
  test("R1-R7: Dashboard monitors active portal arrivals, triggers modal on milestone, and handles claim and dismiss actions", async ({
    context,
  }) => {
    let mockArrivals: Array<{
      clientId: string;
      loginId: string;
      phone_number: string;
      name: string;
      arrivedAt: string;
    }> = [];

    // Intercept arrivals API route
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

    // Intercept claim/check rewards API route
    await context.route("**/api/v1/rewards/claim", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        const postData = JSON.parse(request.postData() || "{}") as Record<string, unknown>;

        // If client is a milestone user, return success
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
              error: "Validation failed: Milestone not reached",
            }),
          });
        }
      } else {
        await route.continue();
      }
    });

    // 1. Go to the Cashier Dashboard
    const page = await context.newPage();
    await page.goto("/admin/cash");

    // Modal overlay is absent initially
    await expect(page.getByTestId("milestone-modal-overlay")).toHaveCount(0);

    // 2. Simulate a new non-milestone portal arrival
    mockArrivals = [
      {
        clientId: "cli-normal-user",
        loginId: "log-normal-user",
        phone_number: "+51999888777",
        name: "Normal Client",
        arrivedAt: new Date().toISOString(),
      },
    ];

    // Reload or wait for the system to fetch notifications. Since useArrivals has a mount useEffect,
    // let's navigate to trigger refetch, or let page refetch happen. Let's reload to trigger mount hook.
    await page.reload();

    // Verify modal overlay is still absent (normal user doesn't trigger milestone)
    await expect(page.getByTestId("milestone-modal-overlay")).toHaveCount(0);

    // 3. Simulate a new milestone portal arrival
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

    // The dashboard must automatically trigger a milestone check and render the modal
    const overlay = page.getByTestId("milestone-modal-overlay");
    const panel = page.getByTestId("milestone-modal-panel");
    await expect(overlay).toBeVisible();
    await expect(panel).toBeVisible();

    // Assert that the customer details are populated correctly in the modal
    await expect(page.getByTestId("milestone-customer-name")).toHaveText("Jane Milestone");
    await expect(page.getByTestId("milestone-customer-phone")).toHaveText("+51911111111");
    await expect(page.getByTestId("milestone-reward-description")).toHaveText("Free Coffee & Donut");
    await expect(page.getByTestId("milestone-visit-count")).toHaveText("10");

    // 4. Click the "Claim Reward" button inside the modal
    const claimBtn = page.getByTestId("milestone-claim-button");
    await claimBtn.click();

    // Verify the modal is dismissed/hidden
    await expect(overlay).toHaveCount(0);

    // Verify rewards success banner is shown on the dashboard
    const rewardsBanner = page.getByTestId("rewards-success-banner");
    await expect(rewardsBanner).toBeVisible();
    await expect(rewardsBanner).toContainText("Reward claimed successfully");

    // 5. Test Dismiss Modal: Trigger it again by clearing cache key (simulating page reload with same arrival)
    await page.reload();
    await expect(overlay).toBeVisible();

    const dismissBtn = page.getByTestId("milestone-dismiss-button");
    await dismissBtn.click();

    // Verify modal is closed
    await expect(overlay).toHaveCount(0);
  });
});
