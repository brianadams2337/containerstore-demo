import type {
  Brand,
  Offer,
  Product,
  WithContext,
  BreadcrumbList,
} from 'schema-dts'
import { parseURL, stringifyParsedURL, parseQuery, stringifyQuery } from 'ufo'
import { pick } from 'radash'
import type { BreadcrumbItem } from '~/types/breadcrumbs'

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

  const purifiedQuery = pick(parsedQuery, orderedWhitelistParams)

  return stringifyParsedURL({
    ...parsedURL,
    search: stringifyQuery(purifiedQuery),
  })
}

const generateSchemaProductOffers = ({
  price,
  isInStock = false,
  priceCurrency = 'EUR',
}: {
  price: string
  isInStock: boolean
  priceCurrency?: string
}): Offer => {
  return {
    '@type': 'Offer',
    priceCurrency,
    price,
    availability: isInStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    ...(isInStock && { itemCondition: 'https://schema.org/NewCondition' }),
  }
}

export const generateProductSchema = ({
  price,
  productName,
  brandName,
  url,
  isInStock = false,
  images = [],
  priceCurrency,
}: {
  price: string
  productName: string
  brandName: string
  url: string
  isInStock?: boolean
  images?: string[]
  priceCurrency?: string
}): WithContext<Product> => {
  const offers = generateSchemaProductOffers({
    price,
    isInStock,
    priceCurrency,
  })

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
