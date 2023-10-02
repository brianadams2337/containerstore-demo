import { SearchWith } from '@scayle/storefront-nuxt'

export const DEBOUNCED_SEARCH_DURATION = 500 // in milliseconds
export const MIN_CHARS_FOR_SEARCH = 3
export const PRODUCT_LIMIT = 6
export const CATEGORY_LIMIT = 5

export const SEARCH_WITH_PARAMS: SearchWith = {
  products: {
    attributes: {
      withKey: ['color', 'brand', 'name'],
    },
    priceRange: true,
    categories: 'all',
  },
  categories: {
    parents: 'all',
    children: 10,
  },
}
