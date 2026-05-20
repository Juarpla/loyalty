# E2E Tests (Playwright)

E2E tests go here as `.spec.ts` files.

## When to write E2E tests

Per the project harness rules (`.agents/subagents/implementer.md`):

- E2E tests are **never** written automatically.
- The implementer must **ask the human** before writing E2E tests when a feature
  touches multiple components across frontend and backend.
- Once the human approves, write `.spec.ts` files here and run: `pnpm test:e2e`

## Naming convention

```
tests/e2e/<feature-name>.spec.ts
```

## Running E2E tests

```bash
pnpm test:e2e          # run all E2E tests headless
pnpm test:e2e:ui       # open Playwright UI mode
```

The dev server starts automatically via the webServer config in `playwright.config.ts`.
