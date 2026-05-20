# Design - component_cashier_form (Feature ID: 7)

## Affected Files

- [NEW] `src/components/cashier/form.component.tsx` — Main UI component with responsive touchpad and form inputs.
- [NEW] `tests/e2e/component_cashier_form.spec.ts` — Playwright E2E tests verifying responsive touch input across mobile and desktop viewports.

## Public Interface

```typescript
interface CashierFormProps {
  onSubmit: (phoneNumber: string, amount: string) => void;
  loading?: boolean;   // defaults to false
}
```

Export `CashierForm({ onSubmit, loading }: CashierFormProps): JSX.Element` from `src/components/cashier/form.component.tsx`.

## Architecture & Data Flow

```mermaid
graph TD
    Page[Cashier Dashboard Page - Feature 8] --> Form[CashierForm Component]
    Form --> Hook[useCashierSales hook - Feature 6]
    Hook -->|POST| Route[/api/v1/sales/record]
    Form -->|viewport < 768px| Touchpad[Numeric Touchpad UI]
    Form -->|viewport >= 768px| StandardInputs[HTML Inputs]
    Touchpad -->|append digit| InputState[React controlled state]
    InputState -->|submit| onSubmit callback
```

### Component State

- `phoneNumber: string` — controlled input value for phone field.
- `amount: string` — controlled input value for amount field.
- `focusedField: 'phone' | 'amount' | null` — tracks which input is currently focused for touchpad append.
- `viewportWidth: number` — current window inner width, updated on mount and resize via `useEffect`.

### Touchpad Behavior

- Renders 12 buttons in a 4×3 grid: `[1] [2] [3]` / `[4] [5] [6]` / `[7] [8] [9]` / `[⌫] [0] [ ]` (empty spacer).
- Backspace button removes last character from `focusedField`.
- Each digit button appends to `focusedField`.
- If no field is focused, tapping a digit focuses and fills the `phoneNumber` field first.

### Responsive Breakpoint

- Breakpoint: `768 px` (matches Tailwind `md:` convention).
- Below 768 px: render touchpad + compact inputs.
- At or above 768 px: render standard inputs only; no touchpad.

### Props & Callbacks

- `onSubmit(phoneNumber, amount)`: called when "Register Sale" button is clicked and form is not `loading`.
- `loading`: when `true`, button is disabled; UI shows a spinner icon inside the button.

## Implementation Decisions

- **Client component**: Must use `"use client"` because `useEffect` reads `window.innerWidth` — this is unsupported in Server Components.
- **No external state library**: Form state managed with `useState` only; no Zustand, Redux, or context required for this single component.
- **No Tailwind config change**: Breakpoint at `768 px` using existing Tailwind `md:` breakpoint.
- **Accessible inputs**: Both inputs have `id`, `name`, `aria-label`, and `type` attributes.
- **Touchpad digits as `<button>` elements**: Each button has `type="button"` to prevent accidental form submission.
- **Loading spinner**: SVG inline spinner icon rendered inside the submit button when `loading === true`.

## Testing Strategy

Playwright E2E tests (`tests/e2e/component_cashier_form.spec.ts`):
1. **Mobile viewport (375 px)**: Navigate to `/admin/cash`, assert form inputs are visible, assert numeric touchpad buttons are visible, tap a digit button, assert the digit appears in the phone input.
2. **Desktop viewport (1440 px)**: Navigate to `/admin/cash`, assert form inputs are visible, assert numeric touchpad is NOT visible.

Tests use `page.goto()` with viewport override via `await page.setViewportSize()`.

## Next.js Docs Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` — Project structure conventions.
- `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md` — Playwright testing setup and viewport configuration.

## Rejected Alternatives

- **Always render touchpad**: Rejected; desktop users with physical keyboards find touchpad overlays disruptive and it wastes screen real estate.
- **Detect touch device via `navigator.maxTouchPoints`**: Rejected; a 2-in-1 laptop can have touch capability but prefer keyboard input. Viewport width is the intended discriminator per the spec.
- **Use `responsiveHooks` or context for breakpoint state**: Rejected; a single `useState` + `useEffect` for `viewportWidth` is sufficient and avoids adding a context provider just for one component.
- **Vitest for component rendering**: Rejected; `docs/verification.md` reserves Vitest for logic/integration tests; Playwright E2E is the correct tool for UI component viewport verification.