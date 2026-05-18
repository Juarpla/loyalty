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
