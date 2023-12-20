module.exports = {
  extends: [
    // https://github.com/stylelint/stylelint-config-standard
    'stylelint-config-standard',
    // https://github.com/prettier/stylelint-config-prettier
    'stylelint-config-prettier',
  ],
  // https://github.com/kristerkari/stylelint-high-performance-animation
  plugins: ['stylelint-high-performance-animation'],
  // https://stylelint.io/user-guide/configure#rules
  rules: {
    // Color Rules
    'color-hex-length': 'long',
    'color-function-notation': 'modern',

    // Values
    'alpha-value-notation': 'number',

    // Nesting Rules
    'max-nesting-depth': 3,

    // Import (string / url)
    'import-notation': 'string',

    // Declaration & Import Rules
    'at-rule-no-unknown': undefined,
    'declaration-block-no-redundant-longhand-properties': [
      true,
      { ignoreShorthands: ['/flex/'] },
    ],

    // Animation Rules
    'plugin/no-low-performance-animation-properties': true,
  },
  // https://stylelint.io/user-guide/configure#overrides
  overrides: [
    {
      // Use Vue/SCSS config only for Vue SFC files
      files: ['**/*.vue'],
      // https://github.com/ota-meshi/stylelint-config-recommended-vue
      extends: ['stylelint-config-recommended-vue/scss'],
    },
  ],
}
