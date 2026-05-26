# Design: Captive Portal Password and QR UI Component

## 1. Technical Context & Consultation
This feature implements the post-registration display on the Captive Portal onboarding page. When customers successfully submit their credentials via the portal form, they see this premium component detailing their custom network connection details and an automated QR code they can scan to instantly join.
To ensure the premium design complies with framework standards and repository patterns, the following guidelines and guides were consulted:
- **Project Structure & RSC Rules**: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` and `05-server-and-client-components.md` (ensuring `"use client"` is utilized correctly for interactive components that read/write clipboards and manage local React state).
- **Aesthetics & Premium Styling**: Complies with the glassmorphism layout, sleek typography, vibrant/harmonious color palette, and micro-animations defined in `AGENTS.md` and standard layout conventions.

---

## 2. Component Architecture & Public Interface

### File Location:
- `src/components/wifi/qr.component.tsx` (modifying the existing skeleton file)

### Component Props:
```typescript
interface WifiInfoQrComponentProps {
  ssid: string;
  password?: string;
  security?: string;
  onCopy?: () => void;
}
```

### Component State:
- `copied: boolean`: Manages the active visual clipboard feedback, resetting after exactly `2000ms`.

---

## 3. Pure JavaScript Offline QR Code Generator

To comply with zero-dependency offline functionality, the file will contain a lightweight, highly-optimized inline QR Code matrix generator helper (or a clean utility class). 

### QR Code Standard Wi-Fi String Format:
The generator accepts a text string of the form:
`WIFI:S:<SSID>;T:<SECURITY>;P:<PASSWORD>;;`

### Generator Blueprint (Version 3, M Error Correction):
A Version 3 QR Code has a grid size of `29x29` modules, which comfortably encodes standard Wi-Fi strings of length 30-70 characters. The encoder implements:
1. **Galois Field `GF(256)` Math**: Defines exponent and log tables for Reed-Solomon polynomial division.
2. **Reed-Solomon Error Correction**: Computes error correction bytes using standard generator polynomials.
3. **Matrix Builder**:
   - Places the three 7x7 **Finder Patterns** at coordinates `(0,0)`, `(22,0)`, and `(0,22)`.
   - Places 1x1 **Alignment Pattern** at `(20,20)`.
   - Places horizontal/vertical **Timing Patterns** (alternating black/white modules at row 6 and col 6).
   - Fills data and error correction bits in a standard snake-like column traversal.
   - Applies the default masking pattern (e.g. Mask Pattern 0: `(row + col) % 2 === 0`) to avoid large uniform blocks.
   - Places the Format Information bytes.

### Elegant Inline SVG Renderer:
Instead of creating heavy, pixelated DOM tables or canvas objects, the matrix is rendered as a clean, responsive vector graphic:
- An `<svg>` element with `viewBox="0 0 29 29"` and `shape-rendering="crispEdges"`.
- A `<path>` element that uses a single string builder to trace the coordinates of all black modules using the SVG path format: `M x y h 1 v 1 h -1 z`. This renders perfectly, scales cleanly to any resolution, and minimizes HTML size.

---

## 4. UI/UX & Styling Guidelines

The component features a highly polished design to wow users:
- **Glassmorphic Card Wrapper**: Renders using Tailwind classes like `bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6`.
- **Top Accent Lights**: Subtle glowing backdrops (`absolute bg-teal-500/10 blur-[40px] rounded-full pointer-events-none`) that transition when hovered.
- **Micro-Animations**: The card scales slightly on hover (`hover:scale-[1.01] hover:border-zinc-700/80 transition-all duration-300`).
- **Tactile Copy Button**:
  - Minimum size of `48px` in height to exceed the standard `44px` touch target rule.
  - Smooth background transitions: active hover states, and a distinct teal/green theme transition when `copied === true`.
- **Contrast & Hierarchy**:
  - Header: Vivid white title, subtle teal subheader tag ("Automatic Join"), soft zinc-500 descriptions.
  - Connection Box: Clean monospace font container `bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 font-mono`.

---

## 5. Accessibility (ARIA) Details

- **SVG Accessibility**: The SVG element MUST include `role="img"` and a `<title>` tag (e.g. `Wi-Fi Automatic Connection QR Code`) to provide screen reader accessibility.
- **Clipboard Trigger**: The button MUST include `aria-label="Copy Wi-Fi password to clipboard"`. When the state transitions to copied, the `aria-label` updates dynamically to `"Wi-Fi password copied successfully"`.
- **Color Contrast**: Complies with standard WCAG AA contrast rules, ensuring text elements have a contrast ratio of at least 4.5:1 against the zinc backdrops.

---

## 6. Alternatives Rejected

- **Alternative 1: Install `qrcode` or `qrcode.react` package via npm.**
  *Reason for Rejection*: Standard npm QR packages require external dependencies and can expand bundle sizes. A zero-dependency inline generator satisfies offline capabilities without package compilation bloat.
- **Alternative 2: Render QR Code using HTML canvas element.**
  *Reason for Rejection*: Canvas elements are raster graphics, becoming blurry when scaled or displayed on high-density Retina displays. SVG vector output provides razor-sharp edges and responsive scaling under pure CSS controls.
