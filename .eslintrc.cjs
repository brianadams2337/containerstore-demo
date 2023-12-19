module.exports = {
  root: true,
  extends: [
    'plugin:nuxt/recommended',
    'plugin:tailwindcss/recommended',
    // NOTE: ⇧ Place new eslint configs above this line ⇧
    // ---
    // We need to load the SCAYLE shared eslint configs after all
    // 3rd party shared eslint configs to avoid import order incompatibilities
    // within internally merged eslint config and prettier.
    '@scayle/eslint-config-storefront/nuxt/nuxt',
    '@scayle/eslint-config-storefront',
  ],
  // https://eslint.org/docs/latest/use/configure/ignore#ignorepatterns-in-config-files
  ignorePatterns: ['cypress/', '**/fixtures/**/*'],
  rules: {
    'tailwindcss/no-custom-classname': [
      'warn',
      {
        whitelist: [
          'picture',
          'cms\\-picture',
          'picture\\-contain',
          'picture\\-cover',
          'card',
          'swipeout-action',
        ],
      },
    ],
    'tailwindcss/classnames-order': 'error',
    'vue/multi-word-component-names': 'warn',
  },
  settings: {
    /**
     * Minimize the globbing scope to improve performance
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/276
     * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/174
     */
    tailwindcss: {
      cssFiles: ['assets/css/**/*.css'],
    },
  },
}
