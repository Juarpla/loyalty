# Tasks: Social Context Form Input UI Component

- [x] **T1**: Create `src/components/social/context-form.component.tsx` with:
  - `"use client"` directive
  - `ContextFormProps` interface accepting `context`, `loading`, `error`, `successMessage`, `setContext`, `onSubmit`
  - Textarea with label, accessible `id`/`name`, placeholder, responsive rows (6 mobile, 4 desktop)
  - Live character count display with minimum 3 guidance
  - Submit button "Generate Ideas" with loading spinner state
  - Error banner (role="alert") when `error` is non-null
  - Success banner (role="status") when `successMessage` is non-null
  - Responsive container: `w-full max-w-lg mx-auto`
  - Touch-friendly button sizing: `min-h-11` + `py-3`
  Covers: R1, R2, R3, R4, R5, R6, R7, R8, R9

- [x] **T2**: Create E2E test harness page at `src/app/test/context-form/page.tsx` that renders `ContextForm` with mock data for each state (idle, loading, error, success). Covers: all requirements.

- [x] **T3**: Write Playwright E2E tests in `tests/e2e/component_social_context_form.e2e.test.ts` with tests for:
  - Mobile viewport (375px): textarea, char count, submit button visible; type text and verify char count updates; submit button triggers loading state
  - Loading state: button disabled with spinner visible
  - Error state: error banner renders with message
  - Success state: success banner renders with message
  - Desktop viewport (1440px): form is centered, textarea visible, no horizontal overflow
  Covers: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10

- [x] **T4**: Run `pnpm lint` to verify no linting errors. Covers: all requirements.

- [x] **T5**: Run `pnpm build` to verify production build succeeds. Covers: all requirements.

- [x] **T6**: Run `./init.sh` to confirm full harness check passes. Covers: all requirements.
