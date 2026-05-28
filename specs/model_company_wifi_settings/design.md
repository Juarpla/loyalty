# Design

## Affected Areas

- `src/backend/models/company.model.ts` (new model layer)
- `src/backend/types/company.type.ts` or colocated exported model types if no shared company type file exists
- `tests/integration/model_company_wifi_settings.integration.test.ts`
- `tests/integration/model_company_wifi_settings.test.ts`
- `progress/impl_model_company_wifi_settings.md`

## Model Contract

The feature introduces a backend-only `CompanyModel` responsible for read and upsert operations against the `company_wifi_settings` table created by feature 67.

Public methods:

```typescript
type CompanyWifiSettings = {
  company_id: string
  ssid: string
  wifi_password: string
  welcome_title: string
  welcome_message: string
  brand_color: string
}

type UpsertCompanyWifiSettingsInput = {
  company_id: string
  ssid: string
  wifi_password: string
  welcome_title?: string
  welcome_message?: string
  brand_color?: string
}

class CompanyModel {
  static getWifiSettings(companyId: string): Promise<CompanyWifiSettings | null>
  static upsertWifiSettings(input: UpsertCompanyWifiSettingsInput): Promise<CompanyWifiSettings>
}
```

## Data Flow

`getWifiSettings(companyId)` validates the ID, queries `company_wifi_settings` by `company_id`, and maps a missing row to `null`. A successful row is returned using the public `CompanyWifiSettings` shape.

`upsertWifiSettings(input)` validates required fields, writes to `company_wifi_settings` using `company_id` as the conflict target, and returns the persisted row. Optional branding fields rely on database defaults when omitted.

Both methods use the existing Supabase model/client abstraction under `src/backend/models/supabase.model.ts`, matching the established backend model pattern. Database connection and network failures are normalized to `DB_CONNECTION_FAILURE`.

## Error Handling

- Empty `companyId`, missing `company_id`, missing `ssid`, or missing `wifi_password` throws `VALIDATION_ERROR`.
- Network failures, connection refused errors, and Supabase client connection errors throw `DB_CONNECTION_FAILURE`.
- A successful read with no matching row returns `null`, not an exception.

## Testing Strategy

Vitest integration tests cover:

- R1: read returns a persisted settings record for an existing company.
- R2 and R5: validation failures throw `VALIDATION_ERROR`.
- R3: read returns `null` for a company without settings.
- R4: upsert creates and updates the one-to-one settings row for a company.
- R6: read and upsert database connection failures throw `DB_CONNECTION_FAILURE`.
- R7: test files exist in both the project runner suffix and acceptance-criteria path.

## Consulted Documentation

- `docs/specs.md`
- `docs/architecture.md`
- `docs/conventions.md`
- `docs/verification.md`

No Next.js App Router guide is required because this feature does not edit Next.js route, page, layout, or component code.

## Rejected Alternatives

- **Controller-level implementation**: Rejected because feature 68 is explicitly the database model layer. HTTP validation and request mapping belong to feature 69.
- **Direct Supabase calls from future routes**: Rejected because `docs/architecture.md` requires database access to stay inside backend models.
