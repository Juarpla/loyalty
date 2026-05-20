# Tasks - component_cashier_form (Feature ID: 7)

- [x] **T1**: Create `src/components/cashier/form.component.tsx` with `"use client"`, `CashierFormProps` interface, controlled `phoneNumber`/`amount` state, `focusedField` state, `viewportWidth` state via `useEffect`. Covers: R1, R2, R3, R4, R5, R7.
- [x] **T2**: Render touchpad grid (4×3 buttons: digits 1–9, 0, backspace icon) visible only when `viewportWidth < 768`. Covers: R2, R3, R4, R5.
- [x] **T3**: Render standard HTML `<input>` for phone and amount, with proper `id`, `name`, `aria-label`, and `type` attributes. Covers: R1, R5.
- [x] **T4**: Implement "Register Sale" submit button with `onSubmit` call and `loading` disabled state with inline SVG spinner. Covers: R6, R7.
- [x] **T5**: Create `tests/e2e/component_cashier_form.e2e.test.ts` with Playwright tests: mobile (375 px) touchpad visible and interactive, desktop (1440 px) touchpad not visible. Covers: AC1, AC2, AC3, AC4, AC5.
- [x] **T6**: Run `./init.sh --quick` and `./init.sh`; confirm Playwright tests pass and lint is green. Covers: all requirements.
