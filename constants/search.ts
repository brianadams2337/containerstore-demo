import type { SearchV2With } from '@scayle/storefront-nuxt'

export const DEBOUNCED_SEARCH_DURATION = 500 // in milliseconds
export const PRODUCT_LIMIT = 6
export const SEARCH_WITH_PARAMS: SearchV2With = {
  product: {
    attributes: {
      withKey: ['brand', 'color', 'name'],
    },
    priceRange: true,
    variants: {
      attributes: {
        withKey: ['price', 'size'],
      },
    },
    categories: 'all',
  },
  categories: {
    parents: 'all',
    children: 0,
  },
}
