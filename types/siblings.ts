import type { ProductImage, Value } from '@scayle/storefront-nuxt'

export type ProductSibling = {
  id: number
  name: string
  brand: string
  image: ProductImage | null
  colors: Value[]
  isSoldOut: boolean
}
