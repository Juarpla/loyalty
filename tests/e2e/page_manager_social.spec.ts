import { test, expect } from '@playwright/test';

test.describe('Manager Social Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the manager social page
    await page.goto('/admin/social');
  });

  test('R1 & R3: renders the page and ContextForm component correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1').filter({ hasText: 'Social Content Ideas' })).toBeVisible();

    // Check ContextForm presence
    await expect(page.getByTestId('context-textarea')).toBeVisible();
    await expect(page.getByTestId('context-submit')).toBeVisible();
  });

  test('R2 & R4: handles form submission and displays SuggestionsCards correctly', async ({ page }) => {
    // Fill the context form
    const textarea = page.getByTestId('context-textarea');
    await textarea.fill('Weekend special flash sale for new customers');

    // Route network requests to return mock suggestions
    await page.route('**/api/v1/social/ideas', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
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

    // Submit the form
    const submitBtn = page.getByTestId('context-submit');
    await submitBtn.click();

    // Check loading state
    await expect(submitBtn).toBeDisabled();
    await expect(page.locator('.animate-pulse').first()).toBeVisible();
    await expect(page.getByText('Generating Suggestions...')).toBeVisible();
    
    // Wait for the success message to appear
    await expect(page.getByTestId('context-success')).toBeVisible();

    // Verify the suggestions cards are rendered
    await expect(page.getByTestId('suggestion-card-idea-0')).toBeVisible();
    await expect(page.getByTestId('suggestion-title')).toHaveText('Weekend Flash Sale!');
    await expect(page.getByTestId('suggestion-body')).toHaveText('Get 20% off all items this weekend!');
    await expect(page.getByTestId('visual-prompt')).toHaveText('A bright, colorful banner with bold text');
    await expect(page.getByTestId('suggestion-hashtags')).toHaveText('#sale #weekend');
  });

  test('R5: viewport responsive layout classes are present', async ({ page }) => {
    // Check that grid layout classes are present for desktop views
    const container = page.locator('.lg\\:grid.lg\\:grid-cols-12');
    await expect(container).toBeVisible();
  });
});
