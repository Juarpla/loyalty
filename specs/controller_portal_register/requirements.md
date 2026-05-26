# Requirements: controller_portal_register

- **R1**: WHEN processing a portal registration request, the controller MUST extract and validate the `name` and `phone` parameters from the input payload.
- **R2**: IF the `phone` parameter format is invalid (e.g., non-numeric, wrong length based on local conventions), THEN the controller MUST immediately abort and return a `400 Bad Request` error packet.
- **R3**: IF the `name` parameter length is invalid (e.g., empty or exceedingly long), THEN the controller MUST immediately abort and return a `400 Bad Request` error packet.
- **R4**: WHEN validation succeeds, the controller MUST invoke the captive portal model's upsert layer to register the client and log the session.
- **R5**: The system MUST cover the validation rules (both successful and failing paths) via integration tests in `tests/integration/controller_portal_register.test.ts`.
