# Requirements - controller_promotions_segments (Feature ID: 21)

- **R1**: WHEN `PromotionsController.getSegments()` is invoked, the controller SHALL log the invocation via `logger.info` and call `ClientModel.getCustomerSegments()` to retrieve the segmentation result.
- **R2**: WHEN `ClientModel.getCustomerSegments()` resolves successfully, the controller SHALL return an object with `{ success: true, data: CustomerSegmentationResult }`.
- **R3**: IF `ClientModel.getCustomerSegments()` throws with a message equal to `'DB_CONNECTION_FAILURE'`, THEN the controller SHALL return `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }`.
- **R4**: IF `ClientModel.getCustomerSegments()` throws any other error, THEN the controller SHALL return `{ success: false, status: 500, error: <the error message> }`.
- **R5**: The `getSegments` method SHALL accept zero parameters and return a Promise resolving to `{ success: boolean; data?: CustomerSegmentationResult; status?: number; error?: string }`.
- **R6**: WHEN the controller catches any exception, it SHALL log the error via `logger.error` before returning the error response.
- **R7**: Integration tests in `tests/integration/controller_promotions_segments.test.ts` SHALL verify the JSON shape structure for both a successful response and each error scenario (R3, R4).
