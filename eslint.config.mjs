import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigStorefront from '@scayle/eslint-config-storefront'

// Workaround for flat config not being supported yet by eslint-plugin-tailwindcss
// https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/280
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default withNuxt(
  eslintConfigStorefront(),
  // Compatibility handling for legacy eslint@8 config
  // https://github.com/francoismassart/eslint-plugin-tailwindcss
  ...compat.config({
    extends: ['plugin:tailwindcss/recommended'],
    rules: {
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: [
            'picture',
            'cms\\-picture',
            'picture\\-contain',
            'picture\\-cover',
            'card',
          ],
        },
      ],
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
  }),
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
)
