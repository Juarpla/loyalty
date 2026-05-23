# Feature 16 - Manager Analytics Dashboard E2E Tests

## Design Document

### Overview
This feature adds E2E Playwright tests verifying that the Manager Dashboard's analytics charts render correctly across different viewport sizes without clipping or layout breakage.

### Files to Create
- `tests/e2e/manager_reports_responsiveness.spec.ts` - New E2E test file

### Files Affected
- No existing product code files are modified
- Only new test file is created

### Public Interfaces (Test API)
The test file will expose:
- `test.describe("Manager Reports Responsiveness", ...)` - Test suite
- Individual `test(...)` cases for each viewport scenario

### Test Approach
1. **Route Interception**: Mock `/api/v1/sales/metrics` endpoint with consistent traffic data
2. **Viewport Testing**: Use `page.setViewportSize()` for multiple dimensions
3. **Element Verification**: Use `page.getByTestId()` to verify chart visibility and no clipping
4. **Overflow Detection**: Verify `document.body.scrollWidth === window.innerWidth` to confirm no horizontal overflow

### Viewport Dimensions to Test
| Dimension | Label | Rationale |
|-----------|-------|-----------|
| 375 x 667 | iPhone SE/SE2 portrait | Common small mobile |
| 390 x 844 | iPhone 12/13/14 portrait | Modern mobile |
| 844 x 390 | iPhone 12/13/14 landscape | Mobile landscape |
| 768 x 1024 | iPad portrait | Common tablet |
| 1440 x 900 | Desktop | Standard desktop |

### Data Flow
```
Test Setup → Route Mock → Navigate → Set Viewport → Assert Chart Visibility → Assert No Overflow
```

### Error Handling
- Tests fail immediately if any chart bar is not visible at specified viewport
- Tests fail if horizontal overflow is detected at any viewport

### Rejected Alternatives
1. **Using visual regression screenshots**: Rejected because screenshot comparison is fragile across environments and doesn't provide precise element-level verification
2. **Testing only minimum viewport**: Rejected because layout issues may only appear at specific intermediate widths
3. **Using CSS media query testing**: Rejected because E2E tests should verify actual runtime behavior, not CSS implementation details