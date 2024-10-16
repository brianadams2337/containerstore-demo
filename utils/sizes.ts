import { type Product, getAttributeValue } from '@scayle/storefront-nuxt'
import { ONE_SIZE_KEY } from '~/constants/attributes'

export const hasOneSizeProductVariantOnly = ({ variants }: Product) => {
  const hasOneVariant = variants?.length === 1
  if (!hasOneVariant) {
    return false
  }
  const sizeAttribute = getAttributeValue(variants[0].attributes, 'size')
  return sizeAttribute === ONE_SIZE_KEY
}
