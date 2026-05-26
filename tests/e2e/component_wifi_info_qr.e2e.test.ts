import { test, expect } from '@playwright/test';

test.describe('WifiInfoQrComponent E2E (R7, R8)', () => {
  test.setTimeout(120000); // 2 minutes timeout to allow Next.js dev server to compile

  test.beforeEach(async ({ page }) => {
    await page.goto('/test/wifi-qr');
  });

  test('R7: layout fits within mobile viewport (max-w-sm)', async ({ page }) => {
    // Navigate to the test page and find the component container
    const container = page.locator('div.max-w-sm').first();
    
    // Playwright lets us set viewport size
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    // Wait for the container to be visible
    await container.waitFor({ state: 'visible' });
    const box = await container.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(384); // max-w-sm is 384px
  });

  test('R8: tap targets have minimum 44px size', async ({ page }) => {
    const button = page.getByRole('button', { name: /Copy Wi-Fi password to clipboard/i });
    
    await button.waitFor({ state: 'visible' });
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });
});
