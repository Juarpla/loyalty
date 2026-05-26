# Design

## Affected Files
* `src/app/api/v1/portal/register/route.ts` (New file)
* `tests/integration/api_portal_register_route.test.ts` (New file)

## Public Interface
* **Endpoint**: `POST /api/v1/portal/register`
* **Request**: Requires JSON payload containing `name` and `phone`.
* **Success Response**: Returns HTTP `201 Created` with the JSON object `{ success: true, status: 200, data: ... }`
* **Error Response**: Returns HTTP `400 Bad Request` or `500 Internal Server Error` with JSON object `{ success: false, status: ..., error: ... }`

## Data Flow & Error Handling
1. Next.js App Router intercepts the POST request at the `src/app/api/v1/portal/register/route.ts` endpoint.
2. The route handler attempts to extract and parse the JSON body. If parsing fails, it immediately catches the exception and returns a `400 Bad Request` with an `Invalid JSON payload` error message.
3. Upon successful parsing, the route delegates to `registerPortalClient` (from `src/backend/controllers/portal.controller.ts`) passing the parsed body object.
4. The controller handles all validation (name length, phone regex) and database interactions (upsert to `clients`, insert to `wifi_logins`), returning a structured `ResultObject`.
5. The API route receives the `ResultObject`. If `result.success` is `false`, the route returns the object utilizing `result.status` (defaulting to 500).
6. If `result.success` is `true`, the API route overrides the status code and returns `201 Created` along with the JSON payload.

## Next.js local docs consulted
* `node_modules/next/dist/docs/01-app/02-guides/testing/index.md`
* `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
