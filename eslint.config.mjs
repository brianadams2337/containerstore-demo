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
          'off',
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
        // TODO: Enable the following rules for upcoming a11y improvements
        'vuejs-accessibility/mouse-events-have-key-events': 'off',
        'vuejs-accessibility/no-static-element-interactions': 'off',
        'vuejs-accessibility/alt-text': 'off',
        'vuejs-accessibility/anchor-has-content': 'off',
        'vuejs-accessibility/aria-props': 'off',
        'vuejs-accessibility/aria-role': 'off',
        'vuejs-accessibility/aria-unsupported-elements': 'off',
        'vuejs-accessibility/click-events-have-key-events': 'off',
        'vuejs-accessibility/form-control-has-label': 'off',
        'vuejs-accessibility/heading-has-content': 'off',
        'vuejs-accessibility/iframe-has-title': 'off',
        'vuejs-accessibility/interactive-supports-focus': 'off',
        'vuejs-accessibility/label-has-for': 'off',
        'vuejs-accessibility/media-has-caption': 'off',
        'vuejs-accessibility/no-access-key': 'off',
        'vuejs-accessibility/no-autofocus': 'off',
        'vuejs-accessibility/no-distracting-elements': 'off',
        'vuejs-accessibility/no-redundant-roles': 'off',
        'vuejs-accessibility/role-has-required-aria-props': 'off',
        'vuejs-accessibility/tabindex-no-positive': 'off',
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
      '@scayle/vue-composable/no-computed-after-await': 'error',
    },
  }),
  // Custom Overrides: Storefront Boilerplate rule and config
  {
    // https://eslint.org/docs/latest/use/configure/ignore#ignorepatterns-in-config-files
    ignores: ['cypress/', '**/fixtures/**/*', 'playwright/'],
  },
  {
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
      'vue/html-self-closing': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'always',
        },
      ],
      'vue/v-bind-style': [
        'error',
        'shorthand',
        {
          sameNameShorthand: 'never',
        },
      ],
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
