# Requirements

**Feature:** 74 - subsystem_cashier_gateway

## Requirements

- **R1:** WHEN `/admin/cash` is requested without a valid administrative session cookie, the system MUST redirect the request to `/login` with `callbackUrl=/admin/cash`.
- **R2:** WHEN `/admin/cash` is requested with the valid administrative session cookie, the system MUST allow the cashier dashboard route to continue without redirecting.
- **R3:** WHEN the cashier route is protected, the system MUST preserve the existing tactile cashier ledger page implementation behind the gateway.

## Verification

- **R1:** Add an integration test that calls the route gateway with no `admin_session` cookie and asserts a redirect response to `/login?callbackUrl=/admin/cash`.
- **R2:** Add an integration test that calls the route gateway with `admin_session=authorized_admin_session` and asserts that the request continues.
- **R3:** Add an integration test that imports the cashier page module and asserts the default export and metadata remain available.
