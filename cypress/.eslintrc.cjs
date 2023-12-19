module.exports = {
  root: true,
  extends: [
    'plugin:cypress/recommended',
    // NOTE: ⇧ Place new eslint configs above this line ⇧
    // ---
    // We need to load the SCAYLE shared eslint configs after all
    // 3rd party shared eslint configs to avoid import order incompatibilities
    // within internally merged eslint config and prettier.

    '@scayle/eslint-config-storefront',
  ],
  plugins: ['cypress'],
  // https://eslint.org/docs/latest/use/configure/ignore#ignorepatterns-in-config-files
  ignorePatterns: ['**/fixtures/**/*'],
  rules: {
    'cypress/no-unnecessary-waiting': 'off',
        'cypress/unsafe-to-chain-command': 'off',
        'sonarjs/no-duplicate-string': 1,
  },
}
