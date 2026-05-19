---
to: tests/integration/<%= h.changeCase.kebab(name) %>.integration.test.ts
---
import { describe, it, expect } from 'vitest'

describe('<%= h.changeCase.pascal(name) %> Integration Tests', () => {
  // R1 -> Traceability mapping
  it('R1: should execute successfully', () => {
    expect(true).toBe(true)
  })
})
