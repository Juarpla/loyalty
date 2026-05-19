import { describe, it, expect } from 'vitest'

// Smoke test: verifies the Vitest integration test runner is configured correctly.
// This test must always pass. Do not delete or skip it.
// Integration tests (R<n> coverage) live alongside this file in tests/integration/.
describe('Integration test runner smoke check', () => {
  it('vitest should execute correctly', () => {
    expect(1 + 1).toBe(2)
  })
})
