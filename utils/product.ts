import {
  type Price,
  type Product,
  type Variant,
  getAttributeValueTuples,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'
import type { BasketItemPrice } from '@scayle/storefront-api'
import { getPrimaryImage } from './image'
import type { ProductSibling } from '~/types/siblings'
import type { Promotion } from '~/types/promotion'

export { ProductImageType } from '@scayle/storefront-nuxt'

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

/**
 * Creates a new price object by merging the original price with any overwrite properties.
 *
 * @param price - The original price object.
 * @param overwrite - Optional overwrite properties for the price object.
 * @returns A new price object with merged properties.
 */
export const createCustomPrice = <T = Price | BasketItemPrice>(
  price: T,
  overwrite: Partial<T>,
): T => {
  return {
    ...price,
    ...overwrite,
  }
}
/**
 * Returns the maximum allowed quantity for a variant, taking into account stock and an upper limit of 10.
 *
 * @param variant - The variant to get the max quantity for
 * @returns The maximum allowed quantity
 */
// Note: The basket does not allow a quantity > 50, therefore we limit it to prevent errors
export const getMaxQuantity = (variant?: Variant) =>
  Math.max(Math.min(variant?.stock?.quantity ?? 1, 10), 0)
