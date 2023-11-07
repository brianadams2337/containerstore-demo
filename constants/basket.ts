import { BasketWithOptions } from '@scayle/storefront-nuxt'

export const BASKET_WITH_PARAMS: BasketWithOptions = {
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
    promotion: true,
  },
  applicablePromotions: true,
}
