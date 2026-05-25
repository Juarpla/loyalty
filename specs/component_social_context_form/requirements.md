# Requirements: Social Context Form Input UI Component

## Context

Feature 36 of Story 3.1 (Request idea with custom context input). The `useSocialIdeas` hook (feature 35) provides `context`, `loading`, `error`, `successMessage`, `setContext`, and `generateIdeas`. This component renders a responsive textarea form for entering a social content context description, with a submit trigger, validation feedback, and loading/error/success states — optimized for tactile mobile entry.

## Requirements

### R1: Textarea Input Rendering
WHEN the component mounts, it SHALL render an HTML `<textarea>` element with a visible label, accessible `id` and `name` attributes, and a placeholder prompting the user to describe their social post idea.

### R2: Character Count Display
WHERE the component is rendered, the component SHALL display a live character count showing the current text length and a minimum requirement of 3 characters, positioned below the textarea.

### R3: Submit Trigger Button
WHEN the component is rendered, it SHALL render a submit button labeled "Generate Ideas" that, when clicked, calls the `onSubmit` callback with the current `context` value.

### R4: Loading State
WHILE `loading` is `true`, the submit button SHALL be disabled and display an animated spinner indicator; the textarea SHALL remain editable to allow the user to continue typing.

### R5: Error State
WHEN `error` is a non-null string, the component SHALL render an inline error banner above the textarea displaying the error message with role="alert".

### R6: Success State
WHEN `successMessage` is a non-null string, the component SHALL render an inline success banner above the textarea displaying a success confirmation with role="status".

### R7: Touch-Friendly Mobile Layout
WHEN the component is rendered on a mobile viewport (375px width), the textarea SHALL have at least 6 visible rows, the submit button SHALL have a minimum tap target of 44px height, and the entire form SHALL render without horizontal overflow.

### R8: Desktop Layout Responsiveness
WHEN the component is rendered on a desktop viewport (1440px width), the form SHALL be centered with a max-width container and the textarea SHALL have at least 4 visible rows.

### R9: Form Clear on Success
WHEN `onSubmit` is called and returns successfully (indicated by `successMessage` becoming non-null), the parent hook SHALL clear the context state, and the component SHALL reflect the cleared textarea.

### R10: E2E Verification
Playwright E2E tests in `tests/e2e/component_social_context_form.spec.ts` SHALL verify:
- The component renders textarea, character count, and submit button at mobile viewport (375px)
- The loading state shows disabled button with spinner
- The error state renders an error banner
- The success state renders a success banner
- The form fits within the viewport without horizontal overflow at 375px width
- The form renders correctly at desktop viewport (1440px)

## Acceptance Criteria

1. The form renders a textarea with label, character count, and submit button at all viewport sizes.
2. On mobile viewports (375px) the textarea has ≥6 rows and submit button ≥44px height.
3. Loading/error/success states are visually distinct and accessible.
4. Playwright E2E tests in `tests/e2e/component_social_context_form.spec.ts` SHALL assert viewport scale fits mobile views.
