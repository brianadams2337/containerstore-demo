import { config } from '@vue/test-utils'
import { createI18n } from '#i18n'
import de from '~/i18n/locales/de_DE.json'
// With the current 8.5.5 of @nuxtjs/i18n i18n is not created in tests.
// This is a workaround to make code which used `useI18n` testable.
// https://github.com/nuxt-modules/i18n/issues/2637
config.global.plugins.push(
  createI18n({
    legacy: false,
    locale: 'de',
    messages: { de, at: {}, en: {}, ch: {}, 'en-US': {} },
  }),
)
