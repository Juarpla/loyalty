import { test, expect } from "@playwright/test";

test.describe("CashierFormComponent", () => {
  test("R1–R6: Mobile viewport (375px) — touchpad visible and interactive", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/cash");

    const phoneInput = page.getByTestId("cashier-phone-input");
    const amountInput = page.getByTestId("cashier-amount-input");
    await expect(phoneInput).toBeVisible();
    await expect(amountInput).toBeVisible();

    const touchpad = page.getByTestId("cashier-touchpad");
    await expect(touchpad).toBeVisible();

    await phoneInput.focus();
    await page.getByTestId("cashier-touchpad-7").click();
    await expect(phoneInput).toHaveValue("7");

    await page.getByTestId("cashier-touchpad-8").click();
    await page.getByTestId("cashier-touchpad-9").click();
    await expect(phoneInput).toHaveValue("789");

    await page.getByTestId("cashier-touchpad-backspace").click();
    await expect(phoneInput).toHaveValue("78");

    const submitBtn = page.getByTestId("cashier-submit");
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveText("Register Sale");
  });

  test("R2, R5: Mobile viewport (375px) — touchpad buttons visible (digits + backspace)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/cash");

    for (const digit of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      await expect(page.getByTestId(`cashier-touchpad-${digit}`)).toBeVisible();
    }

    await expect(page.getByTestId("cashier-touchpad-backspace")).toBeVisible();
  });

  test("R5: Desktop viewport (1440px) — touchpad NOT rendered", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/cash");

    await expect(page.getByTestId("cashier-phone-input")).toBeVisible();
    await expect(page.getByTestId("cashier-amount-input")).toBeVisible();
    await expect(page.getByTestId("cashier-touchpad")).toHaveCount(0);
  });

  test("R7: Loading state — button disabled with spinner", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/cash/preview");

    const submitBtn = page.getByTestId("cashier-submit");
    await expect(submitBtn).toBeDisabled();
    await expect(submitBtn.locator("svg.animate-spin")).toBeVisible();
  });
});
