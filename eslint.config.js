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
  { rules: { 'no-empty': ['error', { allowEmptyCatch: true }] } },
  prettier,
)
