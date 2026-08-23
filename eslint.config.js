import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'dist-site', 'coverage', 'node_modules', '.shots', '.claude'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    // build/test config + node scripts: Node globals, plus the browser globals
    // used inside Playwright page.evaluate() callbacks in the shoot scripts.
    files: ['**/*.config.{ts,js}', 'scripts/**', '**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    // A selectable, openable table is the ARIA `grid` pattern: the row is what
    // carries selection, activation and the grid's one tab stop. Both rules
    // judge a <tr> by its implicit `row` role, which they class as
    // non-interactive — true of a static table, and wrong of a grid.
    files: ['src/components/Table/Table.tsx'],
    rules: {
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-tabindex': 'off',
    },
  },
  { rules: { 'no-empty': ['error', { allowEmptyCatch: true }] } },
  prettier,
)
