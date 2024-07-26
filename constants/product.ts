import type { ProductWith } from '@scayle/storefront-nuxt'

export const ProductsPerRow = {
  MOBILE: 2,
  TABLET: 3,
  DESKTOP: 4,
} as const

export const PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE = 8
export const PRODUCT_CARD_SKELETON_LOADERS_SIZE = 20
export const PRODUCT_CARD_SIBLINGS_LIMIT = 4
export const FETCH_PRODUCTS_CACHE_TTL = 1000
export const PRODUCTS_PER_PAGE = 60
export const MINIMUM_QUANTITY_IMMEDIATE_AVAILABILITY = 5
export const PRODUCT_IMAGE_QUALITY_MODIFIER = '75'

export const PRODUCT_WITH_PARAMS: ProductWith = {
  attributes: 'all',
  advancedAttributes: 'all',
  variants: {
    attributes: 'all',
    lowestPriorPrice: true,
  },
  images: {
    attributes: {
      withKey: ['primaryImage'],
    },
  },
  categories: 'all',
  siblings: {
    images: {
      attributes: {
        withKey: ['primaryImage'],
      },
    },
    attributes: {
      withKey: ['color', 'name', 'brand'],
    },
  },
  priceRange: true,
  lowestPriorPrice: true,
}

export const productListingMetaData = {
  name: 'PDP',
  id: 'PDP',
} as const
