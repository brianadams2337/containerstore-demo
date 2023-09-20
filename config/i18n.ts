import { NuxtConfig } from '@nuxt/schema'
import environment from '../environment'
import { domains } from './domains'

type ModuleOptions = NuxtConfig['i18n']

const DE_DOMAIN_FILE = 'de-DE.json'

const locales = [
  {
    code: 'en',
    iso: 'en-GB',
    domain: environment.NUXT_STOREFRONT_DOMAIN_PER_LOCALE
      ? domains.en
      : domains.default,
    file: 'en-GB.json',
  },
  {
    code: 'de',
    iso: 'de-DE',
    domain: environment.NUXT_STOREFRONT_DOMAIN_PER_LOCALE
      ? domains.de
      : domains.default,
    file: DE_DOMAIN_FILE,
    shopId: 1001,
  },
  {
    code: 'de-at',
    iso: 'de-AT',
    domain: environment.NUXT_STOREFRONT_DOMAIN_PER_LOCALE
      ? domains['de-at']
      : domains.default,
    file: DE_DOMAIN_FILE,
  },
  {
    code: 'de-ch',
    iso: 'de-CH',
    domain: environment.NUXT_STOREFRONT_DOMAIN_PER_LOCALE
      ? domains['de-ch']
      : domains.default,
    file: DE_DOMAIN_FILE,
  },
]

const options: ModuleOptions = {
  locales,
  differentDomains: false,
  detectBrowserLanguage: false,
  defaultLocale: 'en',
  langDir: 'langs/',
  lazy: true,
  strategy: 'prefix',
  vueI18n: './i18n.config.ts',
}

export default options
