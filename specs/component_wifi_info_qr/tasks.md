# Tasks: Captive Portal Password and QR UI Component

- [x] T1 - Implement/Refactor the presenter component `WifiInfoQrComponent` in `src/components/wifi/qr.component.tsx` to accept props: `ssid: string`, `password?: string`, `security?: string`, and `onCopy?: () => void`. Covers: R1, R2.
- [x] T2 - Code a lightweight, zero-dependency pure-Javascript offline QR Code matrix encoder (supporting Version 3, Medium Error Correction) that translates the formatted Wi-Fi string `WIFI:S:<SSID>;T:<SECURITY>;P:<PASSWORD>;;` into a two-dimensional grid of modules. Covers: R3.
- [x] T3 - Integrate inline SVG rendering using a single dynamic `<path>` element based on coordinates from the computed QR matrix, featuring crisp pixels and responsive auto-scaling. Covers: R4.
- [x] T4 - Program the 'Copy Password' button click/tap handler to execute `navigator.clipboard.writeText` with the Wi-Fi password. Covers: R5.
- [x] T5 - Implement the temporary state variables (`copied`, `setCopied`) to display a high-contrast copied success banner and dynamically transition ARIA labels, automatically resetting back to idle after `2000ms`. Covers: R6.
- [x] T6 - Build premium glassmorphic visual styles using Tailwind CSS, featuring subtle hover transformations, glowing backdrop lights, high-contrast monospace text boxes, and a tactile button layout with a minimum physical tap target of 48px. Covers: R7, R8.
- [x] T7 - Integrate full ARIA attributes: a screen-reader readable `<title>` within the SVG, dynamic `aria-label` tags for the copy button, and high-contrast color choices. Covers: R9.
- [x] T8 - Create Vitest component integration tests in `tests/integration/wifi_qr.test.tsx` that mock clipboard APIs, mount `WifiInfoQrComponent` with dynamic credentials, and assert visual text rendering, SVG generation, clipboard updates, and state transitions. Covers: R1, R2, R3, R4, R5, R6, R9.
- [x] T9 - Create Playwright E2E tests in `tests/e2e/component_wifi_info_qr.spec.ts` asserting responsive mobile viewport layouts, visually sound styling boundaries, and tap-target size compliance. Covers: R7, R8.
