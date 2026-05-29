# Design - api_company_wifi_routes (Feature ID: 70)

## Affected Files

- [NEW] `src/app/api/v1/company/[companyId]/wifi/route.ts`
- [NEW] `tests/integration/api_company_wifi_routes.test.ts`
- [UPDATE] `specs/api_company_wifi_routes/tasks.md`
- [NEW] `progress/impl_api_company_wifi_routes.md`

## Route Contract

Feature 70 adds an App Router pasamanos route for company WiFi settings:

```typescript
export async function GET(
  request: Request,
  context: { params: Promise<{ companyId: string }> },
): Promise<NextResponse>

export async function POST(
  request: Request,
  context: { params: Promise<{ companyId: string }> },
): Promise<NextResponse>
```

The route lives at `src/app/api/v1/company/[companyId]/wifi/route.ts`, so the public path is `/api/v1/company/<companyId>/wifi`.

## Data Flow

GET flow:

1. Await `context.params` and read `companyId`.
2. Call `CompanyController.getWifiSettings(companyId)`.
3. Return `NextResponse.json(result, { status })`, where success uses 200 and failure uses `result.status || 500`.

POST flow:

1. Await `context.params` and read `companyId`.
2. Parse the request body with `request.json()`.
3. If parsing fails, return a 400 invalid JSON packet without invoking the controller.
4. Call `CompanyController.upsertWifiSettings(companyId, body)`.
5. Return `NextResponse.json(result, { status })`, where success uses `result.status || 200` and failure uses `result.status || 500`.

The route must not validate SSID, password, branding fields, or company ID itself. Feature 69 already centralized those checks inside `CompanyController`, keeping this route as a thin pass-through.

## Error Handling

- Invalid POST JSON returns:

```json
{
  "success": false,
  "status": 400,
  "error": "Invalid JSON payload"
}
```

- Controller validation errors and database failures are forwarded exactly as controller packets.
- Missing controller status on error responses falls back to HTTP 500.
- Unexpected controller rejections may be caught at the route layer and converted to `success: false`, `status: 500`, and `error: "INTERNAL_SERVER_ERROR"` only if implementation discovers an existing route pattern requiring this defensive wrapper.

## Testing Strategy

Vitest integration tests will import `GET` and `POST` from the route file and spy on `CompanyController` methods.

- R1, R2, R3: GET awaits route params, passes the dynamic `companyId`, and returns a 200 success payload.
- R4, R5: POST parses JSON, passes the dynamic `companyId` and parsed body, and returns a success payload.
- R6: malformed JSON returns 400 and does not call `CompanyController.upsertWifiSettings`.
- R7: controller error packets preserve status codes and use 500 when status is absent.
- R8: test names reference requirement IDs and live in the required test file.

## Consulted Documentation

- `docs/specs.md`
- `docs/architecture.md`
- `docs/conventions.md`
- `docs/verification.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`

## Rejected Alternatives

- Parsing or validating WiFi credentials in the route was rejected because validation belongs in `CompanyController` and was already specified by feature 69.
- Using a static `/api/v1/company/wifi` route with query parameters was rejected because the feature explicitly requires dynamic route parameters.
- Adding PUT or PATCH handlers was rejected because the feature acceptance criteria only names GET and POST.
