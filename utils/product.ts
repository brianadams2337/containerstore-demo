import {
  Variant,
  Product,
  getLowestPrice,
  getAppliedReductionsByCategory,
} from '@scayle/storefront-nuxt'
import { ColorMap } from '~/constants'
import { VariantAvailability } from '~/types'

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

export const getColorCodeForId = (id: number): string | string[] => {
  const color = Object.values(ColorMap).find((it) => it.id === id)

  if (color) {
    return color.hex
  }

  console.log('No color found for', id)

  return ColorMap.WHITE.hex
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

export const getSalesRelativeAmountByCategory = (
  product: Product,
  category: 'sale' | 'campaign',
) => {
  const variantsLowestPrice = getLowestPriceBetweenVariants(product)
  return variantsLowestPrice
    ? getAppliedReductionsByCategory(variantsLowestPrice, category)
    : []
}
