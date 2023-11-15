import { getFirstAttributeValue, type Product } from '@scayle/storefront-nuxt'

export const isProductSustainable = (product: Product): boolean => {
  return SUSTAINABILITY_ATTRIBUTES.some((attr) => {
    return getFirstAttributeValue(product.attributes, attr)?.label
  })
}
