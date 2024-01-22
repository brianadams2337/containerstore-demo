import {
  getFirstAttributeValue,
  isInStock,
  type Variant,
} from '@scayle/storefront-nuxt'

export type VariantSize = {
  variantId: number
  label: string
  value?: string
  isAvailable: boolean
  [key: string]: unknown
}

export const getVariantSizes = (variants: Variant[] = []) => {
  const variantsWithAttributes = [...variants].filter(({ attributes }) => {
    return attributes && Object.keys(attributes).length > 0
  })

  const orderedVariants = _sort(variantsWithAttributes, ({ attributes }) => {
    const sortAttribute = getFirstAttributeValue(attributes, 'sort')?.value
    return sortAttribute ? Number(sortAttribute) : 0
  })

  return orderedVariants.map((variant) => {
    const size = getFirstAttributeValue(variant.attributes, 'size')!

    return {
      variantId: variant.id,
      label: size.label,
      value: size.value,
      isAvailable: isInStock(variant),
    }
  })
}
