# Requirements - hook_social_content (Feature ID: 35)

- **R1**: The hook SHALL expose controlled form state for `context` (string) plus a setter so UI components can bind an input without performing network requests.
- **R2**: WHEN the `generateIdeas` callback is invoked, the hook SHALL set `loading` to `true`, clear any prior `error` and `successMessage`, and issue a `POST` request to `/api/v1/social/ideas` with JSON body `{ context }`.
- **R3**: WHILE `loading` is `true`, the hook SHALL keep `loading` at `true` until the fetch settles (success or failure).
- **R4**: IF the API responds with HTTP 200 and `{ success: true, data: { ideas: SocialIdea[] } }`, THEN the hook SHALL store the `ideas` array in state, reset `context` to an empty string, set a non-empty `successMessage`, and set `loading` to `false`.
- **R5**: IF the API responds with a non-200 status or `{ success: false, error: string }`, THEN the hook SHALL set a descriptive `error` string, preserve the current `context` value, clear `successMessage`, and set `loading` to `false`.
- **R6**: IF the fetch throws (network failure), THEN the hook SHALL set a generic `error` message, preserve the current `context` value, and set `loading` to `false`.
