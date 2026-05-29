# Requirements - api_company_wifi_routes (Feature ID: 70)

- **R1**: The API route MUST expose a GET handler at `/api/v1/company/[companyId]/wifi` using the Next.js App Router dynamic route path `src/app/api/v1/company/[companyId]/wifi/route.ts`.
- **R2**: WHEN a GET request is handled, the API route MUST await the dynamic `companyId` route parameter and delegate it unchanged to `CompanyController.getWifiSettings(companyId)`.
- **R3**: IF `CompanyController.getWifiSettings(companyId)` returns a success packet, THEN the API route MUST return a 200 JSON response containing that packet.
- **R4**: The API route MUST expose a POST handler at `/api/v1/company/[companyId]/wifi` using the same dynamic route file.
- **R5**: WHEN a POST request contains valid JSON, the API route MUST await the dynamic `companyId` route parameter and delegate `companyId` plus the parsed request body to `CompanyController.upsertWifiSettings(companyId, body)`.
- **R6**: IF POST request JSON parsing fails, THEN the API route MUST return a 400 JSON response with `success: false`, `status: 400`, and `error: "Invalid JSON payload"` without calling the controller.
- **R7**: IF either controller method returns an error packet, THEN the API route MUST return that packet with the controller-provided status code, defaulting to 500 when the packet has no status.
- **R8**: The system MUST include Vitest integration coverage in `tests/integration/api_company_wifi_routes.test.ts` for GET delegation, POST delegation, invalid JSON handling, controller error status mapping, and fallback 500 status mapping.
