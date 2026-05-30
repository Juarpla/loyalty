# Design

**Feature:** 74 - subsystem_cashier_gateway

## Scope

This feature secures the existing cashier ledger route at `/admin/cash`. The current codebase already contains:

- `src/middleware.ts`, which checks the `admin_session` cookie for `/admin/:path*`.
- `src/app/login/page.tsx` and `src/app/login/login.client.tsx`, which provide the login gateway.
- `src/app/admin/cash/page.tsx` and `src/app/admin/cash/cashier-dashboard.client.tsx`, which provide the tactile cashier ledger UI.

Implementation should avoid introducing a new authentication provider or changing the cashier form behavior. The work is limited to proving and tightening the existing route gateway contract.

## Expected File Changes

- `src/middleware.ts` - keep the admin route guard responsible for `/admin/cash`; update only if required for testability or exact callback behavior.
- `tests/integration/subsystem-cashier-gateway.integration.test.ts` - add Vitest coverage for unauthenticated redirect, authenticated pass-through, and cashier page preservation.
- `specs/subsystem_cashier_gateway/tasks.md` - mark implementation tasks complete as they are delivered.
- `progress/impl_subsystem_cashier_gateway.md` - record implementation handoff, verification, traceability, and E2E gate outcome.

## Public Contract

- Protected route: `/admin/cash`.
- Login route: `/login`.
- Session cookie name: `admin_session`.
- Authorized session cookie value: `authorized_admin_session`.
- Unauthenticated redirect destination: `/login?callbackUrl=/admin/cash`.

## Data Flow

1. A browser requests `/admin/cash`.
2. The route gateway reads `admin_session` from request cookies.
3. If the value is not `authorized_admin_session`, it returns a redirect response to `/login` and attaches `callbackUrl` containing the requested route path.
4. If the value is valid, it returns `NextResponse.next()` and lets the cashier dashboard render normally.

## Error Handling

Missing, malformed, or unexpected session cookie values are all treated as unauthenticated and redirected to `/login`. No user-specific data is read or exposed by this feature.

## Next.js Local Docs Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` for App Router page conventions.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md` for redirect behavior and status expectations.
- `node_modules/next/dist/docs/01-app/02-guides/authentication.md` for server-side authentication checks and protected route guidance.

## Rejected Alternative

- Add a new backend auth controller for this feature. Rejected because the existing login API and admin route gateway already establish the session cookie contract, and the acceptance criteria only require guarding `/admin/cash` against unauthenticated access.
