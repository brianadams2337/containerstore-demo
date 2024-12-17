import type { PublicShopConfig } from '@scayle/storefront-nuxt'

export function getShopName(locale: string, includeLanguage: boolean = false) {
  const [languageCode, regionCode] = locale.split('-')

  const language = new Intl.DisplayNames([locale], {
    type: 'language',
  }).of(languageCode)
  const region = new Intl.DisplayNames([locale], {
    type: 'region',
  }).of(regionCode)

  return includeLanguage ? `${region} | ${language}` : region
}

export function hasMultipleShopsForCountry(
  shops: Pick<PublicShopConfig, 'locale'>[],
): boolean {
  const counts = shops.reduce(
    (acc, shop) => {
      const [, countryCode] = shop.locale.split('-')
      acc[countryCode] = (acc[countryCode] ?? 0) + 1

      return acc
    },
    {} as Record<string, number>,
  )

  return Object.values(counts).some((count) => count > 1)
}
