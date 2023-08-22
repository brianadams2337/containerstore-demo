const DE_DOMAIN_FILE = 'de-De.json'
const locales = [
  {
    code: 'en',
    iso: 'en-GB',
    domain: '',
    file: 'en-GB.json',
  },
  {
    code: 'de',
    iso: 'de-DE',
    domain: '',
    file: DE_DOMAIN_FILE,
    shopId: 1001,
  },
  {
    code: 'de-at',
    iso: 'de-AT',
    domain: '',
    file: DE_DOMAIN_FILE,
  },
  {
    code: 'de-ch',
    iso: 'de-CH',
    domain: '',
    file: DE_DOMAIN_FILE,
  },
]

export default {
  locales,
  differentDomains: false,
  detectBrowserLanguage: false as const,
  defaultLocale: 'de',
  langDir: 'langs/',
  lazy: true,
  strategy: 'prefix' as const,
  vueI18n: './i18n.config.ts',
}
