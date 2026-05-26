# Implementation: Captive Portal Password and QR UI Component

## Summary
Implemented the `WifiInfoQrComponent` as a premium, glassmorphic UI component for the Captive Portal. Built a lightweight, zero-dependency, inline QR Code matrix generator that natively renders crisp SVG `<path>` vectors without external dependencies. The component correctly manages internal state for the clipboard copy action and enforces strict styling rules (min 48px tap targets, max 384px width).

## Files Changed
- `src/components/wifi/qr.component.tsx` (Component + inline QR Matrix Generator)
- `tests/integration/wifi_qr.test.tsx` (Integration tests)
- `tests/e2e/component_wifi_info_qr.e2e.test.ts` (E2E tests)

## Commands Run
- `pnpm test:agent` [OK]
- `pnpm test:e2e tests/e2e/component_wifi_info_qr.e2e.test.ts` [OK] (fixed stale dev server blocking tests)
- `./init.sh --quick` [OK]

## Traceability
- R1 -> `tests/integration/wifi_qr.test.tsx: "R1, R2: renders with provided props"`
- R2 -> `tests/integration/wifi_qr.test.tsx: "R1, R2: renders with provided props"`
- R3 -> `tests/integration/wifi_qr.test.tsx: "R3, R4: generates a crisp SVG QR code matrix"`
- R4 -> `tests/integration/wifi_qr.test.tsx: "R3, R4: generates a crisp SVG QR code matrix"`
- R5 -> `tests/integration/wifi_qr.test.tsx: "R5, R6, R9: handles copy interactions and state transitions"`
- R6 -> `tests/integration/wifi_qr.test.tsx: "R5, R6, R9: handles copy interactions and state transitions"`
- R7 -> `tests/e2e/component_wifi_info_qr.e2e.test.ts: "R7: layout fits within mobile viewport (max-w-sm)"`
- R8 -> `tests/e2e/component_wifi_info_qr.e2e.test.ts: "R8: tap targets have minimum 44px size"`
- R9 -> `tests/integration/wifi_qr.test.tsx: "R3, R4: generates a crisp SVG QR code matrix" and "R5, R6, R9: handles copy interactions and state transitions"`

## E2E Gate
The feature change is isolated to a single UI component and does not represent a broad cross-layer change. However, Task 9 explicitly required the creation of Playwright E2E tests for responsive viewports and tap targets. The E2E tests have been rewritten to no longer be hollow no-ops. They now navigate to a dedicated test route (`/test/wifi-qr`) where the component is explicitly mounted, and strictly assert the layout and tap target constraints without conditional skips.
