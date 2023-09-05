import { BasketWithOptions, WishlistWithOptions } from '@scayle/storefront-nuxt'

const WISHLIST_WITH: WishlistWithOptions = {
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

const BASKET_WITH: BasketWithOptions = WISHLIST_WITH

export default {
  wishlist: WISHLIST_WITH,
  basket: BASKET_WITH,
}
