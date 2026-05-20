# Design - page_cashier_dashboard (Feature ID: 8)

## Affected Files

- [UPDATE] `src/app/admin/cash/page.tsx` — Wire `useCashierSales` hook, controlled form props, success/error banners, enhanced layout styling.
- [UPDATE] `src/components/cashier/form.component.tsx` — Extend interface to accept `phoneNumber`, `amount`, `setPhoneNumber`, `setAmount` as controlled props (R3).
- [NEW] `tests/e2e/page_cashier_dashboard.e2e.test.ts` — Playwright E2E test verifying page renders at 1440 px viewport.

## Architecture & Data Flow

```mermaid
graph TD
    Page[/admin/cash/page.tsx] --> Hook[useCashierSales hook]
    Hook -->|phoneNumber, amount, setPhoneNumber, setAmount, loading| Form[CashierForm]
    Form -->|onSubmit — registerSale| Hook
    Hook -->|successMessage| Page
    Hook -->|error| Page
    Hook -->|POST /api/v1/sales/record| Route[api/v1/sales/record]
```

### Hook Integration

The page calls `useCashierSales()` and owns the connection between hook state and form props:

- `CashierForm.phoneNumber` ← `hook.phoneNumber`
- `CashierForm.amount` ← `hook.amount`
- `CashierForm.setPhoneNumber` ← `hook.setPhoneNumber`
- `CashierForm.setAmount` ← `hook.setAmount`
- `CashierForm.loading` ← `hook.loading`
- `CashierForm.onSubmit` ← `hook.registerSale`

### Updated `CashierFormProps` Interface

```typescript
interface CashierFormProps {
  onSubmit: (phoneNumber: string, amount: string) => void;
  loading?: boolean;
  // NEW — controlled state from hook (R3)
  phoneNumber?: string;
  amount?: string;
  setPhoneNumber?: (value: string) => void;
  setAmount?: (value: string) => void;
}
```

When controlled props are provided, the form uses them as its state source (controlled mode). When not provided, the form falls back to internal state (uncontrolled mode) for backward compatibility with Feature 7's preview page.

### Banner Components

Success banner:
```tsx
{successMessage && (
  <div role="status" className="rounded-lg bg-emerald-900/30 border border-emerald-700 px-4 py-3 text-sm text-emerald-300">
    {successMessage}
  </div>
)}
```

Error banner:
```tsx
{error && (
  <div role="alert" className="rounded-lg bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-300">
    {error}
  </div>
)}
```

### Metadata Export

```typescript
export const metadata: Metadata = {
  title: "Cashier Dashboard | Loyalty",
  description: "Register customer sales transactions",
};
```

## Implementation Decisions

- **Controlled form**: The form uses controlled props when provided, enabling the hook to own the form state. This keeps the form dump (presentation-only) per the architecture rules.
- **Backward-compatible form**: The form remains functional without controlled props (uncontrolled mode), supporting the preview page (`/admin/cash/preview`) which passes only `onSubmit` and `loading`.
- **Banner placement**: Success/error banners appear above the form for maximum visibility.
- **Styling**: Use existing `zinc-950` dark theme with `indigo-500` accent, consistent with the app's design language.
- **Server Component for page**: The page file itself is a Client Component (`"use client"`) because it calls `useCashierSales()` which uses `useState`.

## Next.js Docs Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` — App Router page conventions.
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — `metadata` export on page components.

## Rejected Alternatives

- **Page as Server Component**: Rejected; `useCashierSales()` is a client hook requiring client component boundary. The page must be `"use client"`.
- **Form keeps internal state only (no controlled props)**: Rejected; would mean `registerSale` reads hook's empty `phoneNumber`/`amount` state at submit time, causing the API to receive empty values. Hook integration requires controlled form state.
- **Display success/error inside the form component**: Rejected; per architecture rules, components are presentation-only. State orchestration (including success/error display) belongs in the page layer via the hook.