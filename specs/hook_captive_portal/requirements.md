# Requirements: Captive Portal State React Hook

- **R1**: WHEN a registration is triggered with client details, the system MUST execute a POST fetch operation to the `/api/v1/portal/register` endpoint.
- **R2**: WHEN the registration fetch is in progress, the system MUST toggle an active busy/loading state to true.
- **R3**: WHEN the registration fetch completes successfully, the system MUST toggle the busy/loading state to false and set a success indicator.
- **R4**: IF the registration fetch fails (e.g., due to a 400 validation error or network issue), THEN the system MUST toggle the busy/loading state to false and expose an error message.
- **R5**: The system MUST manage and expose the local state for client details (e.g., name, phone number) to allow the UI to bind to them if needed, or simply accept them as arguments to the register function.
