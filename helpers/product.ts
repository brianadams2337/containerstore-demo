import {
  getBadgeLabel,
  getLowestPrice,
  getPrice,
  getProductColors,
  getSizeFromSpecificVariant,
  getSizeFromVariant,
  getVariant,
  Product,
  ProductImageType,
  getAppliedReductionsByCategory,
  Variant,
} from '@scayle/storefront-nuxt'
import { ColorMap } from '~/constants'

export interface VariantAvailability {
  available: boolean
  type: 'immediate' | 'soon' | 'unavailable'
  text: string
  textArgs?: any
}

const getColorCodeForId = (id: number): string | string[] => {
  const color = Object.values(ColorMap).find((it) => it.id === id)

  if (color) {
    return color.hex
  }

  console.log('No color found for', id)

  return ColorMap.WHITE.hex
}

const getVariantWithLowestPrice = (
  variants: Variant[] | undefined,
): Variant | undefined => {
  if (!variants?.length) {
    return
  }
  return variants.reduce((m: Variant, x: Variant) =>
    m.price.withoutTax < x.price.withoutTax ? m : x,
  )
}

export function getVariantAvailability(
  variant: Variant,
  minimumQuantityForImmediateAvaliability = 5,
): VariantAvailability {
  const { quantity, isSellableWithoutStock } = variant.stock

  if (quantity > minimumQuantityForImmediateAvaliability) {
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

const getLowestPriceBetweenVariants = (product: Product) =>
  product.variants && getLowestPrice(product.variants)

const getSalesRelativeAmountByCategory = (
  product: Product,
  category: 'sale' | 'campaign',
) => {
  const variantsLowestPrice = getLowestPriceBetweenVariants(product)
  return variantsLowestPrice
    ? getAppliedReductionsByCategory(variantsLowestPrice, category)
    : []
}

export default {
  getBadgeLabel,
  getPrice,
  getLowestPrice,
  ProductImageType,
  getLowestPriceBetweenVariants,
  getColorCodeForId,
  getProductColors,
  getSizeFromVariant,
  getSalesRelativeAmountByCategory,
  getSizeFromSpecificVariant,
  getVariant,
  getVariantWithLowestPrice,
  getVariantAvailability,
}
