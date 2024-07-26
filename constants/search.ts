import type { SearchV2With, ProductWith } from '@scayle/storefront-nuxt'

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

export const SEARCH_PRODUCTS_WITH_PARAMS: ProductWith = {
  attributes: {
    withKey: ['color', 'brand', 'name'],
  },
  variants: {
    attributes: {
      withKey: ['price', 'size'],
    },
    lowestPriorPrice: true,
  },
  images: {
    attributes: {
      withKey: ['imageType', 'imageView', 'imageBackground', 'imageKind'],
    },
  },
  siblings: {
    images: {
      attributes: {
        withKey: ['imageType', 'imageView', 'imageBackground'],
      },
    },
    attributes: {
      withKey: ['color', 'name', 'brand'],
    },
  },
  priceRange: true,
  lowestPriorPrice: true,
}

export const SEARCH_PRODUCTS_PER_PAGE = 60
