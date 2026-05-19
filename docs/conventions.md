# Conventions

These conventions keep the repository predictable for humans and AI agents.

## TypeScript and React

- Use TypeScript for new source files.
- Keep `strict` TypeScript expectations; do not silence errors with `any` unless the
  spec documents the boundary.
- Prefer named helper functions for non-trivial logic.
- Keep components small enough that their data flow is obvious.
- Use Server Components by default and client components only where required.
- Use `next/link`, `next/image`, and App Router primitives when they apply.

## Styling

- Use Tailwind utilities already available in the project.
- Keep global CSS for tokens, resets, and truly global behavior.
- Avoid one-off CSS files unless a component or route genuinely needs them.
- UI changes must consider keyboard access, focus states, semantic HTML, and readable
  responsive layouts.

## File and naming conventions

- Route files follow Next.js conventions: `page.tsx`, `layout.tsx`, `loading.tsx`,
  `error.tsx`, `not-found.tsx`, and `route.ts`.
- Private route-local folders start with `_`, for example `_components`.
- Components use `PascalCase`.
- Hooks use `useCamelCase`.
- Utility functions and variables use `camelCase`.
- Constants use `UPPER_SNAKE_CASE` only when they are true constants.

## Imports and boundaries

- Prefer the `@/*` path alias for shared project imports when it improves clarity.
- Keep imports ordered by external packages, then project modules, then relative
  modules.
- Do not import client-only code into Server Components.
- Do not read secrets or environment variables in client code.

## Comments

Default to expressive names over comments. Add comments only for non-obvious
constraints, tradeoffs, or framework behavior that future agents may misread.

## Testing

- **Integration tests** use Vitest. Files live in `tests/integration/` with `.integration.test.ts`
  suffix. Test logic, data flow, API route helpers, and server utilities only.
  Do not use Vitest for browser rendering or DOM interaction.
- **E2E tests** use Playwright. Files live in `tests/e2e/` with `.e2e.test.ts` suffix.
  Test complete user flows in a real browser.
- Test names must be descriptive. For SDD features, prefix with the requirement ID:
  `'R1: <description of what is being verified>'`.
- The **E2E gate** applies when a single feature change touches multiple components
  across both frontend and backend: stop and ask the human before writing E2E tests.
  Document the decision in `progress/impl_<feature>.md`.
- Do not use `.skip` or `.todo` without a documented reason in
  `progress/impl_<feature>.md`. Skipped tests are a reviewer rejection trigger.

