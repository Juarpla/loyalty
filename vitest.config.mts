import { defineConfig } from 'vitest/config'
import path from 'path'

// Vitest is used for INTEGRATION tests only.
// - Test logic, data flow, API helpers, server utilities.
// - Do NOT use for component rendering or browser interactions; use Playwright for those.
// Integration test files live in tests/integration/ with .integration.test.ts suffix.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.integration.test.ts'],
    globals: true,
  },
})

