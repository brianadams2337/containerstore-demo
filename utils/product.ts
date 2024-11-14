import {
  type Price,
  type Product,
  type Variant,
  getAttributeValueTuples,
  getFirstAttributeValue,
  getLowestPrice,
} from '@scayle/storefront-nuxt'
import { getPrimaryImage } from './image'
import type { ProductSibling } from '~/types/siblings'
import type { Promotion } from '~/types/promotion'

export { ProductImageType } from '@scayle/storefront-nuxt'

export const getLowestPriceBetweenVariants = (product: Product) => {
  return product.variants && getLowestPrice(product.variants)
}

export const getVariantWithLowestPrice = (
  variants?: Variant[],
): Variant | undefined => {
  if (!variants?.length) {
    return
  }
  return variants.reduce((m: Variant, x: Variant) =>
    m.price.withoutTax < x.price.withoutTax ? m : x,
  )
}

export const getPromotionIdFromProductAttributes = (product?: Product) => {
  if (!product) {
    return
  }
  return getFirstAttributeValue(product.attributes, 'promotion')?.id
}

export const getApplicablePromotionsForProduct = (
  product: Product,
  promotions: Promotion[],
) => {
  const productPromotionId = getPromotionIdFromProductAttributes(product)
  const items = promotions.filter(({ customData }) => {
    if (!productPromotionId || !customData.product?.promotionId) {
      return false
    }
    return customData.product?.promotionId === productPromotionId
  })

  return items.toSorted((a, b) => a.priority - b.priority)
}

export const getProductSiblingData = (
  { id, images, attributes, isSoldOut }: Product,
  colorAttributeName = 'colorDetail',
): ProductSibling => ({
  id,
  name: getFirstAttributeValue(attributes, 'name')?.label ?? '',
  brand: getFirstAttributeValue(attributes, 'brand')?.label ?? '',
  image: getPrimaryImage(images) ?? images[0],
  colors: getAttributeValueTuples(attributes, colorAttributeName),
  isSoldOut,
})

export const getProductSiblings = (
  product?: Product | null,
  colorAttributeName = 'colorDetail',
  options: {
    omitSoldOut?: boolean
    includeCurrentProduct?: boolean
    sortBySoldOut?: boolean
  } = {},
): ProductSibling[] => {
  if (!product) {
    return []
  }

  const {
    omitSoldOut = false,
    includeCurrentProduct = true,
    sortBySoldOut = false,
  } = options
  const siblingItems =
    product?.siblings?.filter(({ isActive }) => {
      return omitSoldOut ? isActive : true
    }) ?? []

  const items = siblingItems.map((item) =>
    getProductSiblingData(item, colorAttributeName),
  )

  if (sortBySoldOut) {
    items.sort((a, b) => {
      const soldOutOrder = a.isSoldOut ? 1 : -1

      return a.isSoldOut === b.isSoldOut ? 0 : soldOutOrder
    })
  }

  return includeCurrentProduct
    ? [getProductSiblingData(product, colorAttributeName), ...items]
    : items
}

export const createCustomPrice = (
  price: Price,
  overwrite: Partial<Price>,
): Price => {
  return {
    ...price,
    ...overwrite,
  }
}
