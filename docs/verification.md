# Verification

Agents do not claim that work works; they demonstrate it.

## Required checks

Run the full harness check before marking any feature `done`:

```bash
./init.sh
```

The script validates harness files, SDD state, integration tests, lint, and production build.

For edit-time feedback, hooks and agents may run:

```bash
./init.sh --quick
```

Quick mode validates harness files, hook configuration, SDD state, integration tests, and lint.
It skips the production build so post-edit hooks stay fast.
Integration tests run in both modes because they are fast (no server, no browser).

## Integration tests (Vitest)

Vitest is used for **integration tests only**. Test logic, data flow, API helpers, and
server utilities. Do not use Vitest for browser interaction or component rendering.

- Test files: `tests/integration/<feature>.integration.test.ts`
- Run: `pnpm test`
- Watch mode: `pnpm test:watch`

Each `R<n>` requirement must be covered by at least one test with a name that
references the requirement ID:

```typescript
it('R1: homepage returns 200', async () => { ... })
it('R2: loyalty points total is computed correctly', async () => { ... })
```

## E2E tests (Playwright)

Playwright is used for **user-flow E2E tests**. It runs in a real browser against
the Next.js dev server.

- Test files: `tests/e2e/<feature>.e2e.test.ts`
- Run: `pnpm test:e2e`
- Interactive UI: `pnpm test:e2e:ui`

### E2E gate (mandatory process)

E2E tests are **never written automatically**. The implementer must ask the human
before writing E2E tests when the feature is broad (touches multiple frontend and
backend components):

> "This change affects multiple layers. Do you want E2E tests written and run
> before closing this feature?"

The human's decision must be documented in `progress/impl_<feature>.md` under
an "E2E gate" section. The reviewer will REJECT if this section is missing.

### Playwright setup

The project has Playwright installed with:
- Chromium only (fast local development)
- `webServer` in `playwright.config.ts` auto-starts `pnpm dev`
- Base URL: `http://localhost:3000`

## Next.js checks

- Lint: `pnpm lint`
- Production build: `pnpm build`
- Dev server for manual or browser smoke testing: `pnpm dev`

## Traceability

For SDD features, document the requirement coverage in `progress/impl_<feature>.md`:

```markdown
## Traceability
- R1 -> `tests/integration/loyalty.integration.test.ts: "R1: homepage returns 200"`
- R2 -> `tests/integration/loyalty.integration.test.ts: "R2: points total computed correctly"`
- R3 -> `tests/e2e/loyalty.e2e.test.ts` (E2E, human approved)

## E2E gate
Human decision: yes — change touched API route + UI + data layer.
Result: pnpm test:e2e passed (2 specs, all green).
```

Each `R<n>` must have at least one concrete test or verified command.

## Closure

Before ending a session:

1. Run `./init.sh`.
2. Update `feature_list.json` to the correct state.
3. Append a concise summary to `progress/history.md`.
4. Reset `progress/current.md` to its template if the session is complete.
5. Leave no unexplained temporary files or TODOs.
