# Requirements - component_cashier_milestone_modal (Feature ID: 62)

Feature 62 introduces the `CashierMilestoneModal` UI component, a high-visibility overlay rendered to cashiers when a customer has reached their 10th visit milestone. The modal is driven entirely by props passed from the consumer (the cashier dashboard page, Feature 63) via the `useRewards` hook (Feature 61). It displays customer details, reward specifications, and two action buttons: one to claim the reward and one to dismiss the modal.

## Requirements

- **R1 (Ubiquitous):** The system MUST export a `CashierMilestoneModal` named React component from `src/components/cashier/milestone-modal.component.tsx` accepting the typed props interface `CashierMilestoneModalProps`.

- **R2 (State-driven):** WHILE `visible` is `false`, the system MUST render nothing (return `null`) so that no modal DOM elements are present in the page.

- **R3 (State-driven):** WHILE `visible` is `true`, the system MUST render a full-screen overlay (`data-testid="milestone-modal-overlay"`) that traps visual focus above all other page content using a fixed-position backdrop.

- **R4 (Event-driven):** WHEN `visible` is `true`, the system MUST render a modal dialog panel (`data-testid="milestone-modal-panel"`) that displays:
  - A customer name element (`data-testid="milestone-customer-name"`) showing the `customerName` prop value.
  - A customer phone element (`data-testid="milestone-customer-phone"`) showing the `customerPhone` prop value.
  - A reward description element (`data-testid="milestone-reward-description"`) showing the `rewardDescription` prop value.
  - A visit count element (`data-testid="milestone-visit-count"`) showing the `visitCount` prop value as a number.

- **R5 (Event-driven):** WHEN the claim button (`data-testid="milestone-claim-button"`) is clicked and `loading` is `false`, the system MUST invoke the `onClaim` callback prop with no arguments.

- **R6 (State-driven):** WHILE `loading` is `true`, the system MUST disable the claim button and render a visible loading indicator inside it, and MUST disable the dismiss button.

- **R7 (Event-driven):** WHEN the dismiss button (`data-testid="milestone-dismiss-button"`) is clicked and `loading` is `false`, the system MUST invoke the `onDismiss` callback prop with no arguments.

- **R8 (Ubiquitous):** The component MUST use the `"use client"` directive because it responds to interactive prop changes and renders conditional client-side UI.

- **R9 (Ubiquitous):** Playwright E2E tests in `tests/e2e/component_cashier_milestone_modal.spec.ts` MUST verify: modal is absent when `visible` is `false`; overlay and all required data elements are present when `visible` is `true`; the claim button invokes `onClaim`; the dismiss button invokes `onDismiss`; both buttons are disabled when `loading` is `true`.

## Acceptance Criteria

1. `src/components/cashier/milestone-modal.component.tsx` exists and exports `CashierMilestoneModal`.
2. When `visible` is `false`, no modal DOM node with `data-testid="milestone-modal-overlay"` exists in the document.
3. When `visible` is `true`, the overlay is present and the panel displays `customerName`, `customerPhone`, `rewardDescription`, and `visitCount`.
4. Clicking the claim button fires `onClaim`; clicking the dismiss button fires `onDismiss`.
5. When `loading` is `true`, both buttons have the `disabled` attribute and the claim button renders a spinner.
6. Playwright E2E tests in `tests/e2e/component_cashier_milestone_modal.spec.ts` pass green for all states listed in R9.

## Verification Mapping

- **R1:** Verify the file compiles and the named export `CashierMilestoneModal` exists in the compiled module.
- **R2:** Assert `data-testid="milestone-modal-overlay"` is absent from the DOM when `visible={false}`.
- **R3:** Assert `data-testid="milestone-modal-overlay"` is present with a fixed-position CSS class when `visible={true}`.
- **R4:** Assert `data-testid="milestone-customer-name"`, `data-testid="milestone-customer-phone"`, `data-testid="milestone-reward-description"`, and `data-testid="milestone-visit-count"` all render with their corresponding prop values.
- **R5:** Assert clicking `data-testid="milestone-claim-button"` triggers the `onClaim` callback.
- **R6:** Assert both buttons have the `disabled` attribute when `loading={true}` and the claim button renders a spinner child element.
- **R7:** Assert clicking `data-testid="milestone-dismiss-button"` triggers the `onDismiss` callback.
- **R8:** Verify the `"use client"` directive is the first statement in the file.
- **R9:** Run `pnpm test:e2e` targeting `tests/e2e/component_cashier_milestone_modal.spec.ts`; all test cases must be green.
