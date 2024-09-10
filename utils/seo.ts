import type {
  Brand,
  Offer,
  Product,
  WithContext,
  BreadcrumbList,
} from 'schema-dts'
import { parseURL, stringifyParsedURL, parseQuery, stringifyQuery } from 'ufo'
import { isInStock, type Variant } from '@scayle/storefront-nuxt'
import type { BreadcrumbItem } from '~/types/breadcrumbs'
import { divideByHundred } from '~/utils/price'

const CANONICAL_PARAMS_WHITELIST = ['page']

/**
 * Sanitize a canonical URL by removing unwanted parameters
 * @param url The URL to prepare
 * @param whitelistParams The whitelist params to exclude
 * @returns The prepared URL
 */
export const sanitizeCanonicalURL = (
  url: string,
  whitelistParams = CANONICAL_PARAMS_WHITELIST,
): string => {
  const parsedURL = parseURL(url)

  if (!parsedURL.search) return url

  const parsedQuery = parseQuery(parsedURL.search)

  const orderedWhitelistParams = Object.keys(parsedQuery).filter((key) =>
    whitelistParams.includes(key),
  )

  const purifiedQuery = Object.fromEntries(
    orderedWhitelistParams
      .filter((key) => key in parsedQuery)
      .map((key) => [key, parsedQuery[key]]),
  )

  return stringifyParsedURL({
    ...parsedURL,
    search: stringifyQuery(purifiedQuery),
  })
}

const generateSchemaProductOffers = ({
  variants,
}: {
  variants: Variant[]
}): Offer[] => {
  return variants.map((variant) => ({
    '@type': 'Offer',
    mpn: variant.referenceKey,
    sku: variant.id.toString(),
    price: divideByHundred(variant.price.withTax),
    priceCurrency: variant.price.currencyCode,
    availability: isInStock(variant)
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
  }))
}

export const generateProductSchema = ({
  productName,
  brandName,
  variants,
  url,
  images = [],
  description,
}: {
  productName: string
  brandName: string
  variants: Variant[]
  url: string
  description: string
  images?: string[]
}): WithContext<Product> => {
  const offers = generateSchemaProductOffers({ variants })

  const brand: Brand = {
    '@type': 'Brand',
    name: brandName,
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    url,
    name: productName,
    image: images,
    description,
    brand,
    offers,
  }
}

export const generateCategoryBreadcrumbSchema = (
  breadcrumbs: BreadcrumbItem[],
): WithContext<BreadcrumbList> => {
  const itemListElement: WithContext<BreadcrumbList>['itemListElement'] =
    breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.value,
      item: item.to,
    }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}
