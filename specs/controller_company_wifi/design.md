# Design

## Affected Areas

- `src/backend/controllers/company.controller.ts`
- `tests/integration/controller_company_wifi.integration.test.ts`
- `specs/controller_company_wifi/tasks.md`
- `progress/impl_controller_company_wifi.md`

## Controller Contract

Feature 69 introduces a backend-only controller class that coordinates HTTP-ready company WiFi settings operations without importing Next.js route primitives.

```typescript
type CompanyControllerResponse = {
  success: boolean
  status?: number
  data?: unknown
  error?: string
}

class CompanyController {
  static getWifiSettings(companyId: unknown): Promise<CompanyControllerResponse>
  static upsertWifiSettings(
    companyId: unknown,
    requestBody: unknown,
  ): Promise<CompanyControllerResponse>
}
```

The controller delegates persistence to `CompanyModel` from `src/backend/models/company.model.ts`.

## Validation And Sanitization

`companyId` must be a non-empty string after trimming. Invalid IDs return `{ success: false, status: 400, error: "Validation failed: Company ID is required" }`.

For upserts, `requestBody` must be a plain object. The controller reads:

- `ssid`: required string, trimmed, at least 1 character.
- `wifi_password`: required string, trimmed, between 8 and 64 characters inclusive.
- `welcome_title`: optional string, trimmed, 1 to 80 characters when provided.
- `welcome_message`: optional string, trimmed, 1 to 240 characters when provided.
- `brand_color`: optional string, trimmed, matching `#[0-9a-fA-F]{6}` when provided.

Only provided optional fields are forwarded to the model. The model remains responsible for database defaults when optional fields are absent.

## Data Flow

Read flow:

1. Validate and trim `companyId`.
2. Call `CompanyModel.getWifiSettings(trimmedCompanyId)`.
3. Return `{ success: true, status: 200, data: settingsOrNull }`.

Upsert flow:

1. Validate and trim `companyId`.
2. Validate that the request body is an object.
3. Build a sanitized `UpsertCompanyWifiSettingsInput` with `company_id` from the URL/path parameter.
4. Call `CompanyModel.upsertWifiSettings(input)`.
5. Return `{ success: true, status: 200, data: settings }`.

## Error Handling

- Request validation failures return status 400.
- Model `VALIDATION_ERROR` returns status 400.
- Model `DB_CONNECTION_FAILURE` returns status 500 with error `DB_CONNECTION_FAILURE`.
- Any other model or runtime exception returns status 500 with `Internal Server Error`.
- The controller logs unexpected failures through `logger.error`, following existing backend controller patterns.

## Testing Strategy

Vitest integration tests mock `CompanyModel` methods and verify:

- R1: read delegates and returns model data.
- R2: invalid read company IDs return 400 without model calls.
- R3: valid upsert trims strings and forwards the sanitized input.
- R4 and R5: missing body, empty SSID, and password bounds return 400.
- R6: invalid optional branding fields return 400.
- R7: model `VALIDATION_ERROR` maps to 400.
- R8: model `DB_CONNECTION_FAILURE` maps to 500.
- R9: unexpected model errors map to 500.
- R10: the runner-compliant integration test file exists and references requirement IDs.

## Consulted Documentation

- `docs/specs.md`
- `docs/architecture.md`
- `docs/conventions.md`
- `docs/verification.md`

No local Next.js guide is required for this feature because it adds only a backend controller and does not edit App Router route, page, layout, or component code.

## Rejected Alternatives

- Directly parsing `Request` objects inside the controller was rejected because route handlers are the pasamanos layer; this controller should stay framework-independent and accept plain values.
- Calling Supabase from the controller was rejected because database access belongs in `CompanyModel`.
