# Design: Social Creation Clipboard E2E Tests (test_e2e_social_clipboard_actions)

## Overview
This feature introduces End-to-End (E2E) testing for the manager's social content creation workflow, specifically verifying the behavior of the context input form, the visual loading states (skeletons), and the touch-based copy-to-clipboard functionality.

## Affected Files
- `tests/e2e/social_clipboard_actions.spec.ts` (New file)

## Implementation Details

### Test Scenarios
1. **Context Submission and Skeleton Verification:**
   - Intercept the API call to `/api/v1/social/ideas` and delay the response.
   - Fill and submit the context form.
   - Assert that the loading skeleton components are visible while the API request is pending.
   - Resolve the API call with mock data.
   - Assert that the skeletons disappear and the suggestion cards render.
2. **Clipboard Action Verification:**
   - Grant clipboard permissions to the Playwright browser context (`browserContext.grantPermissions(['clipboard-read', 'clipboard-write'])`).
   - Tap the copy button on the rendered suggestion card.
   - Read the clipboard content from the browser.
   - Assert that the clipboard content matches the expected text of the suggestion card.

### Next.js & Playwright Docs Consulted
- `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`

### Rejected Alternatives
- *Using Integration tests only:* Rejected because clipboard interactions and visual loading state transitions are best verified in a real browser environment to ensure touch targets and browser API interactions (like `navigator.clipboard`) work as expected for the end user on mobile devices.
