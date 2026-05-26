# Requirements: Social Creation Clipboard E2E Tests (test_e2e_social_clipboard_actions)

## EARS Requirements

- **R1** (Event-driven): WHEN a user submits the context form on the social creation page, the system MUST display loading skeletal indicators before rendering the final suggestion cards.
- **R2** (Event-driven): WHEN a user taps the "copy-to-clipboard" action on a generated suggestion card, the system MUST copy the corresponding text (draft text or visual prompt) to the user's clipboard.
- **R3** (Ubiquitous): The system MUST run these checks in a Playwright E2E environment mimicking a mobile viewport layout.
