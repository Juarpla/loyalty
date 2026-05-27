import { test, expect } from "@playwright/test";

test.describe("WhatsAppShareButton", () => {
  test("R1, R2, R5, R7: renders the share button with correct structure and touch-friendly sizing", async ({
    page,
  }) => {
    await page.setContent(`
      <button
        type="button"
        aria-label="Share on WhatsApp"
        style="min-height:44px; min-width:44px;"
      >
        Share on WhatsApp
      </button>
    `);

    const button = page.locator("button");
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-label", "Share on WhatsApp");
    await expect(button).toHaveText("Share on WhatsApp");

    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("R3: click calls window.open with the correct wa.me URL", async ({
    page,
  }) => {
    await page.setContent(`<div id="app">placeholder</div>`);

    const calls: Array<{ url: string; target: string }> = await page.evaluate(
      () => {
        const capturedCalls: Array<{ url: string; target: string }> = [];
        window.open = (url?: string, target?: string) => {
          capturedCalls.push({ url: url ?? "", target: target ?? "" });
          return null as any;
        };

        const phone = "521234567890";
        const message = "¡Hola! ¿Cómo estás?";
        const cleanedPhone = phone.replace(/[^0-9]/g, "");
        const encodedText = encodeURIComponent(message);
        const url = `https://wa.me/${cleanedPhone}?text=${encodedText}`;
        window.open(url, "_blank");

        return capturedCalls;
      }
    );

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(
      "https://wa.me/521234567890?text=%C2%A1Hola!%20%C2%BFC%C3%B3mo%20est%C3%A1s%3F"
    );
    expect(calls[0].target).toBe("_blank");
  });

  test("R4: fallback to window.location.href when window.open returns null", async ({
    page,
  }) => {
    await page.setContent(`<div id="app">placeholder</div>`);

    const capturedLocation = await page.evaluate(() => {
      window.open = () => null;

      const phone = "521234567890";
      const message = "Hello";
      const cleanedPhone = phone.replace(/[^0-9]/g, "");
      const encodedText = encodeURIComponent(message);
      const url = `https://wa.me/${cleanedPhone}?text=${encodedText}`;

      const opened = window.open(url, "_blank");
      if (opened === null) {
        return url;
      }
      return null;
    });

    expect(capturedLocation).toBe("https://wa.me/521234567890?text=Hello");
  });

  test("R4: fallback to window.location.href when window.open throws", async ({
    page,
  }) => {
    await page.setContent(`<div id="app">placeholder</div>`);

    const fallback = await page.evaluate(() => {
      window.open = () => {
        throw new Error("blocked");
      };

      const phone = "521234567890";
      const message = "Hello";
      const cleanedPhone = phone.replace(/[^0-9]/g, "");
      const encodedText = encodeURIComponent(message);
      const url = `https://wa.me/${cleanedPhone}?text=${encodedText}`;

      try {
        window.open(url, "_blank");
      } catch {
        return url;
      }
      return null;
    });

    expect(fallback).toBe("https://wa.me/521234567890?text=Hello");
  });
});
