# Requirements: test_e2e_cashier_rewards_modal_flow

Feature ID: 64
Feature name: test_e2e_cashier_rewards_modal_flow
Title: Cashier Milestone Alert Modals E2E Tests
History: F4 - Story 4.3: 10th visit reward visual alert

## Context

Feature 64 provides end-to-end (E2E) verification for the Cashier Milestone Reward Alert Modal flow. It ensures that when a client triggers their 10th login event (milestone), the cashier is presented with the milestone modal, can view all necessary details, and can trigger the reward claim action or dismiss the modal.

---

## Requirements

- **R1 (Event-driven):** WHEN a client triggers their 10th login event, the Cashier Dashboard MUST automatically display the `CashierMilestoneModal` component to the cashier.
- **R2 (State-driven):** WHILE the milestone modal is displayed, it MUST render the customer's name, phone number, reward description ("Free Coffee & Donut"), and visit count of 10.
- **R3 (Event-driven):** WHEN the cashier clicks the "Claim Reward" button inside the modal, the system MUST call the claim API endpoint `/api/v1/rewards/claim`, dismiss the modal from the screen, and render a success message banner on the dashboard stating "Reward claimed successfully".
- **R4 (Event-driven):** WHEN the cashier clicks the "Dismiss" button inside the modal, the system MUST dismiss the modal from the screen without triggering a claim.
- **R5 (Ubiquitous):** The E2E tests verifying this flow MUST be implemented in `tests/e2e/cashier_rewards_modal_flow.spec.ts`.
