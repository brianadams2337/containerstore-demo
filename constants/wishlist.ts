import type { WishlistWithOptions } from '@scayle/storefront-nuxt'

export const WISHLIST_WITH_PARAMS: WishlistWithOptions = {
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
}
