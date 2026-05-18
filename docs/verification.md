# Verification

Agents do not claim that work works; they demonstrate it.

## Required checks

Run the full harness check before marking any feature `done`:

```bash
./init.sh
```

The script validates harness files, SDD state, lint, and production build.

For edit-time feedback, hooks and agents may run:

```bash
./init.sh --quick
```

Quick mode validates harness files, hook configuration, SDD state, and lint. It skips
the production build so post-edit hooks stay fast.

## Next.js checks

- Lint: `pnpm lint`
- Production build: `pnpm build`
- Dev server for manual or browser smoke testing: `pnpm dev`

For UI, navigation, form, or visual changes, the spec must include at least one
browser-level verification. Use the Codex Browser plugin or Playwright when available.

## Playwright when introduced

If a feature adds Playwright, also add:

- `@playwright/test`
- `playwright.config.ts`
- `tests/e2e/`
- `test:e2e` script in `package.json`

Follow the local Next.js Playwright guide:
`node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`.

## Traceability

For SDD features, document the requirement coverage in `progress/impl_<feature>.md`:

```markdown
## Traceability
- R1 -> `pnpm lint`
- R2 -> `tests/e2e/dashboard.spec.ts`
- R3 -> Browser smoke: `/dashboard` renders empty state
```

Each `R<n>` must have at least one concrete test, command, or smoke check.

## Closure

Before ending a session:

1. Run `./init.sh`.
2. Update `feature_list.json` to the correct state.
3. Append a concise summary to `progress/history.md`.
4. Reset `progress/current.md` to its template if the session is complete.
5. Leave no unexplained temporary files or TODOs.
