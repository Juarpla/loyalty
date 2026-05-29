# Tasks - api_company_wifi_routes (Feature ID: 70)

- [x] T1 - Create `src/app/api/v1/company/[companyId]/wifi/route.ts` with a GET handler that awaits dynamic params, delegates to `CompanyController.getWifiSettings`, and maps the controller packet to `NextResponse.json`. Covers: R1, R2, R3, R7.
- [x] T2 - Add a POST handler in the same route file that parses JSON, delegates to `CompanyController.upsertWifiSettings`, maps success and error packets, and returns the required invalid JSON response without controller delegation. Covers: R4, R5, R6, R7.
- [x] T3 - Add `tests/integration/api_company_wifi_routes.test.ts` covering GET delegation, POST delegation, malformed JSON, controller-provided error statuses, and fallback 500 behavior with requirement IDs in test names. Covers: R1, R2, R3, R4, R5, R6, R7, R8.
- [x] T4 - Run `pnpm test:agent` and `./init.sh`, then write `progress/impl_api_company_wifi_routes.md` with implementation summary, traceability, verification output, and E2E gate outcome. Covers: R8.
