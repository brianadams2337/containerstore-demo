import { sort } from 'radash'
import {
  getFirstAttributeValue,
  isInStock,
  getAttributeValue,
  type Product,
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

  const orderedVariants = sort(variantsWithAttributes, ({ attributes }) => {
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

export const hasOneSizeProductVariantOnly = ({ variants }: Product) => {
  const hasOneVariant = variants?.length === 1
  if (!hasOneVariant) {
    return false
  }
  const sizeAttribute = getAttributeValue(variants[0].attributes, 'size')
  return sizeAttribute === ONE_SIZE_KEY
}
