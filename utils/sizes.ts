import {
  getFirstAttributeValue,
  isInStock,
  Variant,
} from '@scayle/storefront-nuxt'

export const ONE_SIZE_KEY = 'one_size'

export type VariantSize = {
  variantId: number
  label: string
  value?: string
  isAvailable: boolean
  [key: string]: unknown
}

export const getVariantSizes = (variants?: Variant[]) => {
  return [...(variants || [])]
    .filter((variant) => {
      return variant.attributes && Object.keys(variant.attributes).length > 0
    })
    .sort((a, b) => {
      const left = getFirstAttributeValue(a.attributes, 'sort')?.value
      const right = getFirstAttributeValue(b.attributes, 'sort')?.value

      if (!left || !right) {
        return 0
      }
      return parseInt(left, 10) < parseInt(right, 10) ? -1 : 1
    })
    .map((variant) => {
      const size = getFirstAttributeValue(variant.attributes, 'size')

      return {
        variantId: variant.id,
        label: size!.label,
        value: size!.value,
        isAvailable: isInStock(variant),
      }
    })
}
