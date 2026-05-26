# Requirements: Captive Portal Password and QR UI Component

## 1. Feature Description
Renders the local Wi-Fi SSID, password, a touch-trigger clipboard copy button, and a dynamically generated, zero-dependency visual Wi-Fi connection QR code inside `src/components/wifi/qr.component.tsx`.

## 2. Requirements Specification (EARS-style)

- **R1 (Ubiquitous):** The `WifiInfoQrComponent` MUST accept `ssid` and `password` props as non-empty strings, and an optional `security` prop as a string (defaulting to `"WPA"`).
- **R2 (Ubiquitous):** The component MUST display the active SSID and security parameters clearly in text within the component interface.
- **R3 (Ubiquitous):** The component MUST dynamically generate a Wi-Fi connection QR code corresponding to the standard string `WIFI:S:<SSID>;T:<SECURITY>;P:<PASSWORD>;;` using a pure-Javascript, zero-dependency offline generator.
- **R4 (Ubiquitous):** The component MUST render the QR code as a responsive, pixel-perfect vector `<svg>` tag composed of vector components (e.g. `<rect>` or a single `<path>` element) for crisp rendering across high-DPI displays.
- **R5 (Event-driven):** WHEN the user taps or clicks the 'Copy Password' button, the component MUST write the raw `password` string to the user's system clipboard using the `navigator.clipboard.writeText` API.
- **R6 (State-driven):** WHILE the credentials have been copied successfully, the button MUST display a success state (e.g., "Copied!", teal/green highlight) for exactly `2000` milliseconds before reverting back to the default copy state.
- **R7 (Ubiquitous):** The component MUST use a mobile-first premium glassmorphism card theme, scaling fluidly across mobile, tablet, and desktop viewports up to a maximum width of `384px` (`max-w-sm`).
- **R8 (Ubiquitous):** Every interactive button and tap zone in the component MUST have a minimum physical size of `44px` in height and width.
- **R9 (Ubiquitous):** The component MUST define explicit ARIA accessibility attributes, including an `aria-label` for the copy action button and a `<title>` tag within the SVG element describing the connection QR code.

## 3. Verification Plan
- **Verification of R1 & R2:** Run Vitest components render checks asserting that props are successfully accepted and correct SSID and Security text are rendered in the DOM.
- **Verification of R3 & R4:** Check that the QR code SVG element is output in the DOM and matches the computed string format. Verify that standard scan tests decode the dynamic QR format correctly.
- **Verification of R5 & R6:** Mock `navigator.clipboard` write actions to verify the password string copy event, check that the copy success state triggers, and assert that the component returns to the idle state after 2 seconds.
- **Verification of R7 & R8:** E2E Playwright tests verifying the component fits correctly within a mobile viewport width (e.g. 360px or 375px) without overflowing and has tap target sizes >= 44px.
- **Verification of R9:** Audit the generated HTML output using testing library queries to ensure screen-reader accessible names and labels exist.
