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

### Frontend Routes & Components
- Route files follow Next.js conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and `route.ts`.
- Private route-local folders start with `_` (e.g., `_components`).
- UI Components use `PascalCase`.
- Hooks use `useCamelCase`.

### Backend Layers (`src/backend/`)
- Backend files MUST have a distinct architectural layer suffix in their filename:
  - **Controllers**: `*.controller.ts` (e.g. `ai.controller.ts`)
  - **Models**: `*.model.ts` (e.g. `client.model.ts`)
  - **Services**: `*.service.ts` (e.g. `whatsapp.service.ts`)
  - **Types**: `*.type.ts` (e.g. `database.type.ts`)
  - **Utilities**: `*.utils.ts` (e.g. `logger.utils.ts`)
- Utility functions and variables use `camelCase`.
- Constants use `UPPER_SNAKE_CASE` only when they are true constant primitives.

---

## Productivity Scaffolding & Code Generation

To preserve layout consistency, component design tokens, and correct testing structures, agents MUST use **`hygen`** to generate boilerplate files:

- **Generate a Component**:
  ```bash
  pnpm hygen component new --name MyNewComponent
  ```
  *Generates: `src/components/MyNewComponent/index.tsx` (Client component) and its test boilerplate.*

- **Generate an Integration Test**:
  ```bash
  pnpm hygen test new --name my-feature
  ```
  *Generates: `tests/integration/my-feature.integration.test.ts` (ready for Vitest, with requirement mapping comments).*

---

## Token-Saving Search & Parse Patterns

To respect token windows and maximize context efficiency, agents should run local optimized utilities:

- **Search the Codebase**: Instead of reading whole files to locate methods, run ripgrep:
  ```bash
  pnpm rg "functionName" src/
  ```
- **Inspect Config Files**: Instead of parsing massive JSON files manually, use jq:
  ```bash
  pnpm jq ".dependencies" package.json
  ```

---

## Imports and Boundaries

- Prefer the `@/*` path alias for shared project imports when it improves clarity (e.g., `@/backend/controllers/ai.controller`).
- Keep imports ordered: external packages, then project alias modules, then local relative modules.
- **Strict Layer Isolation**:
  - Decoupled backend directories under `src/backend/` MUST NOT import client components, styles (`*.css`), or React frontend context/hooks.
  - Frontend components and Next.js page layers MUST NOT import backend models (`*.model.ts`) directly. They should communicate exclusively through backend Controllers (`*.controller.ts`) or HTTP API routes (`route.ts`).
- Do not import client-only code into Server Components.
- Do not read secrets or environment variables in client-side code.

## Comments

Default to expressive names over comments. Add comments only for non-obvious constraints, tradeoffs, or framework behavior that future agents may misread.


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

