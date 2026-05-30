# Design

**Feature:** 75 - subsystem_manager_analytics

## Scope

This feature secures the existing executive operational control center route at `/admin/dashboard`. The codebase already contains:

- `src/middleware.ts`, which checks the `admin_session` cookie for `/admin/:path*`.
- `src/app/login/page.tsx` and `src/app/login/login.client.tsx`, which provide the login gateway.
- `src/app/admin/dashboard/page.tsx`, which renders the manager analytics dashboard.
- `tests/integration/subsystem-cashier-gateway.integration.test.ts`, which proves the same gateway contract for `/admin/cash`.

Implementation should reuse the existing admin route gateway instead of introducing a new authentication provider, dashboard wrapper, or route-local guard. The work is limited to proving and tightening the existing route protection contract for `/admin/dashboard`.

## Expected File Changes

- `src/middleware.ts` - keep the admin route guard responsible for `/admin/dashboard`; update only if required for testability or exact callback behavior.
- `tests/integration/subsystem-manager-analytics.integration.test.ts` - add Vitest coverage for unauthenticated redirect, authenticated pass-through, and dashboard page preservation.
- `specs/subsystem_manager_analytics/tasks.md` - mark implementation tasks complete as they are delivered.
- `progress/impl_subsystem_manager_analytics.md` - record implementation handoff, verification, traceability, and E2E gate outcome.

## Public Contract

- Protected route: `/admin/dashboard`.
- Login route: `/login`.
- Session cookie name: `admin_session`.
- Authorized session cookie value: `authorized_admin_session`.
- Unauthenticated redirect destination: `/login?callbackUrl=/admin/dashboard`.

## Data Flow

1. A browser requests `/admin/dashboard`.
2. The route gateway reads `admin_session` from request cookies.
3. If the value is not `authorized_admin_session`, it returns a redirect response to `/login` and attaches `callbackUrl` containing the requested route path.
4. If the value is valid, it returns `NextResponse.next()` and lets the manager analytics dashboard render normally.

## Error Handling

Missing, malformed, or unexpected session cookie values are all treated as unauthenticated and redirected to `/login`. No manager analytics data is read or exposed by this feature before the route gateway allows the request through.

## Next.js Local Docs Consulted

- `node_modules/next/dist/docs/01-app/02-guides/authentication.md` for session management and protected route guidance.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md` for redirect response behavior and status expectations.
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` for App Router page conventions.

## Rejected Alternative

- Add a dashboard-specific client-side redirect in `src/app/admin/dashboard/page.tsx`. Rejected because protected route decisions must happen before the dashboard renders, and the existing middleware already provides a single server-side gateway for all `/admin/:path*` routes.
