import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    setupFiles: ['temporal-polyfill/global', './test/setup/local-date-equality.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'html', 'lcov', 'json', 'json-summary'],
      reportOnFailure: true,
      thresholds: {
        lines: 98,
        statements: 98,
        functions: 100,
        branches: 96,
      },
    },
  },
});
