# Tasks - subsystem_captive_portal (Feature ID: 76)

- [x] T1 - Audit `src/app/portal/page.tsx`, `src/app/portal/portal.client.tsx`, `src/hooks/use-portal.hook.ts`, and `src/components/wifi/qr.component.tsx` against the approved requirements; make only the route, state, accessibility, or rendering adjustments needed for missing behavior. Covers: R1, R2, R3, R4, R5, R6, R7, R8.
- [x] T2 - Add `tests/e2e/subsystem_captive_portal.e2e.test.ts` covering `/portal` route access, title metadata, form visibility, registration POST payload, delayed loading state, success QR view, failed registration alert, visible SSID/copy-password controls, mobile overflow, and 44px touch targets. Covers: R1, R2, R3, R4, R5, R6, R7, R8, R9.
- [x] T3 - Run `pnpm test:agent`, run the targeted Playwright suite for `subsystem_captive_portal`, run `./init.sh`, and record verification evidence plus E2E gate outcome in `progress/impl_subsystem_captive_portal.md`. Covers: R9.
