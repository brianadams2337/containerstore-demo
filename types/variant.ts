import { Product, Variant } from '@scayle/storefront-nuxt'

export {}

declare global {
  type VariantWithProduct = Variant & { product: Product }
}
