interface ShopAndLocaleConfig {
  /** A BCP-47 format locale code (e.g. 'de-DE') */
  locale: string
  /** A unique identifying code for the shop/locale. Also used to create the shop's default path prefix. (e.g. 'de') */
  code: string | string[]
  /** The shopId */
  shopId: number
  /** The ISO 4217 currency code for the shop (e.g. 'EUR') */
  currency: string
  /** Flag the current shop as the default.
   * With `path` selection the default shop will be redirected to when loading the base route.
   * With `path_or_default` selection the default shop will use the base route itself */
  isDefault: boolean
  /** The file with the translations to load for the shop/locale (relative to /langs) */
  translationFile: string
}

/**
 * List of configurations to be used to define the `stores` list for `storefront-nuxt` and `locales` for `nuxt-i18n`
 *
 */
export const shops: ShopAndLocaleConfig[] = [
  {
    locale: 'de-DE',
    code: 'de',
    shopId: 1001,
    currency: 'EUR',
    isDefault: true,
    translationFile: 'de-DE.json',
  },
  {
    locale: 'de-AT',
    code: 'at',
    shopId: 1018,
    currency: 'EUR',
    isDefault: false,
    translationFile: 'de-DE.json',
  },
  {
    locale: 'de-CH',
    code: 'ch',
    shopId: 1019,
    currency: 'EUR',
    isDefault: false,
    translationFile: 'de-DE.json',
  },
  {
    locale: 'en-US',
    code: ['en', 'en-us'],
    shopId: 1028,
    currency: 'USD',
    isDefault: false,
    translationFile: 'en-GB.json',
  },
]
