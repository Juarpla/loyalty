# Requirements - component_cashier_form (Feature ID: 7)

- **R1**: WHEN the component mounts, it SHALL render an HTML `<form>` element containing a phone number text input and an amount numeric input, both with visible labels and accessible `id` / `name` attributes.
- **R2**: WHEN the viewport width is below 768 px (mobile breakpoint), the component SHALL render a numeric touchpad grid with buttons labeled `1`–`9`, `0`, and a backspace icon button.
- **R3**: WHEN a touchpad digit button is tapped, the component SHALL append the digit character to the currently focused input field (phone or amount) using controlled React state.
- **R4**: WHEN the backspace touchpad button is tapped, the component SHALL remove the last character from the currently focused input field.
- **R5**: WHEN the viewport width is 768 px or above (desktop breakpoint), the numeric touchpad SHALL NOT be rendered and standard HTML `<input>` elements SHALL handle all user input.
- **R6**: WHEN the form is submitted via a "Register Sale" button, the component SHALL call `onSubmit` with the current `phoneNumber` and `amount` values as arguments.
- **R7**: WHEN the parent component provides a `loading` prop set to `true`, the "Register Sale" button SHALL be disabled and display a non-editable visual loading indicator.

## Acceptance Criteria

1. The form renders two inputs (phone, amount) and a submit button at all viewport sizes.
2. On mobile viewports (< 768 px), a numeric touchpad with digits 0–9 and backspace is visible and functional.
3. On desktop viewports (≥ 768 px), no touchpad is rendered.
4. Playwright E2E tests in `tests/e2e/component_cashier_form.spec.ts` SHALL verify touch input renders correctly and is interactive at 375 px width.
5. Playwright E2E tests in `tests/e2e/component_cashier_form.spec.ts` SHALL verify standard inputs render correctly at 1440 px width.

## Verification Evidence

- `src/components/cashier/form.component.tsx` exists and exports `CashierForm`.
- Component uses `"use client"` directive.
- Component reads `viewport` via `useEffect` + `window.innerWidth` to determine touchpad visibility.
- Touchpad renders 12 buttons: digits `1`–`9`, `0`, and backspace icon.
- Desktop mode hides touchpad via CSS media query or conditional render.
- `tests/e2e/component_cashier_form.spec.ts` contains Playwright `test()` cases for mobile (375 px) and desktop (1440 px) viewports.