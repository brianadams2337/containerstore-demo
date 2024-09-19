import {
  type Price,
  type Product,
  type Variant,
  getAttributeValueTuples,
  getAppliedReductionsByCategory,
  getFirstAttributeValue,
  getLowestPrice,
  type AdvancedAttribute,
  getFlattenedAdvancedAttribute,
} from '@scayle/storefront-nuxt'
import { getPrimaryImage } from './image'
import { MINIMUM_QUANTITY_IMMEDIATE_AVAILABILITY } from '~/constants/product'
import type { ProductSibling } from '~/types/siblings'

export { ProductImageType } from '@scayle/storefront-nuxt'

export type ProductColorCode = string | string[]

export const ProductColorMap: Record<
  string,
  { id: number; hex: ProductColorCode }
> = {
  WHITE: { id: 2275, hex: '#ffffff' },
  BEIGE: { id: 2298, hex: '#e3dad1' },
  BLACK: { id: 32, hex: '#000000' },
  GRAY: { id: 2277, hex: '#6b7280' },
  RED: { id: 18, hex: '#ef4444' },
  BLUE: { id: 13, hex: '#3b82f6' },
  GREEN: { id: 23, hex: '#22c55e' },
  YELLOW: { id: 2297, hex: '#eab308' },
  ORANGE: { id: 2283, hex: '#f97316' },
  BROWN: { id: 2294, hex: '#bfa094' },
  PINK: { id: 2281, hex: '#ec4899' },
  PURPLE: { id: 2279, hex: '#a855f7' },
  MIX: { id: 28, hex: ['#0000ff', '#ffa500', '#ff0000', '#008000'] },
}

export type VariantAvailability = {
  available: boolean
  type: 'immediate' | 'soon' | 'unavailable'
  text: string
  textArgs?: unknown
}

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

export const getColorCodeById = (
  colorId: number,
): ProductColorCode | undefined => {
  const color = Object.values(ProductColorMap).find(({ id }) => id === colorId)

  if (color) {
    return color.hex
  }
}

export const getSalesRelativeAmountByCategory = (
  product: Product,
  category: 'sale' | 'campaign',
) => {
  const variantsLowestPrice = getLowestPriceBetweenVariants(product)
  return variantsLowestPrice
    ? getAppliedReductionsByCategory(variantsLowestPrice, category)
    : []
}

export function getVariantAvailability(
  variant: Variant,
  minimumQuantityForImmediateAvailability = MINIMUM_QUANTITY_IMMEDIATE_AVAILABILITY,
): VariantAvailability {
  const { quantity, isSellableWithoutStock } = variant.stock

  if (quantity > minimumQuantityForImmediateAvailability) {
    return {
      available: true,
      type: 'immediate',
      text: `availability.available`,
    }
  }

  if (quantity > 0) {
    return {
      available: true,
      type: 'soon',
      text: `availability.available_some`,
      textArgs: { quantity },
    }
  }

  if (isSellableWithoutStock) {
    return {
      available: true,
      type: 'soon',
      text: 'availability.available_asap',
    }
  }

  return {
    available: false,
    type: 'soon',
    text: 'availability.available_soon',
  }
}

export const getPromotionIdFromProductAttributes = (product?: Product) => {
  if (!product) return
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
  if (!product) return []

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

export const getCombineWithProductIds = (attribute?: AdvancedAttribute) => {
  if (!attribute) {
    return []
  }

  return (
    getFlattenedAdvancedAttribute<{ value: string }>(attribute.values)
      ?.map((item) => item.value)
      ?.map((value) => Number.parseInt(value))
      ?.filter((value) => !Number.isNaN(value)) || []
  )
}
