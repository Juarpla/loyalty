# Current Session
- **Feature in progress:** —
- **Start:** 2026-05-31T03:24:35-05:00
- **Agent:** implementer (GPT-5 via OpenAI)

# Plan
- Preserve `/portal` as the no-session demo captive portal.
- Add a stable logged-in admin portal identifier for `/portal/<companyId>`.
- Route home portal entry points and WiFi settings reads/writes through that identifier when an admin session is active.
- Verify with focused auth tests, lint, build, and full harness.

# Log
- Ran `./init.sh`; harness passed with 322 tests, lint, and production build before changes.
- Read implementer contract, architecture/conventions docs, and local Next.js layouts/pages routing guide.
- Inspected auth login/register routes, admin auth utilities, home hub links, portal routes, and WiFi settings hook.
- Added `admin_company_id` cookie creation on successful login using a stable identifier derived from the registered username.
- Updated the home hub to link active sessions to `/portal/<admin_company_id>` and unauthenticated sessions to `/portal`.
- Updated WiFi settings hook to read/write the active admin company settings from the session identifier cookie, defaulting to `demo-company`.
- Expanded auth integration coverage for registered-user portal IDs and demo fallback IDs.
- Ran `pnpm test tests/integration/auth-registration.integration.test.ts`; 5 tests passed.
- Ran `pnpm lint`; passed.
- Ran `pnpm build`; passed.
- Ran `pnpm test`; 45 files and 323 tests passed.
- Ran final `./init.sh`; harness ready (full).
- Fixed legacy active sessions by deriving the unique portal ID from registered credentials when `admin_company_id` is missing.
- Fixed offline WiFi settings persistence so local updates are visible in `/portal/<companyId>`.
- Ran focused auth/company tests; passed.
- Ran local smoke test against `http://127.0.0.1:3000`; home linked to `/portal/company-ii28ct` and portal rendered updated SSID/title.
- Ran `pnpm test`; 45 files and 324 tests passed.
- Ran final `./init.sh`; harness ready (full).

# Next step
- Portal route behavior update complete; ready for human review.
