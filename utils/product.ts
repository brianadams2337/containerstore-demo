import {
  Variant,
  Product,
  getLowestPrice,
  getAppliedReductionsByCategory,
} from '@scayle/storefront-nuxt'
import { ColorMap } from '~/constants/color'

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

export const getSalesRelativeAmountByCategory = (
  product: Product,
  category: 'sale' | 'campaign',
) => {
  const variantsLowestPrice = getLowestPriceBetweenVariants(product)
  return variantsLowestPrice
    ? getAppliedReductionsByCategory(variantsLowestPrice, category)
    : []
}
