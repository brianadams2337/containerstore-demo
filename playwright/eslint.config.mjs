import eslintConfigStorefront from '@scayle/eslint-config-storefront'
import playwright from 'eslint-plugin-playwright'

export default eslintConfigStorefront({ isNuxt: false }).append({
  ...playwright.configs['flat/recommended'],
  files: ['tests/**', 'page-objects/**', 'fixtures/**'],
  rules: {
    'no-console': 'warn',
    'prefer-template': 'warn',
    'node/prefer-global/buffer': 'warn',
    'ts/consistent-type-definitions': 'warn',
    'ts/prefer-ts-expect-error': 'warn',
    'no-restricted-globals': 'warn',
    'no-cond-assign': 'warn',
  },
  ignores: ['playwright-report/', 'test-results/'],
})
