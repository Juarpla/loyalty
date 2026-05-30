# Requirements

**Feature:** 75 - subsystem_manager_analytics

## Requirements

- **R1:** WHEN `/admin/dashboard` is requested without a valid administrative session cookie, the system MUST redirect the request to `/login` with `callbackUrl=/admin/dashboard`.
- **R2:** WHEN `/admin/dashboard` is requested with the valid administrative session cookie, the system MUST allow the executive operational control center route to continue without redirecting.
- **R3:** WHEN the manager analytics route is protected, the system MUST preserve the existing dashboard page implementation behind the gateway.

## Verification

- **R1:** Add an integration test that calls the route gateway with no `admin_session` cookie and asserts a 307 redirect response to `/login?callbackUrl=/admin/dashboard`.
- **R2:** Add an integration test that calls the route gateway with `admin_session=authorized_admin_session` and asserts the request continues without a redirect.
- **R3:** Add an integration test that imports the dashboard page module and asserts the default export and metadata remain available.
