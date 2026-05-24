# Requirements - hook_manager_campaigns (Feature ID: 26)

## EARS Requirements

- **R1**: The hook SHALL expose reactive state for `segments` (`CustomerSegmentationResult | null`), `segmentsLoading` (`boolean`), `segmentsError` (`string | null`), `campaigns` (`GeminiRecoveryPromptResult[] | null`), `generating` (`boolean`), `generateError` (`string | null`), and a `generateCampaigns` callback — so UI components can manage campaign workflows without networked state.

- **R2**: WHEN the hook mounts, it SHALL automatically issue a GET request to `/api/v1/promotions/segments`, set `segmentsLoading` to `true`, and keep it `true` until the fetch settles (success or failure).

- **R3**: IF the segments API responds with HTTP `200` and `{ success: true, data: <CustomerSegmentationResult> }`, THEN the hook SHALL set `segments` to the parsed payload, clear `segmentsError`, and set `segmentsLoading` to `false`.

- **R4**: IF the segments API responds with a non-`200` status or the response body indicates `success: false`, THEN the hook SHALL set a descriptive `segmentsError` string from the API error, set `segments` to `null`, and set `segmentsLoading` to `false`.

- **R5**: IF the segments fetch throws (network failure), THEN the hook SHALL set `segmentsError` to a generic network error message, set `segments` to `null`, and set `segmentsLoading` to `false`.

- **R6**: WHEN `generateCampaigns` is invoked, the hook SHALL set `generating` to `true`, clear `generateError` and any prior `campaigns`, and issue a GET request to `/api/v1/promotions/generate`.

- **R7**: IF the generate API responds with HTTP `200` and `{ success: true, data: { campaigns: <GeminiRecoveryPromptResult[]> } }`, THEN the hook SHALL set `campaigns` to the `campaigns` array, clear `generateError`, and set `generating` to `false`.

- **R8**: IF the generate API responds with a non-`200` status, `success: false`, or the fetch throws (network failure), THEN the hook SHALL set `generateError` to the API error or a generic network message, clear `campaigns`, and set `generating` to `false`.

- **R9**: Integration tests in `tests/integration/hook_manager_campaigns.test.ts` SHALL mock `fetch` responses and assert: segments auto-fetch on mount with loading toggles (R2/R3/R4/R5), success caching (R3), error handling (R4/R5), generate trigger with loading toggles (R6/R7/R8), and generate error handling (R8).
