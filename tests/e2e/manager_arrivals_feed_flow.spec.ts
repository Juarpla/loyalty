import { test, expect } from "@playwright/test";

test.describe("Feature 57: Manager Arrivals Feed Flow E2E Integration", () => {
  test("R1-R5: Integrated portal registration feeds to manager arrivals dashboard and renders WhatsApp redirects", async ({
    context,
  }) => {
    const registeredArrivals: Array<{
      clientId: string;
      loginId: string;
      phone_number: string;
      name: string;
      greetingText: string;
      whatsappUrl: string;
      arrivedAt: string;
      generatedAt: string;
    }> = [];

    // Intercept API routes across all pages in the context
    await context.route("**/api/v1/arrivals/notifications", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            notifications: registeredArrivals,
            summary: {
              total: registeredArrivals.length,
              named: registeredArrivals.filter((n) => n.name.trim().length > 0).length,
              anonymous: registeredArrivals.filter((n) => n.name.trim().length === 0).length,
              generatedAt: new Date().toISOString(),
              latestArrivalAt: registeredArrivals[0]?.arrivedAt ?? null,
            },
          },
        }),
      });
    });

    await context.route("**/api/v1/portal/register", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        const postData = JSON.parse(request.postData() || "{}");
        const name = postData.name || "";
        const phone = postData.phone || "";

        const greetingText = `Hola ${name}, gracias por visitarnos en nuestro negocio. Estamos felices de verte de nuevo.`;
        const cleanedPhone = phone.replace(/[^0-9]/g, "");
        const encodedText = encodeURIComponent(greetingText);
        const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedText}`;

        registeredArrivals.unshift({
          clientId: "cli-e2e-user",
          loginId: "log-e2e-user",
          phone_number: phone,
          name,
          greetingText,
          whatsappUrl,
          arrivedAt: new Date().toISOString(),
          generatedAt: new Date().toISOString(),
        });

        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              clientId: "cli-e2e-user",
              loginId: "log-e2e-user",
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 1. Open manager dashboard page
    const dashboardPage = await context.newPage();
    await dashboardPage.goto("/admin/dashboard");

    // Verify ArrivalsFeedComponent renders empty state initially (R1)
    const emptyBanner = dashboardPage.getByTestId("arrivals-feed-empty");
    await expect(emptyBanner).toBeVisible();

    // 2. Open portal registration in a separate page/tab (R3)
    const portalPage = await context.newPage();
    await portalPage.goto("/portal");

    // Fill registration form (R3)
    const nameInput = portalPage.getByTestId("portal-name-input");
    const phoneInput = portalPage.getByTestId("portal-phone-input");
    const submitButton = portalPage.getByTestId("portal-submit-button");

    await nameInput.fill("E2E Stream User");
    await phoneInput.fill("+5491133333333");
    await submitButton.click();

    // Verify successful portal onboarding completion
    await expect(portalPage.locator("text=BusinessWiFi")).toBeVisible();

    // 3. Return to the dashboard page and click refresh button (R3)
    await dashboardPage.bringToFront();
    const refreshButton = dashboardPage.getByTestId("refresh-button");
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();

    // Assert that the newly registered client card is appended to the feed list (R3, R4)
    const arrivalCard = dashboardPage.getByTestId("arrival-card-log-e2e-user");
    await expect(arrivalCard).toBeVisible();

    const arrivalName = arrivalCard.getByTestId("arrival-name");
    const arrivalPhone = arrivalCard.getByTestId("arrival-phone");
    const arrivalGreeting = arrivalCard.getByTestId("arrival-greeting");
    const whatsappLink = arrivalCard.getByTestId("whatsapp-link");

    await expect(arrivalName).toContainText("E2E Stream User");
    await expect(arrivalPhone).toContainText("+5491133333333");
    await expect(arrivalGreeting).toContainText(
      "Hola E2E Stream User, gracias por visitarnos en nuestro negocio. Estamos felices de verte de nuevo."
    );

    // Verify WhatsApp redirect link formats and attributes (R4, R5)
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toHaveAttribute("target", "_blank");
    await expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
    await expect(whatsappLink).toHaveAttribute(
      "href",
      "https://wa.me/5491133333333?text=Hola%20E2E%20Stream%20User%2C%20gracias%20por%20visitarnos%20en%20nuestro%20negocio.%20Estamos%20felices%20de%20verte%20de%20nuevo."
    );
  });
});
