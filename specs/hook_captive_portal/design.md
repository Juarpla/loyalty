# Design: Captive Portal State React Hook

## Affected Files
- `src/hooks/use-portal.hook.ts`: The new custom React hook.
- `tests/integration/hook_captive_portal.test.ts`: Integration tests for the hook.

## Public Interfaces

```typescript
export interface PortalRegisterData {
  name: string;
  phone: string;
}

export interface UsePortalReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  registerClient: (data: PortalRegisterData) => Promise<void>;
  reset: () => void;
}

export function usePortal(): UsePortalReturn;
```

## Data Flow
1. A component invokes `registerClient` with name and phone number.
2. The hook sets `isLoading` to true, clears any existing `error`, and resets `isSuccess` to false.
3. The hook performs a `fetch` POST request to `/api/v1/portal/register` with the provided data.
4. On success (e.g., 201 Created), `isLoading` is set to false, and `isSuccess` is set to true.
5. On failure, `isLoading` is set to false, and `error` is populated with the error message returned by the API or a fallback message.

## Error Handling
- Network errors or non-2xx HTTP responses will be caught.
- Error messages will be extracted from the API response payload (e.g., a 400 validation error) and exposed via the `error` state property.

## Rejected Alternatives
- **Using a generic data fetching library (e.g., SWR or React Query):** Rejected to keep dependencies minimal and strictly follow the custom hook architectural pattern established in the application for specific feature flows, providing explicit, tightly scoped state properties (`isLoading`, `isSuccess`, `error`).
