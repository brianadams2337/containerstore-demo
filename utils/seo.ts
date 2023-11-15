import { type Brand, type Offer, type WithContext, type Product } from 'schema-dts'

const CANONICAL_PARAM_WHITELIST = [
  'page',
  'sort',
  'size',
  'brand',
  'color',
  'minPrice',
  'maxPrice',
  'categoryShopFilterSizes',
]

/**
 * Strips off all parameters (except page) from input canonical url string
 * @param url canonical
 * @returns url string
 */
export const sanitizeCanonical = (url: string | undefined): string => {
  if (!url) {
    return ''
  }
  const baseAndParams = url?.split('?')
  const baseUrl = baseAndParams?.[0]
  const parametersPart = baseAndParams?.[1] // part of url after '?'

  if (!parametersPart) {
    // no url parameters exist, so return the original url
    return url
  }
  const parametersAndValues = parametersPart.split('&')

  // For each key=value combination, check for page and filter attribute. Return the combination if found
  return `${baseUrl}?${parametersAndValues
    .filter((attribute) => !attribute.toLocaleLowerCase().includes('page=1'))
    .join('&')}`
}

/**
 * Prepares a canonical URL by removing unwanted parameters
 * @param url The URL to prepare
 * @returns The prepared URL
 */
export function prepareCanonicalURL(url: string): string {
  const [baseUrl, queryString] = url.split('?')
  if (!queryString) {
    return baseUrl
  }

  const paramStrings = queryString.split('&')

  const filteredParams = paramStrings.filter((paramString) => {
    const [paramName] = paramString.split('=')
    return CANONICAL_PARAM_WHITELIST.includes(paramName)
  })

  if (!filteredParams.length) {
    return baseUrl
  }
  return baseUrl + '?' + filteredParams.join('&')
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
