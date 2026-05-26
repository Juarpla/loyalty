# Tasks

- [x] T1 - Implement `src/app/api/v1/portal/register/route.ts` parsing JSON, delegating to `registerPortalClient`, and returning a 201 Created status on success. Covers: R1, R2, R3, R4, R5.
- [x] T2 - Create integration test file `tests/integration/api_portal_register_route.test.ts` to assert valid requests return 201, invalid JSON returns 400, and controller errors bubble up correctly. Covers: R6.
