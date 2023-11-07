import { ProductWith } from '@scayle/storefront-nuxt'

export const MINIMUM_QUANTITY_IMMEDIATE_AVAILABILITY = 5
export const PRODUCT_WITH_PARAMS: ProductWith = {
  attributes: {
    withKey: [
      'color',
      'brand',
      'name',
      'promotion',
      'fastenerType',
      'design',
      'extras',
      'material',
      'print',
      'careInstructions',
      'fitting',
      'upperLength',
      'sleeveLength',
      'shirtCut',
      'shortsLength',
      'trousersLength',
      'skirtLength',
      'neckline',
      'trousersCut',
    ],
  },
  advancedAttributes: {
    withKey: [
      'materialCompositionTextile',
      'productDescription',
      'combineWith',
      'additionalService',
    ],
  },
  variants: {
    attributes: {
      withKey: ['price', 'size'],
    },
    lowestPriorPrice: true,
  },
  images: {
    attributes: {
      withKey: ['imageType', 'imageView', 'imageBackground'],
    },
  },
  categories: 'all',
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
