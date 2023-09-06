import { getFirstAttributeValue, Product } from '@scayle/storefront-nuxt'
import { sustainabilityAttributes } from '~/constants'

export const isProductSustainable = (product: Product): boolean => {
  return sustainabilityAttributes.some((attr) => {
    return getFirstAttributeValue(product.attributes, attr)?.label
  })
}
