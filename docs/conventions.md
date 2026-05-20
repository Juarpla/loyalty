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

All files, routes, and folders in the workspace MUST be named strictly in **lowercase** to avoid Linux routing resolution bugs.

### Nomenclature & Postfixes Table

To ensure developers and AI agents immediately recognize the architectural role and responsibility of any file, use the following suffix convention:

| File Type / Role | Target Directory | Suffix / Naming Convention | Practical Example |
| :--- | :--- | :--- | :--- |
| **UI Component** | `src/components/*` | `[nombre].component.tsx` | `button.component.tsx` |
| **Custom Hook** | `src/hooks/*` | `use-[nombre].hook.ts` | `use-sales.hook.ts` |
| **Backend Controller** | `src/backend/controllers/*` | `[nombre].controller.ts` | `traffic.controller.ts` |
| **Business Service** | `src/backend/services/*` | `[nombre].service.ts` | `ai.service.ts` |
| **Data Model** | `src/backend/models/*` | `[nombre].model.ts` | `client.model.ts` |
| **Utility Helper** | `src/backend/utils/*` or `src/utils/*` | `[nombre].utils.ts` | `date.utils.ts` |
| **Types / Interfaces** | `src/types/*` or `src/backend/types/*` | `[nombre].type.ts` | `database.type.ts` |

---

## Development Rules: Components & Hooks

To keep code maintainable, testable, and free of technical debt, the following strict bounds apply:

*   **Max Component Length (150 Lines)**: No single component file (`.component.tsx` or `page.tsx`) may exceed **150 lines of code**. If a component exceeds this threshold, developers/agents MUST:
    1.  Extract complex or repetitive parts into smaller, atomic sub-components within the same module folder.
    2.  Extract mutable state, `useEffect` hooks, event handlers, and data fetching handlers into a dedicated hook (e.g. `use-[feature].hook.ts`).
*   **Single Responsibility in Hooks**: Frontend React views MUST NOT directly write network fetches (`fetch`, `axios`), catch network try/catch blocks, or handle complex object mutations. The component MUST delegate this to a Hook, which exposes only simple, read-only UI variables (such as `data`, `isLoading`, `hasError`, and `executeSubmit`).

---

## Standard Import Order

To prevent compilation collisions and keep import panels organized, imports must be structured in the following explicit order, separated by a single blank line:

```typescript
// 1. Third-party Libraries (React, Next.js, etc.)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Infrastructure & Framework dependencies (Lucide icons, Axios, database configs)
import { LucideIcon } from 'lucide-react';

// 3. Frontend Abstraction Layer (Custom Hooks and Contexts)
import { useTraffic } from '@/hooks/use-traffic.hook';

// 4. UI Components (Atomic UI, global elements, or module-specific components)
import { Card } from '@/components/ui/card.component';
import { TrafficChart } from '@/components/traffic/chart.component';

// 5. Utilities & Types
import { formatDate } from '@/utils/date.utils';
import type { TrafficData } from '@/types/traffic.type';
```

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

