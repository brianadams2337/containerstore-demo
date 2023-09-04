import { BasketWithOptions, WishlistWithOptions } from '@scayle/storefront-nuxt'

export const WISHLIST_WITH = {
  items: {
    variant: {
      attributes: {
        withKey: ['price', 'size'],
      },
    },
    product: {
      attributes: 'all',
      categories: 'all',
      variants: {
        attributes: 'all',
        lowestPriorPrice: true,
      },
      images: {
        attributes: {
          withKey: ['imageType', 'imageView', 'imageBackground', 'imageKind'],
        },
      },
      priceRange: true,
      lowestPriorPrice: true,
    },
  },
} as WishlistWithOptions

export const BASKET_WITH = WISHLIST_WITH as BasketWithOptions
