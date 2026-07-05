import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Test config lives here (not in vite.config.ts) so it has a stable home
// independent of the lib/site build branches.
export default defineConfig({
  plugins: [react()],
  // The docs registry (used by the smoke suite) imports from '@hamidrezazargham/liquidkit'.
  resolve: {
    alias: { '@hamidrezazargham/liquidkit': resolve(__dirname, 'src/index.ts') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Don't pick up the agent's worktree copies under .claude/.
    exclude: [...configDefaults.exclude, '**/.claude/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**'],
      exclude: [
        'src/test/**',
        'src/**/*.d.ts',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        // Pure presentational icon set — exercised via the smoke suite.
        'src/icons/icons.tsx',
      ],
      // Conservative floors (current: ~76% stmts / ~71% branches) so CI catches
      // regressions without being flaky. Raise as the suite grows.
      thresholds: { statements: 70, branches: 65, functions: 50, lines: 70 },
    },
  },
})
