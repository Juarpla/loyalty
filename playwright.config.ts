import { defineConfig, devices } from '@playwright/test'

// Playwright is used for E2E tests only.
// E2E tests live in tests/e2e/ with .e2e.test.ts suffix.
//
// E2E gate: when a feature change is broad (touching multiple frontend+backend
// components), the implementer must ask the human whether E2E tests should be
// written and run before closing the feature. See .agents/subagents/implementer.md.
//
// Run explicitly: pnpm test:e2e
// Never run automatically by init.sh or hooks.
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.test.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Auto-start the Next.js dev server when running E2E tests locally.
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
