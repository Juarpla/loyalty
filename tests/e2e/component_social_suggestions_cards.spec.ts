import { test, expect } from '@playwright/test';

// Because this is a component, we typically test components in e2e using a specialized route 
// or component testing setup. Assuming standard e2e setup, we mock a page that renders it,
// or we use Playwright Component Testing. Since the prompt specifies `tests/e2e`, 
// we will assume a test page exists or we mock the component rendering.
// To keep it simple and aligned with standard Next.js e2e practices, we'll write the test 
// assuming the component is mounted on a test route, or we can use the experimental component test approach.
// However, the standard requirement says "SHALL verify component structure".
// I'll write a test that mounts the component using Playwright experimental component testing syntax if applicable,
// or just standard page context. 
// Given the other test names, it's likely standard e2e. Let's create a minimal test that assumes the component
// is placed in the admin/social page later, but for now we'll write it targeting the expected data-testids.

// Note: Since we are testing a component in an E2E folder, we might need a test route. 
// I will create a basic test that checks the data-testids assuming it's rendered somewhere, 
// but to be fully standalone without a test route, I will use a minimal HTML setup with Playwright's `setContent`.

test.describe('Social Suggestions Cards UI Component', () => {
  test('should render suggestion cards with correct layout and copy functionality', async ({ page, browserName }) => {
    // Skip clipboard tests in webkit if it requires permissions we can't easily grant
    if (browserName === 'webkit') {
      test.skip();
    }

    // Grant clipboard permissions for Chromium/Firefox
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // We can mount the component by compiling it or just creating a basic page that imports it.
    // However, since it's an E2E test without a dedicated page yet, we'll create a fake test page 
    // or simulate the render by testing the specific DOM elements once it's integrated.
    // For the sake of this spec, let's inject a compiled version or assume it's on a test route.
    // I'll create a dummy route later if needed. For now, let's write the assertions.
    
    // We will navigate to a test harness page or the actual social page if it existed.
    // Wait, the page `src/app/admin/social/page.tsx` is pending (feature 42).
    // Let's create a temporary test route: `src/app/test-social-cards/page.tsx`
    // Actually, I shouldn't pollute `src/app/`. I'll just write the test logic that expects the component.

    // To make the test pass in isolation, we'll mock the component rendering using a raw HTML representation
    // of what the component outputs, or we can just create the page now. I'll create the test route.
    
    await page.goto('/test-social-cards');

    // Wait for the component to render
    const card = page.getByTestId('suggestion-card-1');
    await expect(card).toBeVisible();

    // Verify Visual Prompt
    const visualPrompt = card.getByTestId('visual-prompt');
    await expect(visualPrompt).toContainText('A bright, sunny photo of our storefront');

    // Verify Title, Body, Hashtags
    await expect(card.getByTestId('suggestion-title')).toContainText('Sunny Weekend Sale');
    await expect(card.getByTestId('suggestion-body')).toContainText('Come grab a coffee and enjoy 20% off!');
    await expect(card.getByTestId('suggestion-hashtags')).toContainText('#WeekendSale #Coffee');

    // Test Clipboard Copy
    const copyBtn = card.getByTestId('copy-btn-1');
    await copyBtn.click();

    // Verify the visual feedback (check icon appears)
    await expect(card.locator('.text-green-700')).toContainText('Copied to clipboard!');

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('Sunny Weekend Sale');
    expect(clipboardText).toContain('Come grab a coffee and enjoy 20% off!');
    expect(clipboardText).toContain('#WeekendSale #Coffee');
  });
});
