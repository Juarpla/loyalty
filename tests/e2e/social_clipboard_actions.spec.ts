import { test, expect } from '@playwright/test';

test.describe('Manager Social Page - Clipboard and Interactions', () => {
  // R3: Mobile viewport layout
  test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

  test.beforeEach(async ({ page }) => {
    // Go to the manager social page
    await page.goto('/admin/social');
  });

  test('R1: shows loading skeletons during API request', async ({ page }) => {
    // Intercept the API call to delay it
    let resolveApi: () => void;
    const apiPromise = new Promise<void>(resolve => {
      resolveApi = resolve;
    });

    await page.route('**/api/v1/social/ideas', async (route) => {
      await apiPromise; // Wait until we tell it to resolve
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            ideas: [
              {
                title: 'Weekend Flash Sale!',
                body: 'Get 20% off all items this weekend!',
                visualPrompt: 'A bright, colorful banner with bold text',
                hashtags: ['#sale', '#weekend']
              }
            ]
          }
        })
      });
    });

    // Fill the context form
    const textarea = page.getByTestId('context-textarea');
    await textarea.fill('Testing skeletons');

    const submitBtn = page.getByTestId('context-submit');
    await submitBtn.click();

    // R1: Assert loading skeleton components are visible
    // In page.tsx: <div className="animate-pulse bg-zinc-900/50 ...">
    const skeletons = page.locator('.animate-pulse');
    await expect(skeletons.first()).toBeVisible();
    await expect(page.getByText('Generating Suggestions...')).toBeVisible();

    // Resolve the API call
    resolveApi!();

    // Assert that skeletons disappear and the suggestion cards render
    await expect(skeletons.first()).toBeHidden();
    await expect(page.getByTestId('suggestion-card-idea-0')).toBeVisible();
  });

  test('R2: handles copy to clipboard action', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Route network requests to return mock suggestions immediately
    await page.route('**/api/v1/social/ideas', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            ideas: [
              {
                title: 'Clipboard Test',
                body: 'This text should be copied!',
                visualPrompt: 'Some visual prompt',
                hashtags: ['#copy', '#test']
              }
            ]
          }
        })
      });
    });

    // Fill and submit to get cards
    const textarea = page.getByTestId('context-textarea');
    await textarea.fill('Testing clipboard');
    await page.getByTestId('context-submit').click();

    // Wait for the suggestion card to appear
    const card = page.getByTestId('suggestion-card-idea-0');
    await expect(card).toBeVisible();

    // Tap the copy button
    const copyBtn = page.getByTestId('copy-btn-idea-0');
    await copyBtn.click();

    // Verify visual feedback
    await expect(page.locator('text=Copied to clipboard!').first()).toBeVisible();

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    
    expect(clipboardText).toContain('Clipboard Test');
    expect(clipboardText).toContain('This text should be copied!');
    expect(clipboardText).toContain('#copy #test');
  });
});
