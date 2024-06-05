import eslintConfigStorefront from '@scayle/eslint-config-storefront'
import tailwind from 'eslint-plugin-tailwindcss'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
// Workaround for flat config not being supported yet by eslint-plugin-tailwindcss
// https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/280
import { FlatCompat } from '@eslint/eslintrc'
import withNuxt from './.nuxt/eslint.config.mjs'

const compat = new FlatCompat()

export default withNuxt(
  eslintConfigStorefront(),
  // https://github.com/francoismassart/eslint-plugin-tailwindcss
  [
    ...tailwind.configs['flat/recommended'],
    {
      rules: {
        'tailwindcss/classnames-order': 'error',
        'tailwindcss/no-unnecessary-arbitrary-value': 'error',
        'tailwindcss/enforces-negative-arbitrary-values': 'error',
        'tailwindcss/no-custom-classname': [
          'warn',
          {
            whitelist: [
              'picture',
              'cms\\-picture',
              'picture\\-contain',
              'picture\\-cover',
              'card',
              '',
            ],
          },
        ],
      },
      settings: {
        tailwindcss: {
          /**
           * Minimize the globbing scope to improve performance
           * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/276
           * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/174
           */
          cssFiles: ['assets/css/**/*.css'],
        },
      },
    },
  ],
  [
    // https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/rule-overview/
    ...pluginVueA11y.configs['flat/recommended'],
    {
      rules: {
        // Provide warning until all existing issues have been fixed
        'vuejs-accessibility/alt-text': 'warn',
        'vuejs-accessibility/anchor-has-content': 'warn',
        'vuejs-accessibility/aria-props': 'warn',
        'vuejs-accessibility/aria-role': 'warn',
        'vuejs-accessibility/aria-unsupported-elements': 'warn',
        'vuejs-accessibility/click-events-have-key-events': 'warn',
        'vuejs-accessibility/form-control-has-label': 'warn',
        'vuejs-accessibility/heading-has-content': 'warn',
        'vuejs-accessibility/iframe-has-title': 'warn',
        'vuejs-accessibility/interactive-supports-focus': 'warn',
        'vuejs-accessibility/label-has-for': 'warn',
        'vuejs-accessibility/media-has-caption': 'warn',
        'vuejs-accessibility/mouse-events-have-key-events': 'warn',
        'vuejs-accessibility/no-access-key': 'warn',
        'vuejs-accessibility/no-autofocus': 'warn',
        'vuejs-accessibility/no-distracting-elements': 'warn',
        'vuejs-accessibility/no-redundant-roles': 'warn',
        'vuejs-accessibility/no-static-element-interactions': 'warn',
        'vuejs-accessibility/role-has-required-aria-props': 'warn',
        'vuejs-accessibility/tabindex-no-positive': 'warn',
      },
    },
  ],
  // Compatibility handling for legacy eslint@8 config
  // @scayle/vue-composable
  ...compat.config({
    plugins: ['@scayle/vue-composable'],
    rules: {
      '@scayle/vue-composable/no-composable-after-await': 'error',
      '@scayle/vue-composable/no-lifecycle-after-await': 'error',
      '@scayle/vue-composable/no-watch-after-await': 'error',
    },
  }),
  // Custom Overrides: Storefront Boilerplate rule and config
  {
    // https://eslint.org/docs/latest/use/configure/ignore#ignorepatterns-in-config-files
    ignores: ['cypress/', '**/fixtures/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'eslint-comments/no-unlimited-disable': 'warn',
      '@typescript-eslint/prefer-ts-expect-error': 'warn',
      'vue/html-self-closing': 'off',
    },
  },
  {
    ignores: ['./modules/ui/**/*'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    // Custom code styling not covered by Prettier
    rules: {
      'import/newline-after-import': ['error', { count: 1 }],
      'import/order': 'error',
    },
  },
)
