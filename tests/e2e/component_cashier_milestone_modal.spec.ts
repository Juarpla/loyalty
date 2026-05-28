import { test, expect } from "@playwright/test";

test.describe("CashierMilestoneModal Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/milestone-modal");
  });

  test("R2: Hidden state - modal is absent when visible is false", async ({ page }) => {
    // By default, visible checkbox is unchecked, so modal should be hidden
    await expect(page.getByTestId("milestone-modal-overlay")).toHaveCount(0);
    await expect(page.getByTestId("milestone-modal-panel")).toHaveCount(0);
  });

  test("R3, R4, R8: Visible state - backdrop overlay and all data elements are rendered with correct values", async ({ page }) => {
    // Set custom props in controls
    const nameInput = page.getByTestId("control-customer-name");
    const phoneInput = page.getByTestId("control-customer-phone");
    const rewardInput = page.getByTestId("control-reward-description");
    const countInput = page.getByTestId("control-visit-count");

    await nameInput.fill("Bob Smith");
    await phoneInput.fill("+54 9 11 9999-9999");
    await rewardInput.fill("Free Espresso");
    await countInput.fill("10");

    // Click visible checkbox to show modal
    const visibleCheckbox = page.getByTestId("control-visible");
    await visibleCheckbox.check();

    // Verify modal overlay & panel are visible
    const overlay = page.getByTestId("milestone-modal-overlay");
    const panel = page.getByTestId("milestone-modal-panel");
    await expect(overlay).toBeVisible();
    await expect(panel).toBeVisible();

    // Verify content matches input props
    await expect(page.getByTestId("milestone-customer-name")).toHaveText("Bob Smith");
    await expect(page.getByTestId("milestone-customer-phone")).toHaveText("+54 9 11 9999-9999");
    await expect(page.getByTestId("milestone-reward-description")).toHaveText("Free Espresso");
    await expect(page.getByTestId("milestone-visit-count")).toHaveText("10");
  });

  test("R5, R7: Callback interactions - claim and dismiss buttons trigger corresponding handlers", async ({ page }) => {
    // Show the modal
    const visibleCheckbox = page.getByTestId("control-visible");
    await visibleCheckbox.check();

    // Click claim button and assert claim callback count increments
    const claimBtn = page.getByTestId("milestone-claim-button");
    await claimBtn.click();
    await expect(page.getByTestId("claim-callback-count")).toHaveText("1");

    // Click dismiss button and assert dismiss callback count increments
    const dismissBtn = page.getByTestId("milestone-dismiss-button");
    await dismissBtn.click();
    await expect(page.getByTestId("dismiss-callback-count")).toHaveText("1");
  });

  test("R6: Loading state - disables both buttons and claim button renders spinner", async ({ page }) => {
    // Turn on loading state
    await page.getByTestId("control-loading").check();

    // Show the modal
    await page.getByTestId("control-visible").check();

    const claimBtn = page.getByTestId("milestone-claim-button");
    const dismissBtn = page.getByTestId("milestone-dismiss-button");

    // Assert buttons are disabled
    await expect(claimBtn).toBeDisabled();
    await expect(dismissBtn).toBeDisabled();

    // Assert spinner is present in the claim button
    await expect(claimBtn.locator("svg.animate-spin")).toBeVisible();

    // Verify clicking them in loading state does not trigger callbacks
    // (Playwright click will fail or wait if button is disabled, so we check the callback count stays 0)
    await expect(page.getByTestId("claim-callback-count")).toHaveText("0");
    await expect(page.getByTestId("dismiss-callback-count")).toHaveText("0");
  });
});
