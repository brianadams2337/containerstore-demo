import { sort } from 'radash'
import {
  type Variant,
  type Product,
  getLowestPrice,
  getAppliedReductionsByCategory,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export { ProductImageType } from '@scayle/storefront-nuxt'

export type ProductColorCode = string | string[]

export const ProductColorMap: Record<
  string,
  { id: number; hex: ProductColorCode }
> = {
  WHITE: { id: 6, hex: '#ffffff' },
  BEIGE: { id: 1564, hex: '#e3dad1' },
  BLACK: { id: 7, hex: '#000000' },
  GRAY: { id: 8, hex: '#888888' },
  DARK_GRAY: { id: 611, hex: '#808080' },
  RED: { id: 9, hex: '#a52a2a' },
  BLUE: { id: 10, hex: '#0000ff' },
  BRIGHT_GREEN: { id: 11, hex: '#00ff00' },
  BRIGHT_YELLOW: { id: 12, hex: '#ffff00' },
  BRIGHT_RED: { id: 13, hex: '#ff0000' },
  DULL_PINK: { id: 62, hex: '#ffc0cb' },
  YELLOW: { id: 594, hex: '#ffd700' },
  MIX: { id: 1370, hex: ['#0000ff', '#ffa500', '#ff0000', '#008000'] },
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

  return sort(items, (it) => it.priority)
}
